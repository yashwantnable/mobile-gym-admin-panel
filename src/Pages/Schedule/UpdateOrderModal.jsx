// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import { FiCalendar, FiEdit2, FiX } from "react-icons/fi";
// import { AnimatePresence, motion } from "framer-motion";
// import InputField from "../../Components/InputField";
// import { useLoading } from "../../Components/loader/LoaderContext";
// import { ServiceApi } from "../../Api/Service.api";
// import { GroomerApi } from "../../Api/Groomer.api";
// import { OrderApi } from "../../Api/Order.api";
// import { toast } from "react-toastify";

// const UpdateOrderModal = ({
//   selectedSlot,
//   timeSlot,
//   isModalOpen,
//   setIsModalOpen,
//   fetchSlots,
//   setCurrentDate,
// }) => {
//   const { handleLoading } = useLoading();
//   const [servicesData, setServicesData] = useState([]);
//   const [subService, setSubService] = useState();
//   const [availableGroomer, setAvailableGroomer] = useState([]);
//   const [groomerOption, setGroomerOption] = useState([]);

//   const formik = useFormik({
//     initialValues: {
//       date: "",
//       timeslotId: "",
//       groomer: "",
//       serviceType: "",
//       subserviceType: "",
//     },
//     onSubmit: async (values) => {
//       console.log("values", values);
//       const payload = {
//         orderId: selectedSlot?.orderId,
//         updates: [
//           {
//             orderDetailsId: selectedSlot?.orderDetailId,
//             date: values.date,
//             timeslotId: values.timeslotId,
//             groomer: values.groomer,
//           },
//         ],
//       };

//       handleLoading(true);
//       console.log("payload",payload)

//       // try {
//       //   const res = await OrderApi.updateOrder(payload);
//       //   console.log("res", res);
//       //   fetchSlots(values.subserviceType);
//       //   setIsModalOpen(false);
//       //   toast.success("Appointment Updated Successfully");
//       //   formik.resetForm();
//       // } catch (error) {
//       //   console.log("error", error);
//       // } finally {
//       //   handleLoading(false);
//       // }
//     },
//   });

//   // const handleServiceType = async () => {
//   //   handleLoading(true);
//   //   try {
//   //     const res = await ServiceApi.serviceType();
//   //     console.log("res", res);
//   //     setServicesData(res.data?.data);
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   //   handleLoading(false);
//   // };

//   // const handleSubService = async (serviceTypeId) => {
//   //   handleLoading(true);
//   //   try {
//   //     const res = await ServiceApi.getSubServiceByServiceId({
//   //       serviceId: serviceTypeId,
//   //     });
//   //     setSubService(res.data?.data);
//   //   } catch (err) {
//   //     console.log(err);
//   //   } finally {
//   //     handleLoading(false);
//   //   }
//   // };

//   // const getAvailableGroomme = async (subServiceId, date, timeslotId) => {
//   //   console.log("called", subServiceId, date);
//   //   handleLoading(true);
//   //   try {
//   //     const res = await GroomerApi.getAvailableGroomer({
//   //       date,
//   //       subServiceId,
//   //       timeslot: timeslotId,
//   //     });
//   //     setAvailableGroomer(res.data?.data?.availableGroomers);
//   //   } catch (err) {
//   //     console.log(err);
//   //   } finally {
//   //     handleLoading(false);
//   //   }
//   // };

//   console.log("available Grommer", availableGroomer);

//   // const availableGroomerOption = (timeSlotId) => {
//   //   console.log("id", timeSlotId);

//   //   const filterData = availableGroomer?.find(
//   //     (groomer) => groomer?._id === timeSlotId
//   //   );
//   //   console.log("filterData", filterData);
//   //   setGroomerOption(filterData?.availableGroomers);
//   //   return filterData;
//   // };

//   useEffect(() => {
//     // handleServiceType();
//   }, []);

//   const formatOptions = (items, labelKey = "name", valueKey = "_id") => {
//     return [
//       ...(items?.map((item) => ({
//         value: item[valueKey],
//         label: item[labelKey],
//       })) || []),
//     ];
//   };

//   console.log("selected slot", selectedSlot);

//   return (
//     <div>
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-gray-800/80 bg-opacity-50 flex items-center justify-center p-4 z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
//               style={{
//                 borderTop: `4px solid primary`,
//                 maxHeight: "90vh",
//                 overflowY: "auto",
//               }}
//             >
//               <div className="flex justify-between bg-primary text-white items-center border-b p-4 sticky top-0 z-10">
//                 <div className="flex items-center gap-3">
//                   {selectedSlot.groomerImage && (
//                     <span className="text-2xl">
//                       {selectedSlot.groomerImage}
//                     </span>
//                   )}
//                   <h3 className="text-lg font-medium">
//                     {selectedSlot.isExisting
//                       ? "Edit Appointment"
//                       : "Update Appoinment"}
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="p-1 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-colors"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>
//               <form onSubmit={formik.handleSubmit} className="p-4 space-y-4">
//                 <InputField
//                   label="Date"
//                   name="date"
//                   type="date"
//                   value={formik.values.date}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   error={formik.touched.date && formik.errors.date}
//                   isRequired
//                 />

//                 <InputField
//                   label="Service Type"
//                   name="serviceType"
//                   type="select"
//                   value={formik.values.serviceType}
//                   onChange={(e) => {
//                     formik.setFieldValue("serviceType", e.target.value);
//                     handleSubService(e.target.value);
//                   }}
//                   onBlur={formik.handleBlur}
//                   options={formatOptions(servicesData)}
//                   error={
//                     formik.touched.serviceType && formik.errors.serviceType
//                   }
//                   isRequired
//                 />

//                 <InputField
//                   label="Subservice Type"
//                   name="subserviceType"
//                   type="select"
//                   value={formik.values.subserviceType}
//                   onChange={(e) => {
//                     formik.setFieldValue("subserviceType", e.target.value);
//                     setCurrentDate(formik.values.date);
//                     fetchSlots(e.target.value);
//                   }}
//                   onBlur={formik.handleBlur}
//                   options={formatOptions(subService)}
//                   error={
//                     formik.touched.subserviceType &&
//                     formik.errors.subserviceType
//                   }
//                   isRequired
//                 />
//                 <InputField
//                   label="Timeslot"
//                   name="timeslotId"
//                   type="select"
//                   value={formik.values.timeslotId}
//                   onChange={(e) => {
//                     formik.setFieldValue("timeslotId", e.target.value);
//                     getAvailableGroomme(
//                       formik.values.subserviceType,
//                       formik.values.date,
//                       e.target.value
//                     );

//                     availableGroomerOption(e.target.value);
//                   }}
//                   onBlur={formik.handleBlur}
//                   options={formatOptions(timeSlot, "time", "id")}
//                   error={formik.touched.timeslotId && formik.errors.timeslotId}
//                   isRequired
//                 />
//                 <InputField
//                   label="Groomer"
//                   name="groomer"
//                   type="select"
//                   value={formik.values.groomer}
//                   onChange={(e) => {
//                     formik.setFieldValue("groomer", e.target.value);
//                   }}
//                   onBlur={formik.handleBlur}
//                   options={formatOptions(availableGroomer, "first_name", "_id")}
//                   error={formik.touched.groomer && formik.errors.groomer}
//                   isRequired
//                 />

//                 <div className="flex justify-end gap-3 pt-4 border-accent border-t">
//                   <motion.button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="px-4 py-2 border cursor-pointer border-primary text-primary bg-white rounded flex items-center gap-2"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     type="submit"
//                     className={`px-4 py-2  text-white cursor-pointer rounded flex items-center gap-2   ${formik.isSubmitting ? "bg-gray-600" : "bg-[#21C8B1]"}`}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     disabled={formik.isSubmitting}
//                   >
//                     {formik.isSubmitting ? (
//                       <>
//                         <svg
//                           className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <FiEdit2 size={16} />
//                         Update Appointment
//                       </>
//                     )}
//                   </motion.button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default UpdateOrderModal;
