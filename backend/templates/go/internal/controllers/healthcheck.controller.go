package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HealthCheckController struct{}

func NewHealthCheckController() *HealthCheckController {
	return &HealthCheckController{}
}

func (hcc *HealthCheckController) Ping(ctx *gin.Context) {
	name := ctx.Param("name")

	id := ctx.Query("id")

	ctx.JSON(http.StatusOK, gin.H{
		"message": "test",
		"name":    name + ":" + id,
		"users":   []string{"Vi", "tuan"},
	})
}
