package routers

import (
	"net/http"

	c "template/1.0/internal/controllers"

	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	v1 := r.Group("/v1")
	{
		v1.GET("/ping/:name", c.NewHealthCheckController().Ping)
		v1.POST("/pong", c.NewHealthCheckController().Ping)
		v1.PUT("/pong", c.NewHealthCheckController().Ping)
	}

	return r
}
