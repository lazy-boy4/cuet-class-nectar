package supabase

import (
	"fmt"
	"os"

	"github.com/nedpals/supabase-go"
)

var Client *supabase.Client

func InitSupabaseClient() error {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY") // nedpals uses SUPABASE_KEY, but ANON_KEY is fine for client-side operations

	if supabaseURL == "" || supabaseKey == "" {
		return fmt.Errorf("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
	}

	Client = supabase.CreateClient(supabaseURL, supabaseKey)
	if Client == nil {
		return fmt.Errorf("failed to create Supabase client with nedpals/supabase-go")
	}
	fmt.Println("Supabase client (nedpals/supabase-go) initialized successfully.")
	return nil
}

func GetClient() *supabase.Client {
	if Client == nil {
		fmt.Println("Warning: Supabase client (nedpals/supabase-go) accessed before explicit initialization. Attempting to initialize now.")
		err := InitSupabaseClient()
		if err != nil {
			fmt.Printf("Failed to auto-initialize Supabase client (nedpals/supabase-go) during GetClient(): %v. Client will be nil.\n", err)
		}
	}
	return Client
}
