import Api from '../Middleware/axios'

export const PromoCodeApi = {
    getAllPromoCodes: () => Api.post(`/admin/get-all-promo-codes`),
    createPromoCode: (payload) => Api.post(`/admin/create-promo-code`, payload),
    updatePromoCode: (id,payload) => Api.put(`/admin/update-promo-code/${id}`,payload),
    deletePromoCode: (id) => Api.delete(`/admin/delete-promo-code/${id}`),
};