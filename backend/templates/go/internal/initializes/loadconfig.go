package initializes

import (
	"fmt"
	"stay-mate/1.0/global"

	"github.com/spf13/viper"
)

func InitLoadConfig() {
	viper := viper.New()

	viper.AddConfigPath("./config/")
	viper.SetConfigFile("local")
	viper.SetConfigType("yaml")

	viper.AutomaticEnv()

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("failed to read configuration: %w", err))
	}
	if err := viper.Unmarshal(&global.Config); err != nil {
		panic(fmt.Errorf("failed to decode configuration: %w", err))
	}
}
