import Api from '../Middleware/axios'

export const ArticleApi = {
  getSingleArticle: (id) => Api.get(`admin/get-artical/${id}`),
  getAllArticles: () => Api.get(`admin/get-all-articals`),
  updateArticle: (id,payload) => Api.put(`admin/update-artical/${id}`,payload),
  createArticle: (payload) => Api.post(`admin/create-artical`,payload),

};
