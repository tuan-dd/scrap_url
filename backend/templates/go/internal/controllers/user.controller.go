package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserController struct{}

func (uc *UserController) FindUser(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "oke"})
}
