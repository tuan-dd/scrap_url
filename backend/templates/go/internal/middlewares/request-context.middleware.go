package middleware

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"template/1.0/global"

	"github.com/gin-gonic/gin"
)

func RequestContextMiddleware(c *gin.Context) {
	tokenPrefix := "Bearer "

	cid := c.GetHeader(global.CID_HEADER_KEY)
	accessToken := strings.TrimPrefix(c.GetHeader(global.ACCESS_TOKEN_HEADER_KEY), tokenPrefix)
	requestTimestamp := time.Now().UnixMilli()

	ctx := global.Ctx{
		Cid:              cid,
		RequestTimestamp: requestTimestamp,
		AccessToken:      accessToken,
	}

	userInfoHeader := c.GetHeader(global.USER_INFO_HEADER_KEY)
	if userInfoHeader != "" {
		userInfoBytes, err := base64.StdEncoding.DecodeString(userInfoHeader)
		if err == nil {
			if err := json.Unmarshal(userInfoBytes, &ctx.UserInfo); err != nil {
				fmt.Println("Error parsing user info:", err)
			}
		}
	}

	requestInfoHeader := c.GetHeader(global.REQUEST_INFO_HEADER_KEY)
	if requestInfoHeader != "" {
		requestInfoBytes, err := base64.StdEncoding.DecodeString(requestInfoHeader)
		if err == nil {
			if err := json.Unmarshal(requestInfoBytes, &ctx.RequestInfo); err != nil {
				fmt.Println("Error parsing request info:", err)
			}
		}
	}

	c.Set("Ctx", ctx)
	c.Next()
}
