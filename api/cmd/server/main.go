package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/ynov/ynov_architecture-course_go-quiz/api/internal/config"
	"github.com/ynov/ynov_architecture-course_go-quiz/api/internal/handlers"
	"github.com/ynov/ynov_architecture-course_go-quiz/api/internal/infrastructure/database/postgres"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database connection
	ctx := context.Background()
	dbConn, err := postgres.NewConnection(ctx, cfg.Database.URL)
	if err != nil {
		log.Printf("Warning: Failed to connect to database: %v", err)
		log.Println("Continuing without database connection...")
		dbConn = nil
	}
	defer func() {
		if dbConn != nil {
			dbConn.Close()
		}
	}()

	// Create Echo instance
	e := echo.New()

	// Setup middleware
	handlers.SetupMiddleware(e)

	// Initialize handlers
	var dbHealthCheck func(ctx context.Context) error
	if dbConn != nil {
		dbHealthCheck = dbConn.HealthCheck
	}

	healthHandler := handlers.NewHealthHandler(dbHealthCheck)

	// Register routes
	e.GET("/health", healthHandler.HealthCheck)

	// Start server
	serverAddr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Starting server on %s", serverAddr)

	// Start server in a goroutine
	go func() {
		if err := e.Start(serverAddr); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}
