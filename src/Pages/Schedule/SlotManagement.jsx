import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import {
  FiPlus,
  FiX,
  FiUser,
  FiScissors,
  FiNavigation,
  FiFlag,
} from "react-icons/fi";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ServiceApi } from "../../Api/Service.api";
import { SlotApi } from "../../Api/Slot.api";
import { toast } from "react-toastify";
import "./style.css";
import InputField from "../../Components/InputField";
import HolidayModal from "../../Components/HolidayModal";
import { useLoading } from "../../Components/loader/LoaderContext";

const SlotManagement = ({ groomers }) => {
  const [services, setServices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [existingSlot, setExistingSlot] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");
  const [slotDuration, setSlotDuration] = useState();
  const [servicesData, setServicesData] = useState([]);
  const { handleLoading } = useLoading();
  const [subService, setSubService] = useState();

  const formik = useFormik({
    initialValues: {
      startTime: null,
      travelTime: null,
      subserviceId: "",
      groomerId: "",
      bookingDate: null,
      specificDate: false,
      customDuration: null,
      subserviceName: "",
      servicesId: "",
    },
    // validationSchema: slotCreateValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let payload = {
          travelTime: values.travelTime,
          subserviceId: values.subserviceId,
          specificDate: values.specificDate,
          customDuration: values.customDuration,
          startTime: values.startTime,
          subserviceName: values.subserviceName,
        };

        if (values.specificDate) {
          // Single date case
          const dateWithTime = new Date(values.bookingDate);
          dateWithTime.setHours(
            values.startTime.getHours(),
            values.startTime.getMinutes(),
            0,
            0
          );
          payload.bookingDate = dateWithTime;
          payload.groomerId = values.groomerId;
        } else {
          // Date range case - apply startTime to both dates
          const applyTimeToDate = (date) => {
            if (!date || !values.startTime) return date;
            const newDate = new Date(date);
            newDate.setHours(
              values.startTime.getHours(),
              values.startTime.getMinutes(),
              0,
              0
            );
            return newDate;
          };

          payload.startDate = applyTimeToDate(values.bookingDate?.[0]);
          payload.endDate = applyTimeToDate(values.bookingDate?.[1]);
        }
        await SlotApi.createSlot(payload);
        formik.resetForm();
        toast.success("Slot created Successfully");
        setOpenModal(false);
        getAllSlot();
      } catch (error) {
        console.error("Error creating timeslot:", error);
        toast.error(error.response.data?.message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const fetchServices = async () => {
    try {
      const res = await ServiceApi.service();
      setServices(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const markHoliday = async () => {
    const { bookingDate } = formik.values;
    const formatToYYYYMMDD = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (!holidayReason) {
      toast.error("Holiday reason required");
      return;
    }
    const payload = {
      reason: holidayReason,
    };
    try {
      if (formik.values.specificDate) {
        const date = new Date(bookingDate);
        payload.startDate = formatToYYYYMMDD(date);
        payload.endDate = formatToYYYYMMDD(date);
      } else {
        const start = new Date(bookingDate[0]);
        const end = new Date(bookingDate[1]);
        payload.startDate = formatToYYYYMMDD(start);
        payload.endDate = formatToYYYYMMDD(end);
      }

      const res = await SlotApi.markHoliday(payload);
      formik.resetForm();
      setHolidayReason("");
      toast.success("Holiday has been marked successfully!");
    } catch (error) {
      console.log("erorr", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to mark the holiday. Please try again."
      );
    }
  };

  const getAllSlot = async () => {
    try {
      const today = new Date();
      const dateOnly = today.toISOString().slice(0, 10);
      const res = await SlotApi.getAllSlot(dateOnly);
      if (res?.message === "Office holiday – no timeslots available")
        setExistingSlot([]);
      else setExistingSlot(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleServiceType = async () => {
    handleLoading(true);
    try {
      const res = await ServiceApi.serviceType();
      setServicesData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
    handleLoading(false);
  };
  const handleSubService = async (serviceTypeId) => {
    handleLoading(true);
    try {
      const res = await ServiceApi.getSubServiceByServiceId({
        serviceId: serviceTypeId,
      });
      setSubService(res.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  useMemo(() => {
    handleSubService(servicesData?.[0]?._id);
  }, [servicesData]);
  useEffect(() => {
    fetchServices();
    getAllSlot();
    handleServiceType();
  }, []);

  const handleHolidayModal = () => {
    !formik.values.bookingDate
      ? toast.error("Fill the date first")
      : setShowHolidayModal(true);
  };

  function changeDateKeepTime(datePart, timePart) {
    const date = new Date(datePart);
    const time = new Date(timePart);

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());
    date.setMilliseconds(time.getMilliseconds());

    return date.toISOString();
  }

  const holidayProps = {
    showHolidayModal,
    setShowHolidayModal,
    setHolidayReason,
    markHoliday,
    formik,
  };

  return (
    <div className=" bg-gray-50  p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Timeslot Management
          </h1>
          <p className="text-gray-600">Manage grooming appointment slots</p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer flex items-center gap-2"
        >
          <FiPlus /> Create New Slot
        </button>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-gray-800/80 bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="bg-white shadow-lg px-6 pt-6 lg:w-[30rem] max-h-[75vh] w-[95%] md:w-[70%] overflow-y-auto">
            <div className="">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Slot</h2>
                <button
                  onClick={() => {
                    setOpenModal(false);
                    formik.resetForm();
                  }}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className=" gap-6">
                  {/* Date Section */}
                  <div className=" p-4 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="specificDate"
                          name="specificDate"
                          checked={formik.values.specificDate}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            formik.setFieldValue("specificDate", isChecked);
                            formik.setFieldValue(
                              "bookingDate",
                              isChecked ? null : [null, null]
                            );
                          }}
                          className="h-4 w-4 cursor-pointer text-primary focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="specificDate"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Specific Date Only
                        </label>
                      </div>

                      {/* Holiday Confirmation Modal */}
                      <HolidayModal holidayProps={holidayProps} />

                      {/* Usage in your existing button */}

                      {formik.values.specificDate ? (
                        <div className="w-full ">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Booking Date <span className="text-red-500">*</span>
                          </label>
                          <DatePicker
                            selected={
                              formik.values.bookingDate
                                ? new Date(formik.values.bookingDate)
                                : null
                            }
                            required={true}
                            onChange={(date) => {
                              if (date) {
                                const adjustedDate = new Date(date);
                                adjustedDate.setHours(0, 0, 0, 0);
                                formik.setFieldValue(
                                  "bookingDate",
                                  adjustedDate
                                );
                              }
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select date"
                            className="border rounded-md px-3 outline-none border-gray-300 py-2 w-full bg-white"
                            minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                            popperPlacement="bottom-start"
                            isClearable
                            wrapperClassName="w-full" // Add this if using react-datepicker
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date Range <span className="text-red-500">*</span>
                          </label>
                          <DatePicker
                            selected={formik.values.bookingDate?.[0] || null}
                            startDate={formik.values.bookingDate?.[0] || null}
                            endDate={formik.values.bookingDate?.[1] || null}
                            onChange={(dates) => {
                              const [start, end] = dates;
                              formik.setFieldValue("bookingDate", [
                                start || null,
                                end || null,
                              ]);
                            }}
                            required
                            selectsRange
                            placeholderText="Select date range"
                            className="border outline-none border-gray-300 rounded-lg px-3 py-2 w-full bg-white"
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            popperPlacement="bottom-start"
                            isClearable
                            selectsDisabledDaysInRange
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleHolidayModal}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 flex items-center gap-1 cursor-pointer"
                      >
                        Mark as Holiday
                      </button>

                      <div className="">
                        <div className="space-y-4">
                          <InputField
                            label="Subservice Type"
                            type="select"
                            value={formik.values.subserviceId}
                            onChange={(e) => {
                              const value = e.target.value;
                              formik.setFieldValue("subserviceId", value);

                              const service = services?.find(
                                (s) => s._id === value
                              );

                              if (service?.name === "basic") {
                                formik.setFieldValue("customDuration", 60);
                                formik.setFieldValue("travelTime", 30);
                              } else if (service?.name === "full") {
                                formik.setFieldValue("customDuration", 90);
                                formik.setFieldValue("travelTime", 30);
                              } else {
                                formik.setFieldValue("customDuration", 120);
                                formik.setFieldValue("travelTime", 30);
                              }

                              formik.setFieldValue(
                                "subserviceName",
                                service?.name
                              );
                            }}
                            isRequired
                            onBlur={formik.handleBlur}
                            error={
                              formik.touched.subserviceId &&
                              formik.errors.subserviceId
                            }
                            labelClassName="text-sm"
                            placeholder="Select a subservice"
                            options={subService?.map((service) => ({
                              value: service._id,
                              label: `${service.name}`,
                            }))}
                          />
                        </div>
                      </div>

                      <DatePicker
                        selected={formik.values.startTime}
                        onChange={(timeOnlyDate) => {
                          const bookingDate = formik.values.specificDate
                            ? formik.values.bookingDate
                            : formik.values.bookingDate?.[0]; // Get start of range
                          if (!bookingDate || !timeOnlyDate) return;

                          const updatedDateTime = changeDateKeepTime(
                            bookingDate,
                            timeOnlyDate
                          );

                          formik.setFieldValue(
                            "startTime",
                            new Date(updatedDateTime)
                          );
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        placeholderText="Select time"
                        className="border rounded-lg outline-none border-gray-300 px-3 py-2 w-full bg-white"
                        popperPlacement="bottom-start"
                      />
                    </div>
                  </div>

                  {/* Duration Section */}
                  <div className=" p-4 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custom Duration (minutes)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="customDuration"
                            min="15"
                            max="240"
                            value={formik.values.customDuration}
                            onChange={formik.handleChange}
                            className="border outline-none border-gray-300 rounded-lg px-3 py-2 w-full bg-white pl-10"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">min</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Travel Buffer Time (minutes)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="travelTime"
                            min="5"
                            max="120"
                            value={formik.values.travelTime}
                            onChange={formik.handleChange}
                            className="border rounded-lg outline-none border-gray-300 px-3 py-2 w-full bg-white pl-10"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiNavigation className="text-gray-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sticky pb-6 pt-2 border-t border-gray-300 bottom-0 bg-white flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal(false);
                        formik.resetForm();
                      }}
                      className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-primary text-white rounded-lg cursor-pointer  flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>Create Timeslot</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManagement;
