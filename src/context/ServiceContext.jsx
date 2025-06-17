// contexts/ServiceContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ServiceApi } from '../Api/Service.api';
import { useSelector } from 'react-redux';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loadedSubServices, setLoadedSubServices] = useState({});
  const { isAuthenticated } = useSelector((state) => state.store);

  // const loadServiceTypes = async () => {
  //   if (services.length > 0) return;

  //   setLoading(true);
  //   try {
  //     const res = await ServiceApi.serviceType();
  //     console.log('res', res?.data?.data);
  //     setServices(res.data?.data || []);
  //     setError(null);
  //   } catch (err) {
  //     console.error('Failed to load service types:', err);
  //     setError('Failed to load service types');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const loadSubServices = async (serviceTypeId) => {
  //   if (loadedSubServices[serviceTypeId] || !serviceTypeId) return;

  //   setLoading(true);
  //   try {
  //     const res = await ServiceApi.getSubServiceByServiceId({
  //       serviceId: serviceTypeId,
  //     });

  //     setSubServices((prev) => ({
  //       ...prev,
  //       [serviceTypeId]: res.data?.data || [],
  //     }));

  //     setLoadedSubServices((prev) => ({
  //       ...prev,
  //       [serviceTypeId]: true,
  //     }));

  //     setError(null);
  //   } catch (err) {
  //     console.error(`Failed to load subservices for service ${serviceTypeId}:`, err);
  //     setError('Failed to load subservices');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // isAuthenticated && loadServiceTypes();
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        services,
        subServices,
        loading,
        error,
        // loadServiceTypes,
        // loadSubServices,
        getSubServicesByType: (serviceTypeId) => subServices[serviceTypeId] || [],
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
