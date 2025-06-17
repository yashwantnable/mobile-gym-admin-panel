import { useState, useEffect } from "react";
import { SlotApi } from "../Api/Slot.api";
import { ServiceApi } from "../Api/Service.api";
import { format } from "date-fns";
import { useLoading } from "../Components/loader/LoaderContext";

export const useSchedulerApi = (currentDate, selectedSubService) => {
  const [servicesData, setServicesData] = useState([]);
  const [subService, setSubService] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [existingSlot, setExistingSlot] = useState([]);
  const [holidays, setHolidays] = useState({});
  const [defaultServiceId, setDefaultServiceId] = useState(null);
  const [defaultSubServiceId, setDefaultSubServiceId] = useState(null);

  const { handleLoading } = useLoading();

  const toUTCDateString = (date) => {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return format(utcDate, "yyyy-MM-dd");
  };

  const fetchServiceTypes = async () => {
    handleLoading(true);
    try {
      const res = await ServiceApi.serviceType();
      setServicesData(res.data?.data || []);
      return res.data?.data || []; // Return the data for chaining
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      handleLoading(false);
    }
  };

  const fetchSubServices = async (serviceId) => {
    if (!serviceId) return [];

    handleLoading(true);
    try {
      const res = await ServiceApi.getSubServiceByServiceId({ serviceId });
      setSubService(res.data?.data || []);
      return res.data?.data || []; // Return the data for chaining
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      handleLoading(false);
    }
  };

  const fetchSlots = async (subServiceId) => {
    if (!subServiceId) return;

    handleLoading(true);
    try {
      let formatted;

      if (currentDate instanceof Date) {
        formatted = toUTCDateString(currentDate);
      } else {
        formatted = currentDate;
      }

      const payload = { bookingDate: formatted, subServiceId };

      const [resAppointments, resSlots] = await Promise.all([
        SlotApi.getSlotBySubservice(payload),
        SlotApi.getAllSlot({ date: formatted, subServiceId }),
      ]);

      setAppointments(resAppointments.data?.data || []);

      if (
        resSlots?.data?.message === "Office holiday – no timeslots available"
      ) {
        setExistingSlot([]);
        setHolidays({
          date: resSlots.data?.data?.Date,
          name: resSlots.data?.data?.holidayReason,
          isClosed: resSlots.data?.data?.isHoliday,
        });
      } else {
        setHolidays({});
        setExistingSlot(resSlots?.data?.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  // Chain all the dependent API calls properly
  const initializeData = async () => {
    try {
      const services = await fetchServiceTypes();
      if (services.length > 0) {
        setDefaultServiceId(services[0]?._id);
        const subServices = await fetchSubServices(services[0]?._id);
        if (subServices.length > 0) {
          setDefaultSubServiceId(subServices[0]?._id);
          await fetchSlots(subServices[0]?._id);
        }
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (selectedSubService) {
      fetchSlots(selectedSubService);
    } else if (subService.length > 0) {
      fetchSlots(subService[0]?._id);
    }
  }, [currentDate, selectedSubService]);

  return {
    servicesData,
    subService,
    appointments,
    existingSlot,
    holidays,
    fetchSubServices,
    fetchSlots,
    setExistingSlot,
    setAppointments,
    defaultServiceId,
    defaultSubServiceId,
  };
};
