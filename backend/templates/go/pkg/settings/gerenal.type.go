package settings

type Config struct {
	Server   ServerSetting   `mapstructure:"server"`
	Postgres PostgresSetting `mapstructure:"postgres"`
}

type PostgresSetting struct {
	Host            string `mapstructure:"host"`
	Post            int    `mapstructure:"post"`
	Username        string `mapstructure:"username"`
	Password        string `mapstructure:"password"`
	Db              string `mapstructure:"db"`
	MaxIdleConns    int    `mapstructure:"maxIdleConns"`
	MaxOpenConns    int    `mapstructure:"maxOpenConns"`
	ConnMaxLifeTime int    `mapstructure:"connMaxLifeTime"`
}

type ServerSetting struct {
	Port int `mapstructure:"post"`
}
