package global

import "github.com/gin-gonic/gin"

type UserType string

// Typed constants for UserType
const (
	Customer    UserType = "customer"
	Back_office UserType = "back-office"
)

type Role int

// Typed constants for Role
const (
	Admin   Role = 1
	Manager Role = 2
	Member  Role = 3
	User    Role = 0
)

type UserInfo struct {
	UserId   int8
	DeviceId string
	LangCode string
	RoleId   Role
	UserType UserType
}

type RequestInfo struct {
	IpAddress string `json:"ipAddress"`
	Location  string `json:"location"`
	UserAgent string `json:"userAgent"`
}

type Ctx struct {
	UserInfo         UserInfo    `json:"userInfo"`
	RequestInfo      RequestInfo `json:"requestInfo"`
	Cid              string      `json:"cid"`
	RequestTimestamp int64       `json:"requestTimestamp"`
	AccessToken      string      `json:"accessToken"`
	RefreshToken     *string     `json:"refreshToken"`
}

type RequestContext struct {
	*gin.Context
	Ctx *Ctx
}
