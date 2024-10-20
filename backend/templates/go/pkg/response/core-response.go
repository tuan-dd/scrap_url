package response

import (
	"time"

	"template/1.0/pkg/utils"

	"github.com/gin-gonic/gin"
)

type CoreResponse[T any] struct {
	Code         int    `json:"code"`
	Cid          string `json:"cid"`
	Timestamp    int64  `json:"timestamp"`
	ResponseTime string `json:"responseTime"`
	Data         T      `json:"data"`
	Message      string `json:"message"`

	// error if have
	ErrCode int     `json:"errCode"`
	Err     *string `json:"err"`
}

// fun SuccessResponse

func SuccessResponse(c *gin.Context, code int, data interface{}) {
	ctx := utils.NewFuncUtil().GetCtx(c)

	responseTime := utils.NewFuncUtil().FormatMilliseconds(ctx.RequestTimestamp - time.Now().UnixMilli())
	c.JSON(StatusCode[code], CoreResponse[interface{}]{
		Code:         code,
		Cid:          ctx.Cid,
		Message:      MsgResponse[code],
		Data:         data,
		Timestamp:    ctx.RequestTimestamp,
		ResponseTime: responseTime,
	})
}

func ErrorResponse(c *gin.Context, code int, err string) {
}
