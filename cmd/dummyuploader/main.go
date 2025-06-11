package main

import (
	"fmt"
	_ "github.com/lazy-boy4/cuet-class-nectar/internal/models"   // Corrected module path
	_ "github.com/lazy-boy4/cuet-class-nectar/internal/services" // Corrected module path
	_ "github.com/lazy-boy4/cuet-class-nectar/internal/supabase" // Corrected module path
)

func main() { fmt.Println("Dummy main for compilation test") }
