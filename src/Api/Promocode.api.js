import Api from '../Middleware/axios'

export const PromoCodeApi = {
    getAllPromoCodes: () => Api.post(`/admin/get-all-promo-codes`),
    createPromoCode: (payload) => Api.post(`/admin/create-promo-code`, payload),
    updatePromoCode: (id,payload) => Api.put(`/admin/update-promo-code/${id}`,payload),
    deletePromoCode: (id) => Api.delete(`/admin/delete-promo-code/${id}`),
};

// router.route("/create-promo-code").post(verifyJWT, createPromoCode);
// router.route("/update-promo-code/:id").put(verifyJWT,  updatePromoCode);
// router.route("/get-promo-code-by-id/:id").get(verifyJWT, getPromoCodeById)
// router.route("/get-all-promo-codes").post(verifyJWT, getAllPromoCodes)
// router.route("/delete-promo-code/:id").delete(verifyJWT, deletePromoCode)