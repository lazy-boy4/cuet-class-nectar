package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

func main() {
	// Try standard Supabase ports: 54322 (local docker commonly), 5432, 6543
	ports := []string{"54322", "5432", "6543"}
	var db *sql.DB
	var err error

	connected := false

	for _, port := range ports {
		connStr := fmt.Sprintf("postgres://postgres:postgres@localhost:%s/postgres?sslmode=disable", port)
		fmt.Printf("Trying to connect to %s...\n", connStr)

		db, err = sql.Open("postgres", connStr)
		if err != nil {
			fmt.Printf("Failed to open valid connector for port %s: %v\n", port, err)
			continue
		}

		// Set timeout for connection
		ctxTimeout := 2 * time.Second
		db.SetConnMaxLifetime(ctxTimeout)

		err = db.Ping()
		if err == nil {
			fmt.Printf("Successfully connected to Postgres on port %s!\n", port)
			connected = true
			break
		}
		fmt.Printf("Failed to ping port %s: %v\n", port, err)
		db.Close()
	}

	if !connected {
		log.Fatal("Could not connect to any local Postgres instance. Migration failed.")
	}
	defer db.Close()

	// Execute Migration
	queries := []string{
		"ALTER TABLE notices ADD COLUMN IF NOT EXISTS dept_code VARCHAR(10) REFERENCES departments(code);",
		"CREATE INDEX IF NOT EXISTS idx_notices_dept_code ON notices(dept_code);",
	}

	for _, q := range queries {
		fmt.Printf("Executing: %s\n", q)
		_, err := db.Exec(q)
		if err != nil {
			log.Fatalf("Migration failed on query '%s': %v", q, err)
		}
	}

	fmt.Println("Migration completed successfully!")
}
