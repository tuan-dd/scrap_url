package repo

type IAuthRepo interface {
	// FindUser(id int) map[string]any
}

type AuthRepo struct{}

func NewAuthRepo() IPostRepo {
	return &PostRepo{}
}

// func (ur *PostRepo) FindUser(id int) map[string]any {
// 	return map[string]any{"id": id, "name": "Tuan"}
// }
