package initializes

func Run() {
	InitLoadConfig()
	InitLogger()
	InitRedis()
	InitPostgres()
}
