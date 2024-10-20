package utils

import (
	"strconv"

	"template/1.0/global"

	"github.com/gin-gonic/gin"
)

type IFuncUtil interface {
	FormatMilliseconds(mss int64) string

	GetCtx(c *gin.Context) *global.Ctx
}
type FuncUtil struct{}

func NewFuncUtil() IFuncUtil {
	return &FuncUtil{}
}

func (fu *FuncUtil) GetCtx(c *gin.Context) *global.Ctx {
	ctx, _ := c.Get("ctx")

	ctxValue, ok := ctx.(*global.Ctx)

	if !ok {
		return &global.Ctx{}
	}
	return ctxValue
}

func (fu *FuncUtil) FormatMilliseconds(ms int64) string {
	return strconv.FormatInt(ms, 10) + "ms"
}
