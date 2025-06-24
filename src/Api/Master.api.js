import Api from '../Middleware/axios'

export const MasterApi = {
    country: () => Api.get("master/get-all-country"),
    city: (countryId) => Api.get(`master/get-all-city/${countryId}`),





    //location-Master Apis
    getAllLocation: () => Api.post('master/get-all-location-master'),
    getAllLocationbyCountryOrCity: () => Api.get('master/get-location-by-country-city'),
    createLocation: (payload) => Api.post('master/create-location-master', payload),
    getSingleLocationbyId: (id) => Api.get(`master/get-location-master/${id}`),
    updateLocation: (id, payload) => Api.put(`master/update-location-master/${id}`, payload),
    deleteLocation:(id, payload) => Api.delete(`/master/delete-location-master-by-id/${id}`, payload),
    
    //Tenure-Master Apis
    getAllTenure: () => Api.get('master/get-all-tenure'),
    createTenure: (payload) => Api.post('master/create-tenure', payload),
    getSingleTenure: (id) => Api.get(`master/get-tenure-by-id/${id}`),
    updateTenure: (id, payload) => Api.put(`master/update-tenure/${id}`, payload),
    deleteTenure:(id, payload) => Api.delete(`/master/delete-tenure/${id}`, payload),



    //session-Master Apis
    getAllSession: () => Api.get('master/get-all-sessions'),
    createSession: (payload) => Api.post('master/create-session', payload),
    getSingleSession: (id) => Api.get(`master/get-session-by-id/${id}`),
    updateSession: (id, payload) => Api.put(`master/update-session/${id}`, payload),
    deleteSession:(id, payload) => Api.delete(`/master/delete-session/${id}`, payload),


    //Pet-Type-Master Apis
    getAllpetType: (payload) => Api.get('/petType/get-all-PetType', payload),
    createpetType: (payload) => Api.post('/petType/create-petType', payload),
    updatepetType: (id, payload) => Api.put(`/petType/update-PetType/${id}`, payload),
    getSinglepetType: (id, payload) => Api.get(`/petType/get-PetType/${id}`, payload),
    deletepetType:(id, payload) => Api.delete(`/petType/delete-PetType/${id}`, payload),


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
