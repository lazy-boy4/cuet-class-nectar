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
	// "github.com/nedpals/supabase-go" // Not directly needed in main

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// var _ *supabase.OrderOpts // Removed

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
		// Role is fetched by AdminRequired/TeacherRequired/CRRequired middlewares themselves.
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
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/signup", handlers.SignUpHandler)
			authRoutes.POST("/login", handlers.SignInHandler)
		}

		userRoutes := api.Group("/users")
		{
			userRoutes.Use(AuthMiddleware())
			userRoutes.GET("/me", func(c *gin.Context) {
				userID, _ := c.Get("userID")
				userEmail, _ := c.Get("userEmail")
				// userRole, _ := c.Get("userRole") // Role is not consistently set by AuthMiddleware alone
				c.JSON(http.StatusOK, gin.H{"message": "Protected route: user details", "userID": userID, "email": userEmail /*, "role": userRole*/})
			})
		}

		adminRoutes := api.Group("/admin")
		adminRoutes.Use(AuthMiddleware())
		adminRoutes.Use(handlers.AdminRequired())
		{
			deptAdm := adminRoutes.Group("/departments")
			{
				deptAdm.POST("", handlers.CreateDepartmentHandler)
				deptAdm.GET("", handlers.GetDepartmentsHandler)
				deptAdm.GET("/:id", handlers.GetDepartmentHandler)
				deptAdm.PUT("/:id", handlers.UpdateDepartmentHandler)
				deptAdm.DELETE("/:id", handlers.DeleteDepartmentHandler)
			}
			courseAdm := adminRoutes.Group("/courses")
			{
				courseAdm.POST("", handlers.CreateCourseHandler)
				courseAdm.GET("", handlers.GetCoursesHandler)
				courseAdm.GET("/:id", handlers.GetCourseHandler)
				courseAdm.PUT("/:id", handlers.UpdateCourseHandler)
				courseAdm.DELETE("/:id", handlers.DeleteCourseHandler)
			}
			classAdm := adminRoutes.Group("/classes")
			{
				classAdm.POST("", handlers.CreateClassHandler)
				classAdm.GET("", handlers.GetClassesHandler)
				classAdm.GET("/:id", handlers.GetClassHandler)
				classAdm.PUT("/:id", handlers.UpdateClassHandler)
				classAdm.DELETE("/:id", handlers.DeleteClassHandler)
				classAdm.GET("/:classId/teachers", handlers.GetTeachersByClassHandler)
			}
			userAdm := adminRoutes.Group("/users")
			{
				userAdm.POST("", handlers.AdminCreateUserHandler)
				userAdm.GET("", handlers.GetUsersHandler)
				userAdm.GET("/:id", handlers.GetUserHandler)
				userAdm.PUT("/:id", handlers.AdminUpdateUserHandler)
				userAdm.DELETE("/:id", handlers.AdminDeleteUserHandler)
				userAdm.POST("/:userId/promote-cr", handlers.PromoteStudentToCRHandler)
				userAdm.POST("/:userId/demote-cr", handlers.DemoteCRToStudentHandler)
			}
			adminRoutes.POST("/students/bulk-upload-profiles", handlers.BulkUploadStudentsHandler)
			ctAssignAdm := adminRoutes.Group("/class-teacher-assignments")
			{
				ctAssignAdm.POST("/assign", handlers.AssignTeachersToClassHandler)
				ctAssignAdm.POST("/unassign", handlers.UnassignTeachersFromClassHandler)
			}
			adminRoutes.POST("/notices/global", handlers.CreateGlobalNoticeHandler)
		}

		teacherApi := api.Group("/teacher")
		teacherApi.Use(AuthMiddleware())
		teacherApi.Use(handlers.TeacherRequired())
		{
			teacherApi.POST("/notices", handlers.CreateClassNoticeHandler)
			teacherApi.GET("/classes/:classId/notices", handlers.GetNoticesByClassForTeacherHandler)
			teacherApi.PUT("/notices/:noticeId", handlers.UpdateOwnNoticeHandler)
			teacherApi.DELETE("/notices/:noticeId", handlers.DeleteOwnNoticeHandler)
			teacherApi.POST("/classes/:classId/attendance", handlers.UpsertAttendanceHandler)
			teacherApi.GET("/classes/:classId/attendance", handlers.GetAttendanceByClassAndDateHandler)
			scheduleRouteGroup := teacherApi.Group("/classes/:classId/schedule-entries")
			{
				scheduleRouteGroup.POST("", handlers.CreateScheduleEntryHandler)
				scheduleRouteGroup.GET("", handlers.GetScheduleByClassHandler)
			}
			teacherApi.PUT("/schedule-entries/:entryId", handlers.UpdateScheduleEntryHandler)
			teacherApi.DELETE("/schedule-entries/:entryId", handlers.DeleteScheduleEntryHandler)
			teacherApi.GET("/dashboard", handlers.GetTeacherDashboardHandler)
		}

		studentApi := api.Group("/student")
		studentApi.Use(AuthMiddleware())
		{
			studentApi.GET("/dashboard", handlers.GetStudentDashboardHandler)
			studentApi.GET("/profile", handlers.GetOwnProfileHandler)
			studentApi.PUT("/profile", handlers.UpdateOwnProfileHandler)

			studentApi.POST("/enrollments/request", handlers.CreateEnrollmentRequestHandler)
			studentApi.GET("/enrollments", handlers.GetMyEnrollmentsHandler)
			studentApi.GET("/available-classes", handlers.ListAvailableClassesForEnrollmentHandler)

			// CR specific routes for enrollment management
			crEnrollmentRoutes := studentApi.Group("/classes/:classId/enrollments") // Path for CR actions on a class
			crEnrollmentRoutes.Use(handlers.CRRequiredMiddleware())
			{
				crEnrollmentRoutes.GET("/pending", handlers.GetPendingEnrollmentsForClassHandler)
				crEnrollmentRoutes.POST("/review", handlers.ReviewEnrollmentRequestHandler)
			}
		}

		sharedApi := api.Group("/shared")
		sharedApi.Use(AuthMiddleware())
		{
			sharedApi.GET("/notices/global", handlers.GetGlobalNoticesHandler)
			sharedApi.GET("/classes/:classId/students/:studentId/attendance", handlers.GetStudentAttendanceInClassHandler)
			sharedApi.GET("/classes/:classId/schedule", handlers.GetScheduleByClassHandler)
		}
	}

	router.GET("/ping", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "pong"}) })
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server (with CR enrollment review) starting on port http://localhost:%s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
