package repo

type IUserRepo interface {
	FindUser(id int) map[string]any
}

type UserRepo struct{}

func NewUserRepo() IPostRepo {
	return &PostRepo{}
}

func (ur *PostRepo) FindUser(id int) map[string]any {
	return map[string]any{"id": id, "name": "Tuan"}
}
