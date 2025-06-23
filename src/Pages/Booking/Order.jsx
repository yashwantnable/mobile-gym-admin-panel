// import React, { useEffect, useMemo, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import SidebarField from "../../Components/SideBarField";
// import Button from "../../Components/Button";
// import InputField from "../../Components/InputField";
// import DeleteModal from "../../Components/DeleteModal";
// import { useLoading } from "../../Components/loader/LoaderContext";
// import { GroomerApi } from "../../Api/Groomer.api";
// import { Table2 } from "../../Components/Table/Table2";
// import { BookingApi } from "../../Api/Booking.api";
// import { toast } from "react-toastify";
// import moment from "moment/moment";
// import { OrderApi } from "../../Api/Order.api.js";
// import { getOrderColumns } from "./OrderColumn.jsx";
// import { SlotApi } from "../../Api/Slot.api.js";
// import { orderColumns } from "@tanstack/react-table";

// const validationSchema = Yup.object({
//   customerId: Yup.string().required("Customer is required"),
//   petId: Yup.string().required("Pet is required"),
//   serviceTypeId: Yup.string().required("Service type is required"),
//   subServiceId: Yup.string().required("Service is required"),
//   weightType: Yup.string().required("Weight type is required"),
//   date: Yup.date().required("Date is required"),
//   timeSlotId: Yup.string().required("Time slot is required"),
//   groomerId: Yup.string().required("Groomer is required"),
//   status: Yup.string().required("Status is required"),
//   notes: Yup.string(),
// });
// const statusSchema = Yup.object({
//   status: Yup.string().required("Status is required"),
// });

// const Order = () => {
//   const [open, setOpen] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [assignModal, setAssignModal] = useState(false); // Added missing state
//   const [activeTab, setActiveTab] = useState("ALL");
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [groomingDetails, setGroomingDetails] = useState([]);

//   const [groomers, setGroomers] = useState([]);
//   const [subServices, setSubService] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const { handleLoading } = useLoading();
//   const [orderData, setOrderData] = useState([]);
//   const [timeSlots, setTimeSlots] = useState([]);

//   const bookingFormik = useFormik({
//     initialValues: {
//       customerId: "",
//       petId: [],
//       serviceTypeId: "",
//       subServiceId: "",
//       weightType: "",
//       date: selectedRow?.date
//         ? moment(selectedRow.date).format("YYYY-MM-DD")
//         : "",
//       timeSlotId: "",
//       groomerId: selectedRow?.groomer?._id || "",
//       price: 0,
//       status: "Pending",
//       notes: "",
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//   //     try {
//   //       const res = await BookingApi.createBooking(values);
//   //       toast.success("Booking created Successfully");
//   //       getAllBoooking();
//   //     } catch (error) {
//   //       toast.error(error?.response?.data?.message);
//   //       console.log("errorr");
//   //     }
//   //     setCreateOrder(false);
//   //   },
//   // });

//   // const updateOrderFormik = useFormik({
//   //   initialValues: {
//   //     customerId: selectedRow?.customer?._id || "",
//   //     date: selectedRow?.date
//   //       ? moment(selectedRow.date).format("YYYY-MM-DD")
//   //       : "",
//   //     timeSlotId: selectedRow?.timeSlotId || "",
//   //     groomerId: selectedRow?.groomer?._id || "",
//     },
//     onSubmit: async (values) => {
//       console.log("values", values);
//       // try {
//       //   const res = await BookingApi.updateBooking(selectedRow._id, values);
//       //   toast.success("Booking updated Successfully");
//       //   getAllBoooking();
//       //   setOpen(false);
//       // } catch (error) {
//       //   toast.error(error?.response?.data?.message);
//       // }
//     },
//   });

//   // const getAllBoooking = async () => {
//   //   handleLoading(true);
//   //   try {
//   //     const res = await OrderApi.getAllOrders();
//   //     setOrderData(res.data.data);
//   //   } catch (error) {
//   //     console.log("erorr", error);
//   //   } finally {
//   //     handleLoading(false);
//   //   }
//   // };

//   useEffect(() => {
//     // getAllBoooking();
//   }, []);

//   const statusFormik = useFormik({
//     initialValues: {
//       status: null,
//     },
//     validationSchema: statusSchema,
//     onSubmit: (values) => {
//       console.log("status values ", values);
//       statusFormik.resetForm();
//       setShowDropdown(false);
//     },
//   });

//   useEffect(() => {
//     if (bookingFormik.values.serviceTypeId) {
//       handleSubService(bookingFormik.values.serviceTypeId);
//     }
//   }, [bookingFormik.values.serviceTypeId]);

//   useEffect(() => {
//     if (bookingFormik.values.customerId) {
//       fetchPetsByUserId(bookingFormik.values.customerId);
//     }
//   }, [bookingFormik.values.customerId]);

//   useEffect(() => {
//     if (bookingFormik.values.subServiceId) {
//       const selectedSubService = subServices.find(
//         (s) => s._id === bookingFormik.values.subServiceId
//       );
//       setGroomingDetails(selectedSubService?.groomingDetails || []);
//       bookingFormik.setFieldValue("weightType", "");
//       bookingFormik.setFieldValue("price", 0);
//     }
//   }, [bookingFormik.values.subServiceId]);

//   useEffect(() => {
//     if (bookingFormik.values.weightType && groomingDetails.length > 0) {
//       const selectedDetail = groomingDetails.find(
//         (detail) => detail.weightType === bookingFormik.values.weightType
//       );
//       if (selectedDetail) {
//         bookingFormik.setFieldValue("price", selectedDetail.price);
//       }
//     }
//   }, [bookingFormik.values.weightType]);

//   const handleDateChange = (date) => {
//     const slots = timeSlots.filter((slot) => {
//       const isBooked = orderData.some(
//         (booking) => booking.date === date && booking.timeSlotId === slot.id
//       );
//       return !isBooked;
//     });
//     setAvailableTimeSlots(slots);
//     bookingFormik.setFieldValue("timeSlotId", "");
//   };

//   const handleTimeSlotChange = (timeSlotId) => {
//     const available = groomers.filter((groomer) => {
//       const isBooked = orderData.some(
//         (booking) =>
//           booking.date === bookingFormik.values.date &&
//           booking.timeSlotId === timeSlotId &&
//           booking.groomerId === groomer.id
//       );
//       return !isBooked;
//     });
//     setAvailableGroomers(available);
//     bookingFormik.setFieldValue("groomerId", "");
//   };

//   const groomerOptions = groomers.map((groomer) => ({
//     value: groomer._id,
//     label: `${groomer.first_name} ${" "} ${groomer.last_name}`,
//   }));

//   const handleDelete = async (data) => {
//     handleLoading(true);
//     try {
//       const res = await BookingApi.deleteBooking(data?._id);
//       toast.success("Booking deleted Successfully");
//       getAllBoooking();
//     } catch (error) {
//       console.log("error", error);
//       toast.error(error?.response?.data?.message);
//     } finally {
//       handleLoading(false);
//     }
//     setDeleteModal(false);
//   };

//   const bookingColumns = useMemo(
//     () =>
//       getOrderColumns({
//         onEdit: (row) => {
//           setOpen(true);
//           setSelectedRow(row);
//         },
//         onDelete: (row) => {
//           setDeleteModal(row);
//         },
//         onAssign: (row) => {
//           setAssignModal(row);
//         },
//       }),
//     [setOpen, setDeleteModal, setAssignModal] // Added dependencies
//   );

//   const filterBookings = () => {
//     if (activeTab === "ALL") {
//       return orderData;
//     } else if (activeTab === "Today") {
//       const today = new Date().toISOString().split("T")[0];
//       return orderData.filter((booking) => {
//         const bookingDate = new Date(booking.date).toISOString().split("T")[0];
//         return bookingDate === today;
//       });
//     } else {
//       return orderData.filter(
//         (booking) => booking.status.toLowerCase() === activeTab.toLowerCase()
//       );
//     }
//   };

//   const getAllSlot = async (date) => {
//     try {
//       const res = await SlotApi.getAllSlot(date);
//       console.log("res", res);
//       if (res?.message === "Office holiday – no timeslots available")
//         setTimeSlots([]);
//       else setTimeSlots(res?.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//     }
//   };
//   const getGroomerByDate = async (date) => {
//     try {
//       const res = await GroomerApi.getGroomerByDate(date);
//       console.log("res", res);
//       setGroomers(res.data?.data);
//       // setTimeSlots([]);
//       //   else setTimeSlots(res?.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//     }
//   };

//   const timeSlotOptions = timeSlots?.map((item) => {
//     return {
//       label: moment(item?.startTime).format("hh:mm A"),
//       value: item?._id,
//     };
//   });

//   console.log("tiemslots", timeSlotOptions);

//   return (
//     <>
//       <div className="p-5">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-4xl font-bold text-primary">Orders</h2>
//         </div>

//         {/* <div className="flex">
//           {["ALL", "Today","Cancelled"].map((tabName) => (
//             <p
//               key={tabName}
//               className={`border ${
//                 tabName == activeTab ? "bg-primary text-white" : ""
//               } cursor-pointer px-4 rounded-md w-[100px] flex justify-center ml-4 text-primary`}
//               onClick={() => setActiveTab(tabName)}
//             >
//               {tabName}
//             </p>
//           ))}
//         </div> */}
//         <Table2
//           column={bookingColumns}
//           internalRowData={orderData}
//           searchLabel={"Pet Type"}
//           sheetName={"Pet Type"}
//           setModalOpen={setOpen}
//           setSelectedRow={setSelectedRow}
     
//         />

//         {open && (
//           <SidebarField
//             title="Update Order"
//             handleClose={() => {
//               setOpen(false);
//               updateOrderFormik.resetForm();
//               setSelectedRow(null);
//             }}
//             button1={
//               <Button
//                 onClick={updateOrderFormik.handleSubmit}
//                 text={"Update"}
//                 type="submit"
//               />
//             }
//             button2={
//               <Button
//                 variant="outline"
//                 onClick={() => updateOrderFormik.resetForm()}
//                 text="Clear"
//               />
//             }
//           >
//             <form
//               onSubmit={updateOrderFormik.handleSubmit}
//               className="space-y-4"
//             >
//               <div className="px-8">
//                 <div className="space-y-2 text-gray-500">
//                   <p className="flex justify-center border-b-1 mb-2">
//                     Customer Details
//                   </p>
//                   <div className="flex justify-between">
//                     <span>Name:</span>
//                     <span>
//                       {selectedRow?.created_by?.first_name || "N/A"}{" "}
//                       {selectedRow?.created_by?.last_name || ""}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Contact No:</span>
//                     <span>
//                       {selectedRow?.defaultAddress?.phone_number || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Email:</span>
//                     <span>N/A</span> {/* Email not available in the data */}
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Address:</span>
//                     <div className="text-right">
//                       {selectedRow?.defaultAddress ? (
//                         <div className="space-y-1">
//                           <div className="font-medium">
//                             {selectedRow.defaultAddress.name}
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Flat </span>{" "}
//                             <span>{selectedRow.defaultAddress.flat_no}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Street</span>
//                             <span>{selectedRow.defaultAddress.street}</span>
//                           </div>
//                           {selectedRow.defaultAddress.landmark && (
//                             <div className="flex justify-between">
//                               <span>Near: </span>{" "}
//                               <span>{selectedRow.defaultAddress.landmark}</span>
//                             </div>
//                           )}
//                           <div>
//                             {selectedRow.defaultAddress.city?.name},{" "}
//                             {selectedRow.defaultAddress.country?.name}
//                           </div>
//                           <div className="text-blue-600">
//                             Postal Code: {selectedRow.defaultAddress.pin_code}
//                           </div>
//                         </div>
//                       ) : (
//                         "N/A"
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2 text-gray-500 border-b-1 mt-4">
//                   <p className="flex justify-center border-b-1 mb-2">
//                     Order Details
//                   </p>
//                   <div className="flex justify-between">
//                     <span>Order ID:</span>
//                     <span>{selectedRow?.orderid || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Order Date:</span>
//                     <span>
//                       {new Date(selectedRow?.order_date).toLocaleString() ||
//                         "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Payment Type:</span>
//                     <span className="capitalize">
//                       {selectedRow?.pay_type?.toLowerCase() || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Total Amount:</span>
//                     <span>
//                       {selectedRow?.total_delivery_price?.$numberDecimal || "0"}{" "}
//                       AED
//                     </span>
//                   </div>
//                 </div>

//                 <div className="my-4">
//                   <div className="flex justify-between mb-2 items-center">
//                     <span>Order Status:</span>
//                     <span
//                       className={`${
//                         selectedRow?.status === "Pending"
//                           ? "bg-yellow-500"
//                           : selectedRow?.status === "Completed"
//                           ? "bg-green-600"
//                           : selectedRow?.status === "Cancelled"
//                           ? "bg-red-500"
//                           : "bg-gray-400"
//                       } rounded-md px-2 py-1 text-white`}
//                     >
//                       {selectedRow?.status || "N/A"}
//                     </span>
//                   </div>

//                   {/* Groomer selection - if applicable */}

//                   {/* Date selection */}
//                   <InputField
//                     name="date"
//                     label="Date"
//                     type="date"
//                     value={updateOrderFormik.values.date}
//                     onChange={(e) => {
//                       updateOrderFormik.handleChange(e);
//                       handleDateChange(e.target.value);
//                       getAllSlot(e.target.value);
//                     }}
//                     error={
//                       updateOrderFormik.touched.date &&
//                       updateOrderFormik.errors.date
//                     }
//                     isRequired
//                   />
//                   {updateOrderFormik.values.date && (
//                     <InputField
//                       name="timeSlotId"
//                       label="Time Slot"
//                       type="select"
//                       options={timeSlotOptions}
//                       value={updateOrderFormik.values.timeSlotId}
//                       onChange={(e) => {
//                         updateOrderFormik.handleChange(e);
//                         // handleTimeSlotChange(e.target.value);
//                         getGroomerByDate({
//                           bookingDate: updateOrderFormik.values.date,
//                           timeSlotId: e.target.value,
//                         });
//                       }}
//                       error={
//                         updateOrderFormik.touched.timeSlotId &&
//                         updateOrderFormik.errors.timeSlotId
//                       }
//                       isRequired
//                     />
//                   )}
//                   <InputField
//                     name="groomerId"
//                     label="Groomer"
//                     type="select"
//                     options={groomerOptions}
//                     value={updateOrderFormik.values.groomerId}
//                     onChange={updateOrderFormik.handleChange}
//                     error={
//                       updateOrderFormik.touched.groomerId &&
//                       updateOrderFormik.errors.groomerId
//                     }
//                     isRequired
//                   />
//                 </div>
//               </div>
//             </form>
//           </SidebarField>
//         )}

//         {deleteModal && (
//           <DeleteModal
//             deleteModal={deleteModal}
//             setDeleteModal={setDeleteModal}
//             handleDelete={() => handleDelete(deleteModal)}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default Order;
