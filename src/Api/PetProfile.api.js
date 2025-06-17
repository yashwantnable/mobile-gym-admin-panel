import Api from '../Middleware/axios'

export const PetProfileApi = {
    create: (payload) => Api.post('/admin/create-pet', payload),
    getAllPet: (payload) => Api.post('admin/findallpet', payload),
    createPet: (payload) => Api.post('admin/create-pet', payload),
    updatePet: (id, payload) => Api.put(`admin/updatePet/${id}`, payload),
    getSinglePet: (id) => Api.get(`admin/findPetById/${id}`),
    deletePet: (id, payload) => Api.delete(`admin/deletePet/${id}`, payload),


    getAllUser: () => Api.get('/user/get-all-user'),
    getSinglePet: (id, payload) => Api.get(`/user/get-userby-id/${id}`, payload),
};