package handlers

import (
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"net/http"
	"strings" // Added import for strings

	"github.com/gin-gonic/gin"
)

// AdminRequired is a middleware to ensure the user is an admin.
// It should be used AFTER the AuthMiddleware.
func AdminRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDValue, exists := c.Get("userID")
		if !exists {
			// This case should ideally be caught by AuthMiddleware if it always sets userID
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context. Ensure AuthMiddleware runs before AdminRequired."})
			c.Abort()
			return
		}

		userID, ok := userIDValue.(string)
		if !ok || userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid User ID format in context."})
			c.Abort()
			return
		}

		role, err := services.GetUserRole(userID)
		if err != nil {
			// Log the actual error for server-side diagnosis
			// log.Printf("Error in GetUserRole for userID %s: %v", userID, err)

			// Check if the error indicates user not found or role not found specifically
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "is empty") {
				c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: User profile incomplete or role not assigned."})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user role."})
			}
			c.Abort()
			return
		}

		if role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: Admin privileges required."})
			c.Abort()
			return
		}

		// If execution reaches here, user is an admin.
		c.Set("userRole", role) // Optionally set the role in context for subsequent handlers
		c.Next()
	}
}

// TeacherRequired is a middleware to ensure the user is a teacher or admin (admin can do teacher actions).
// It should be used AFTER the AuthMiddleware.
func TeacherRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDValue, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context, ensure AuthMiddleware runs first"})
			c.Abort()
			return
		}

		userID, ok := userIDValue.(string)
		if !ok || userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid User ID format in context"})
			c.Abort()
			return
		}

		role, err := services.GetUserRole(userID) // Assumes GetUserRole is in services package (user_service.go)
		if err != nil {
			// Check if the error indicates user not found or role not found specifically
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "is empty") {
				c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: User profile incomplete or role not assigned."})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user role: " + err.Error()})
			}
			c.Abort()
			return
		}

		// Allow both 'teacher' and 'admin' to access teacher routes
		if role != "teacher" && role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: Teacher or Admin privileges required"})
			c.Abort()
			return
		}
		c.Set("userRole", role) // Set user role in context for use by handlers if needed
		c.Next()
	}
}

// CRRequiredMiddleware is a middleware to ensure the user is a Class Representative.
// It should be used AFTER the AuthMiddleware.
// Further checks if the CR is associated with a specific class might be needed in the service layer.
func CRRequiredMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userIDValue, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context, ensure AuthMiddleware runs first"})
			c.Abort()
			return
		}
		userID, ok := userIDValue.(string)
		if !ok || userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid User ID format in context"})
			c.Abort()
			return
		}

		role, err := services.GetUserRole(userID) // Assumes GetUserRole is in services package
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "is empty") {
				c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: User profile incomplete or role not assigned."})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user role: " + err.Error()})
			}
			c.Abort()
			return
		}

		// For CR actions, user must be 'cr'. Admins can also perform CR actions via their own routes or if logic allows.
		// For this specific middleware, we check for 'cr'. Admins can be handled by TeacherRequired or AdminRequired.
		// If an admin needs to perform CR actions, they should use admin routes or this middleware should allow 'admin' too.
		// For now, strictly 'cr'.
		if role != "cr" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied: Class Representative privileges required (current role: " + role + ")."})
			c.Abort()
			return
		}
		c.Set("userRole", role) // Set role in context for handler use if needed
		c.Next()
	}
}
