package repo

type IPostRepo interface {
	// FindUser(id int) map[string]any
}

type PostRepo struct{}

func NewPostRepo() IPostRepo {
	return &PostRepo{}
}

// func (ur *PostRepo) FindUser(id int) map[string]any {
// 	return map[string]any{"id": id, "name": "Tuan"}
// }
