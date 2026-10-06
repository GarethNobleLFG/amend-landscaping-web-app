package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

func main() {
	// Source DB (Other API's Postgres Database - amend_landscaping)
	srcURL := getEnv("SRC_DATABASE_URL", "postgres://postgres:password@localhost:5433/amend_landscaping?sslmode=disable")

	// Destination DB (cerm-api Database - cerm_db)
	destURL := getEnv("DATABASE_URL", "postgres://cerm_user:cerm_password@localhost:5434/cerm_db?sslmode=disable")

	log.Println("🔌 Connecting to Source Database (amend_landscaping)...")
	srcDB, err := sql.Open("postgres", srcURL)
	if err != nil {
		log.Fatalf("Failed to connect to source DB: %v", err)
	}
	defer srcDB.Close()

	if err := srcDB.Ping(); err != nil {
		log.Fatalf("Source DB connection failed: %v", err)
	}

	log.Println("🔌 Connecting to Destination Database (cerm_db)...")
	destDB, err := sql.Open("postgres", destURL)
	if err != nil {
		log.Fatalf("Failed to connect to destination DB: %v", err)
	}
	defer destDB.Close()

	if err := destDB.Ping(); err != nil {
		log.Fatalf("Destination DB connection failed: %v", err)
	}

	log.Println("📦 Fetching records from source appointments table...")
	rows, err := srcDB.Query(`
		SELECT name, email, "phoneNumber", address, city, state, zip, 
		       "servicesRequested", "scheduledDate", description, approved, 
		       is_commercial, is_seen, referral_info, "createdAt", "updatedAt" 
		FROM "Appointments"`)
	if err != nil {
		rows, err = srcDB.Query(`
			SELECT name, email, "phoneNumber", address, city, state, zip, 
			       "servicesRequested", "scheduledDate", description, approved, 
			       is_commercial, is_seen, referral_info, "createdAt", "updatedAt" 
			FROM appointments`)
		if err != nil {
			log.Fatalf("Failed to query appointments table: %v", err)
		}
	}
	defer rows.Close()

	count := 0
	for rows.Next() {
		var (
			name, email, phoneNumber, address, city, state, zip string
			servicesRequested                                   json.RawMessage
			scheduledDate                                       *time.Time
			description                                         *string
			approved, isCommercial, isSeen                      bool
			referralInfo                                        *string
			createdAt, updatedAt                                time.Time
		)

		err := rows.Scan(
			&name, &email, &phoneNumber, &address, &city, &state, &zip,
			&servicesRequested, &scheduledDate, &description, &approved,
			&isCommercial, &isSeen, &referralInfo, &createdAt, &updatedAt,
		)
		if err != nil {
			log.Printf("⚠️ Error reading row: %v", err)
			continue
		}

		insertQuery := `
			INSERT INTO customer_profiles (
				name, email, phone_number, address, city, state, zip,
				services_requested, scheduled_date, description, approved,
				is_commercial, is_seen, referral_info, schedule, admin_notes, job_payout,
				created_at, updated_at
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NULL, NULL, NULL, $15, $16
			)`

		_, err = destDB.Exec(
			insertQuery,
			name, email, phoneNumber, address, city, state, zip,
			servicesRequested, scheduledDate, description, approved,
			isCommercial, isSeen, referralInfo, createdAt, updatedAt,
		)
		if err != nil {
			log.Printf("⚠️ Error inserting record for (%s): %v", email, err)
			continue
		}

		count++
	}

	log.Printf("🎉 Migration finished! Successfully copied %d records into customer_profiles.", count)
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
