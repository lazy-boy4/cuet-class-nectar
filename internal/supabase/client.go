package supabase

import "github.com/nedpals/supabase-go"

var Client *supabase.Client

func InitSupabaseClient() error   { return nil }    // Dummy
func GetClient() *supabase.Client { return Client } // Dummy
