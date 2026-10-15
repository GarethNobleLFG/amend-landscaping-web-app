.PHONY: run build test migrate-up migrate-down migrate-status migrate-create import-appointments

# Local Database URL (Uses port 5434 mapped in docker-compose)
DB_URL ?= postgres://cerm_user:cerm_password@localhost:5434/cerm_db?sslmode=disable

run:
	go run ./cmd/api/main.go

build:
	go build -o bin/server ./cmd/api/main.go

test:
	go test ./...

migrate-up:
	docker run --rm -v $(shell pwd)/migrations:/migrations --net=host migrate/migrate -path=/migrations -database "$(DB_URL)" up

migrate-down:
	docker run --rm -v $(shell pwd)/migrations:/migrations --net=host migrate/migrate -path=/migrations -database "$(DB_URL)" down 1

migrate-status:
	docker run --rm -v $(shell pwd)/migrations:/migrations --net=host migrate/migrate -path=/migrations -database "$(DB_URL)" version

migrate-create:
	docker run --rm -v $(shell pwd)/migrations:/migrations migrate/migrate create -ext sql -dir /migrations -seq $(name)

import-appointments:
	go run ./scripts/import_appointments.go
