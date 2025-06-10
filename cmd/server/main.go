package main

import (
	"context"
	"fmt"
	"github.com/lazy-boy4/cuet-class-nectar/internal/handlers"
	sbClient "github.com/lazy-boy4/cuet-class-nectar/internal/supabase"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}
		parts := strings.Split(tokenString, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			c.Abort()
			return
		}
		accessToken := parts[1]
		client := sbClient.GetClient()
		if client == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Supabase client not available for auth"})
			c.Abort()
			return
		}
		user, err := client.Auth.User(context.Background(), accessToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token: " + err.Error()})
			c.Abort()
			return
		}
		if user == nil || user.ID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token valid but no user found or user ID is empty"})
			c.Abort()
			return
		}
		c.Set("userID", user.ID)
		c.Set("userEmail", user.Email)
		// User role is fetched by AdminRequired/TeacherRequired middlewares when they are used.
		c.Next()
	}
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on env variables.")
	}
	if err := sbClient.InitSupabaseClient(); err != nil {
		log.Fatalf("Failed to initialize Supabase client: %v", err)
	}

	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	api := router.Group("/api")
	{
		// Auth routes
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/signup", handlers.SignUpHandler)
			authRoutes.POST("/login", handlers.SignInHandler)
		}

		// General User routes (e.g., /me)
		userRoutes := api.Group("/users")
		userRoutes.Use(AuthMiddleware())
		{
			userRoutes.GET("/me", func(c *gin.Context) {
				userID, _ := c.Get("userID")
				userEmail, _ := c.Get("userEmail")
				c.JSON(http.StatusOK, gin.H{"message": "Protected route: user details", "userID": userID, "email": userEmail})
			})
		}

		// Admin Routes
		adminRoutes := api.Group("/admin")
		adminRoutes.Use(AuthMiddleware())
		adminRoutes.Use(handlers.AdminRequired())
		{
			departmentAdminRoutes := adminRoutes.Group("/departments")
			{
				departmentAdminRoutes.POST("", handlers.CreateDepartmentHandler)
				departmentAdminRoutes.GET("", handlers.GetDepartmentsHandler)
				departmentAdminRoutes.GET("/:id", handlers.GetDepartmentHandler)
				departmentAdminRoutes.PUT("/:id", handlers.UpdateDepartmentHandler)
				departmentAdminRoutes.DELETE("/:id", handlers.DeleteDepartmentHandler)
			}

			courseAdminRoutes := adminRoutes.Group("/courses")
			{
				courseAdminRoutes.POST("", handlers.CreateCourseHandler)
				courseAdminRoutes.GET("", handlers.GetCoursesHandler)
				courseAdminRoutes.GET("/:id", handlers.GetCourseHandler)
				courseAdminRoutes.PUT("/:id", handlers.UpdateCourseHandler)
				courseAdminRoutes.DELETE("/:id", handlers.DeleteCourseHandler)
			}

			classAdminRoutes := adminRoutes.Group("/classes")
			{
				classAdminRoutes.POST("", handlers.CreateClassHandler)
				classAdminRoutes.GET("", handlers.GetClassesHandler)
				classAdminRoutes.GET("/:id", handlers.GetClassHandler)
				classAdminRoutes.PUT("/:id", handlers.UpdateClassHandler)
				classAdminRoutes.DELETE("/:id", handlers.DeleteClassHandler)
				classAdminRoutes.GET("/:classId/teachers", handlers.GetTeachersByClassHandler) // Changed from adminRoutes.GET to classAdminRoutes.GET
			}

			userAdminRoutes := adminRoutes.Group("/users")
			{
				userAdminRoutes.POST("", handlers.AdminCreateUserHandler)
				userAdminRoutes.GET("", handlers.GetUsersHandler)
				userAdminRoutes.GET("/:id", handlers.GetUserHandler)
				userAdminRoutes.PUT("/:id", handlers.AdminUpdateUserHandler)
				userAdminRoutes.DELETE("/:id", handlers.AdminDeleteUserHandler)
				userAdminRoutes.POST("/:userId/promote-cr", handlers.PromoteStudentToCRHandler)
				userAdminRoutes.POST("/:userId/demote-cr", handlers.DemoteCRToStudentHandler)
			}

			adminRoutes.POST("/students/bulk-upload-profiles", handlers.BulkUploadStudentsHandler)

			classTeacherAssignRoutes := adminRoutes.Group("/class-teacher-assignments")
			{
				classTeacherAssignRoutes.POST("/assign", handlers.AssignTeachersToClassHandler)
				classTeacherAssignRoutes.POST("/unassign", handlers.UnassignTeachersFromClassHandler)
			}

			// Admin can also post global notices (class_id is null)
			// This uses the same CreateClassNoticeHandler but relies on AdminRequired to allow nil ClassID.
			// The handler logic would need to allow nil ClassID if user is admin.
			// For clarity, a separate AdminCreateGlobalNoticeHandler might be better.
			// For now, assuming CreateClassNoticeHandler can be used by admin for global if logic allows.
			// Let's add a specific route for global notices by admin for clarity.
			adminRoutes.POST("/notices/global", handlers.CreateClassNoticeHandler) // Admin posts global notice
			// Admins can also manage any notice (update/delete), these routes could be added if needed
			// e.g. adminRoutes.PUT("/notices/:noticeId", adminHandlers.AdminUpdateNoticeHandler)
			//      adminRoutes.DELETE("/notices/:noticeId", adminHandlers.AdminDeleteNoticeHandler)
		}

		// Teacher Routes (also accessible by Admin due to TeacherRequired logic)
		teacherApi := api.Group("/teacher")
		teacherApi.Use(AuthMiddleware())
		teacherApi.Use(handlers.TeacherRequired())
		{
			teacherApi.POST("/notices", handlers.CreateClassNoticeHandler)
			teacherApi.GET("/classes/:classId/notices", handlers.GetNoticesByClassForTeacherHandler)
			teacherApi.PUT("/notices/:noticeId", handlers.UpdateOwnNoticeHandler)
			teacherApi.DELETE("/notices/:noticeId", handlers.DeleteOwnNoticeHandler)
		}

		// General Authenticated User Routes for Notices
		noticeUserApi := api.Group("/notices")
		noticeUserApi.Use(AuthMiddleware())
		{
			noticeUserApi.GET("/global", handlers.GetGlobalNoticesHandler) // Any authenticated user can see global notices
			// Route to get notices for a specific class (student/cr might use this if they are enrolled)
			// This is similar to teacherApi.GET("/classes/:classId/notices", ...)
			// but would have different authorization (e.g. student enrolled in class)
			// For now, GetNoticesByClassForTeacherHandler is specific to teachers/admins for a class they manage.
			// A general "/classes/:classId/notices" for students would need different auth.
		}
	}

	router.GET("/ping", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "pong"}) })
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server (with teacher notice routes) starting on port http://localhost:%s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
