package supabase

import (
	"fmt"
	"os"

	"github.com/nedpals/supabase-go"
)

var Client *supabase.Client

func InitSupabaseClient() error {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_KEY")

	if supabaseURL == "" {
		return fmt.Errorf("SUPABASE_URL environment variable is not set")
	}
	if supabaseKey == "" {
		return fmt.Errorf("SUPABASE_SERVICE_KEY environment variable is not set")
	}

	Client = supabase.CreateClient(supabaseURL, supabaseKey)
	if Client == nil {
		return fmt.Errorf("failed to create Supabase client")
	}

	return nil
}

func GetClient() *supabase.Client {
	return Client
}
