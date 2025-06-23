import Api from '../Middleware/axios';

export const CategoryApi = {
  createCategory: (payload) => Api.post('/master/create-category', payload),
  updateCategory: (id, payload) => Api.put(`master/update-category/${id}`, payload),
  getAllCategory: () => Api.get(`master/get-all-categories`),
//   getSingleCAtegory: (id) => Api.get(`master/get-category-by-id/${id}`),
  deleteCategory: (id) => Api.delete(`master/delete-category/${id}`),
};
