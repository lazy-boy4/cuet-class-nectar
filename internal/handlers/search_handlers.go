package handlers

import (
	"github.com/lazy-boy4/cuet-class-nectar/internal/models" // Added import for models
	"github.com/lazy-boy4/cuet-class-nectar/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GlobalSearchHandler handles requests to the global search endpoint.
func GlobalSearchHandler(c *gin.Context) {
	searchQuery := c.Query("q")
	if searchQuery == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query parameter 'q' is required."})
		return
	}

	userIDval, existsUserID := c.Get("userID")
	userRoleVal, existsUserRole := c.Get("userRole")

	if !existsUserID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context. Ensure you are logged in."})
		return
	}
	if !existsUserRole {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User role not found in context. AuthMiddleware might have failed to fetch it."})
		return
	}

	currentUserID, errParseUUID := uuid.Parse(userIDval.(string))
	if errParseUUID != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format in context."})
		return
	}

	currentUserRole, okRole := userRoleVal.(string)
	if !okRole {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User role in context is not a string."})
		return
	}

	results, err := services.GlobalSearch(searchQuery, currentUserID, currentUserRole)
	if err != nil {
		if results != nil && len(results.Items) > 0 {
			c.JSON(http.StatusMultiStatus, gin.H{
				"message": "Search completed with some errors. Partial results returned.",
				"query":   results.Query,
				"items":   results.Items,
				"count":   results.Count,
				"errors":  err.Error(),
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Global search failed or returned no results with errors: " + err.Error()})
		}
		return
	}

	if results == nil {
		c.JSON(http.StatusOK, models.SearchResults{Query: searchQuery, Items: []models.SearchResultItem{}, Count: 0})
		return
	}

	c.JSON(http.StatusOK, results)
}
