import Api from '../Middleware/axios'

export const MasterApi = {
    country: () => Api.get("master/get-all-country"),
    city: (countryId) => Api.get(`master/get-all-city/${countryId}`),

    //breed-Master Apis
    getAllBreed: (payload) => Api.get('/breed/get-all-breed', payload),
    createBreed: (payload) => Api.post('/breed/create-breed', payload),
    updateBreed: (id, payload) => Api.put(`/breed/update-breed/${id}`, payload),
    getSingleBreed: (id, payload) => Api.get(`/breed/get-breed/${id}`, payload),
    deleteBreed:
        (id, payload) => Api.delete(`/breed/delete-breed/${id}`, payload),


    //Pet-Type-Master Apis
    getAllpetType: (payload) => Api.get('/petType/get-all-PetType', payload),
    createpetType: (payload) => Api.post('/petType/create-petType', payload),
    updatepetType: (id, payload) => Api.put(`/petType/update-PetType/${id}`, payload),
    getSinglepetType: (id, payload) => Api.get(`/petType/get-PetType/${id}`, payload),
    deletepetType:
        (id, payload) => Api.delete(`/petType/delete-PetType/${id}`, payload),


    // Tax apis
    getAllTaxMaster: () => Api.post('/master/get-all-tax-master'),
    getAllTax: () => Api.get('/master/get-all-tax'),
    createTax: (paload) => Api.post('/master/create-tax-master', paload),
    updateTax: (id, paload) => Api.put(`/master/update-tax-master/${id}`, paload),
    deleteTax: (id) => Api.delete(`/master/delete-tax-master-by-id/${id}`),
    singleTax: (id) => Api.get(`/master/get-tax-master/${id}`),

    //Late fee master 
    getAllLateFee: () => Api.get('master/get-all-extra-charges'),
    createLateFee: (paload) => Api.post('master/create-extra-charge', paload),
    updateLateFee: (id, paload) => Api.put(`master/update-extra-charge/${id}`, paload),
    // deleteLateFee: (id) => Api.delete(`/currency/delete-currency/${id}`),


    // Tax apis
    getAllCurrencies: () => Api.get('currency/get-all-currencies'),
    createCurrancy: (paload) => Api.post('/currency/create-currency', paload),
    updateCurrency: (id, paload) => Api.put(`/currency/update-currency/${id}`, paload),
    deleteCurrency: (id) => Api.delete(`/currency/delete-currency/${id}`),
    
    
    deleteExchangeCurrency: (id) => Api.delete(`/currency/deleteExchange/${id}`),
    createExchangeCurrency: (paload) => Api.post('/currency/createOrUpdateExchange', paload),
    getSingleExchangeCurrency: (id,paload) => Api.get(`/currency/getExchangeById/${id}`, paload),
    getAllExchangeCurrency: () => Api.get(`/currency/getAllExchanges`),

  
};
