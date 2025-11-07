package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

// HealthHandler handles health check requests
type HealthHandler struct {
	dbHealthCheck func(ctx context.Context) error
}

// NewHealthHandler creates a new health handler
func NewHealthHandler(dbHealthCheck func(ctx context.Context) error) *HealthHandler {
	return &HealthHandler{
		dbHealthCheck: dbHealthCheck,
	}
}

// HealthCheck handles GET /health requests
func (h *HealthHandler) HealthCheck(c echo.Context) error {
	ctx, cancel := context.WithTimeout(c.Request().Context(), 5*time.Second)
	defer cancel()

	status := "ok"
	httpStatus := http.StatusOK

	// Check database health if health check function is provided
	if h.dbHealthCheck != nil {
		if err := h.dbHealthCheck(ctx); err != nil {
			status = "unhealthy"
			httpStatus = http.StatusServiceUnavailable
			return c.JSON(httpStatus, map[string]any{
				"status":  status,
				"message": "Database connection failed",
				"error":   err.Error(),
			})
		}
	}

	return c.JSON(httpStatus, map[string]any{
		"status":  status,
		"message": "API is running",
	})
}
