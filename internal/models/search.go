package models

// SearchResultItem defines the common structure for a single search result.
type SearchResultItem struct {
	Type         string  `json:"type"`                    // e.g., "user", "course", "class", "department", "notice", "class_event"
	ID           string  `json:"id"`                      // Primary ID of the found item (stringified)
	Title        string  `json:"title"`                   // Main display text
	Subtitle     *string `json:"subtitle,omitempty"`      // Additional context
	MatchContext *string `json:"match_context,omitempty"` // Optional: Snippet showing match
	// Link provided by frontend based on Type and ID
}

// SearchResults aggregates all found items for a query.
type SearchResults struct {
	Query string             `json:"query"`
	Items []SearchResultItem `json:"items"`
	Count int                `json:"count"`
}
