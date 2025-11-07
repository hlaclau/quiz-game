package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Connection represents a PostgreSQL database connection pool
type Connection struct {
	pool *pgxpool.Pool
}

// NewConnection creates a new PostgreSQL connection pool
func NewConnection(ctx context.Context, databaseURL string) (*Connection, error) {
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database URL: %w", err)
	}

	// Set connection pool configuration
	config.MaxConns = 25
	config.MinConns = 5
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = time.Minute * 30

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %w", err)
	}

	// Test the connection
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &Connection{pool: pool}, nil
}

// Pool returns the underlying connection pool
func (c *Connection) Pool() *pgxpool.Pool {
	return c.pool
}

// Close closes the connection pool
func (c *Connection) Close() {
	if c.pool != nil {
		c.pool.Close()
	}
}

// HealthCheck checks if the database connection is healthy
func (c *Connection) HealthCheck(ctx context.Context) error {
	if c.pool == nil {
		return fmt.Errorf("database connection pool is nil")
	}
	return c.pool.Ping(ctx)
}
