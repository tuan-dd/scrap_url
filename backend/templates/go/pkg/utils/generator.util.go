package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/exp/rand"
)

type PairToken struct {
	accessToken  string
	refreshToken string
}
type IGeneratorUtil interface {
	// GenerateRandomString(length int) string
	// GenerateRandomNumber(length int) string
	// GenerateRandomUUID() string
	CreatePairToken(payLoad map[string]any) (PairToken, error)
	CreateToken(payLoad map[string]any, expired int32, key string) string
	VerifyToken(token string, secretKey string) (any, error)
	GenerateCID(cid string) string
}

type GeneratorUtil struct{}

func NewGeneratorUtil() IGeneratorUtil {
	return &GeneratorUtil{}
}

func createClaim(payLoad map[string]any, expired time.Duration) *jwt.Token {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":     "learn-go",
		"exp":     time.Now().Add(expired).Unix(),
		"payLoad": payLoad,
	},
	)
}

func (gu *GeneratorUtil) CreatePairToken(payLoad map[string]any) (PairToken, error) {
	claims := createClaim(payLoad, time.Hour*24)

	accessToken, errAT := claims.SignedString("test")
	refreshToken, errRF := claims.SignedString("test")
	if errAT != nil || errRF != nil {
		if errAT != nil {
			return PairToken{
				accessToken:  "",
				refreshToken: "",
			}, errAT
		} else {
			return PairToken{
				accessToken:  "",
				refreshToken: "",
			}, errRF
		}
	}

	return PairToken{
		accessToken:  accessToken,
		refreshToken: refreshToken,
	}, nil
}

func (gu *GeneratorUtil) CreateToken(payLoad map[string]any, expired int32, secretKey string) string {
	claims := createClaim(payLoad, time.Hour*24)
	tokenString, err := claims.SignedString(secretKey)
	if err != nil {
		return ""
	}

	return tokenString
}

func (gu *GeneratorUtil) VerifyToken(token string, secretKey string) (any, error) {
	return jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})
}

func (gu *GeneratorUtil) GenerateCID(cid string) string {
	if cid != "" {
		return cid
	}

	return fmt.Sprintf("TL-%d-%03d", time.Now().UnixNano()/1e6, rand.Intn(1000))
}
