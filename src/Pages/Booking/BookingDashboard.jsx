import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { bookingRowData } from "../../dummydata";
import SidebarField from "../../Components/SideBarField";
import Button from "../../Components/Button";
import InputField from "../../Components/InputField";
import DeleteModal from "../../Components/DeleteModal";
import { timeSlots } from "../../Components/dummydata";
import PriceDisplay from "../../Components/PriceDisplay";
import { useLoading } from "../../Components/loader/LoaderContext";
import { Table2 } from "../../Components/Table/Table2";
import { getBookingColumns } from "./BookingColumns.jsx";
// import { ServiceApi } from "../../Api/Service.api";
// import { PetProfileApi } from "../../Api/PetProfile.api";
// import { GroomerApi } from "../../Api/Groomer.api";
// import { BookingApi } from "../../Api/Booking.api";
// import { SlotApi } from "../../Api/Slot.api.js";

const validationSchema = Yup.object({
  customerId: Yup.string().required("Customer is required"),
  petId: Yup.string().required("Pet is required"),
  serviceTypeId: Yup.string().required("Service type is required"),
  subServiceId: Yup.string().required("Service is required"),
  petWeight: Yup.string().required("Weight type is required"),
  date: Yup.date().required("Date is required"),
  timeSlotId: Yup.string().required("Time slot is required"),
  groomerId: Yup.string().required("Groomer is required"),
  status: Yup.string().required("Status is required"),
  notes: Yup.string(),
});

const BookingDashboard = () => {
  const [open, setOpen] = useState(false);
  const [createOrder, setCreateOrder] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedRow, setSelectedRow] = useState(null);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [subServices, setSubService] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [existingSlot, setExistingSlot] = useState([]);
  const [availableGroomers, setAvailableGroomers] = useState([]);
  const [groomingDetails, setGroomingDetails] = useState([]);
  const { handleLoading } = useLoading();

  // const handleServiceType = async () => {
  //   handleLoading(true);
  //   try {
  //     const res = await ServiceApi.serviceType();
  //     setServices(res.data?.data);
  //   } catch (err) {
  //     console.error("Error fetching service types:", err);
  //     toast.error("Failed to load service types");
  //   } finally {
  //     handleLoading(false);
  //   }
  // };

  // const handleAllCustomers = async () => {
  //   handleLoading(true);
  //   try {
  //     const res = await PetProfileApi.getAllUser();
  //     setUsers(res.data?.data);
  //   } catch (err) {
  //     console.error("Error fetching customers:", err);
  //     toast.error("Failed to load customers");
  //   } finally {
  //     handleLoading(false);
  //   }
  // };

  // const handleAllGroomers = async () => {
  //   handleLoading(true);
  //   try {
  //     const res = await GroomerApi.getAllGroomers();
  //     setGroomers(res.data?.data);
  //   } catch (err) {
  //     console.error("Error fetching groomers:", err);
  //     toast.error("Failed to load groomers");
  //   } finally {
  //     handleLoading(false);
  //   }
  // };

  // const handleSubService = async (serviceTypeId) => {
  //   if (!serviceTypeId) return;

  //   handleLoading(true);
  //   try {
  //     const res = await ServiceApi.getSubServiceByServiceId({
  //       serviceId: serviceTypeId,
  //     });
  //     setSubService(res.data?.data);
  //     setGroomingDetails([]);
  //     bookingFormik.setFieldValue("subServiceId", "");
  //     bookingFormik.setFieldValue("weightType", "");
  //     bookingFormik.setFieldValue("price", 0);
  //   } catch (err) {
  //     console.error("Error fetching subservices:", err);
  //     toast.error("Failed to load services");
  //   } finally {
  //     handleLoading(false);
  //   }
  // };

  const fetchPetsByUserId = async (userId) => {
    if (!userId) return;

    handleLoading(true);
    try {
      const res = await PetProfileApi.getAllPet({ userId });
      setPets(res.data?.data);
      bookingFormik.setFieldValue("petId", "");
    } catch (err) {
      console.error("Error fetching pets:", err);
      toast.error("Failed to load pets");
    } finally {
      handleLoading(false);
    }
  };

  const bookingFormik = useFormik({
    initialValues: {
      customerId: "",
      petId: "",
      serviceTypeId: "",
      subServiceId: "",
      petWeight: "",
      date: "",
      timeSlotId: "",
      groomerId: "",
      price: 0,
      status: "Pending",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await BookingApi.createBooking(values);
        toast.success("Booking created successfully");
        getAllBoooking();
        setCreateOrder(false);
      } catch (error) {
        console.error("Error creating booking:", error);
        toast.error(
          error?.response?.data?.message || "Failed to create booking"
        );
      }
    },
  });

  const updateBookingFormik = useFormik({
    initialValues: {
      subServiceId: selectedRow?.subService?._id || "",
      date: selectedRow?.date
        ? moment(selectedRow.date).format("YYYY-MM-DD")
        : "",
      timeSlotId: selectedRow?.timeSlotId || "",
      groomerId: selectedRow?.groomer?._id || "",
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          subServiceId: values.subServiceId,
          date: values.date,
          timeSlotId: values.timeSlotId,
          groomerId: values.groomerId,
        };
        await BookingApi.updateBooking(selectedRow._id, payload);
        toast.success("Booking updated successfully");
        getAllBoooking();
        setOpen(false);
      } catch (error) {
        console.error("Error updating booking:", error);
        toast.error(
          error?.response?.data?.message || "Failed to update booking"
        );
      }
    },
  });

  const getAllBoooking = async () => {
    handleLoading(true);
    try {
      const res = await BookingApi.getAllBooking();
      setBookingData(res.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      handleLoading(false);
    }
  };

  // const getAllSlot = async (date) => {
  //   console.log("called");
  //   // if (!date || !updateBookingFormik|| !bookingFormik.values.subServiceId) return;

  //   try {
  //     const res = await SlotApi.getAllSlot({
  //       date: date,
  //       subServiceId: bookingFormik.values.subServiceId,
  //     });
  //     setExistingSlot(res?.data?.data || []);
  //   } catch (error) {
  //     console.error("Error fetching slots:", error);
  //     toast.error("Failed to load available time slots");
  //   }
  // };

  // const getAvailableGroomers = async (subServiceId, date, timeslotId) => {
  //   if (!subServiceId || !date || !timeslotId) return;

  //   handleLoading(true);
  //   try {
  //     const res = await GroomerApi.getAvailableGroomer({
  //       date,
  //       subServiceId,
  //       timeslot: timeslotId,
  //     });
  //     setAvailableGroomers(res.data?.data?.availableGroomers || []);
  //   } catch (err) {
  //     console.error("Error fetching available groomers:", err);
  //     toast.error("Failed to load available groomers");
  //   } finally {
  //     handleLoading(false);
  //   }
  // };

  useEffect(() => {
    // handleServiceType();
    // handleAllCustomers();
    // handleAllGroomers();
    // getAllBoooking();
  }, []);

  useEffect(() => {
    if (bookingFormik.values.serviceTypeId) {
      handleSubService(bookingFormik.values.serviceTypeId);
    }
  }, [bookingFormik.values.serviceTypeId]);

  useEffect(() => {
    if (bookingFormik.values.customerId) {
      fetchPetsByUserId(bookingFormik.values.customerId);
    }
  }, [bookingFormik.values.customerId]);

  useEffect(() => {
    if (bookingFormik.values.subServiceId) {
      const selectedSubService = subServices.find(
        (s) => s._id === bookingFormik.values.subServiceId
      );
      setGroomingDetails(selectedSubService?.groomingDetails || []);
      bookingFormik.setFieldValue("petWeight", "");
      bookingFormik.setFieldValue("price", 0);
    }
  }, [bookingFormik.values.subServiceId]);

  useEffect(() => {
    if (bookingFormik.values.petWeight && groomingDetails.length > 0) {
      const selectedDetail = groomingDetails.find(
        (detail) => detail.weightType === bookingFormik.values.petWeight
      );
      if (selectedDetail) {
        bookingFormik.setFieldValue("price", selectedDetail.price);
      }
    }
  }, [bookingFormik.values.petWeight]);

  const handleDateChange = (date) => {
    bookingFormik.setFieldValue("date", date);
    bookingFormik.setFieldValue("timeSlotId", "");
    bookingFormik.setFieldValue("groomerId", "");
    getAllSlot(date);
  };
  const handleDateUpdateChange = (date) => {
    console.log("date", date);
    updateBookingFormik.setFieldValue("date", date);
    updateBookingFormik.setFieldValue("timeSlotId", "");
    updateBookingFormik.setFieldValue("groomerId", "");
    getAllSlot(date);
  };

  const handleTimeSlotChange = (timeSlotId) => {
    bookingFormik.setFieldValue("timeSlotId", timeSlotId);
    bookingFormik.setFieldValue("groomerId", "");
    getAvailableGroomers(
      bookingFormik.values.subServiceId,
      bookingFormik.values.date,
      timeSlotId
    );
  };

  const serviceTypeOptions = services.map((service) => ({
    value: service._id,
    label: service.name,
  }));

  const userOptions = users.map((user) => ({
    value: user._id,
    label: `${user.first_name} ${user.last_name}`,
    subLabel: user.phone,
  }));

  const petOptions = pets.map((pet) => ({
    value: pet._id,
    label: pet.petName,
    subLabel: `${pet.breed?.name} (${pet.weight} kg)`,
  }));

  const groomerOptions = availableGroomers.map((groomer) => ({
    value: groomer._id,
    label: `${groomer.first_name} ${groomer.last_name}`,
  }));

  const subServiceOptions = subServices.map((service) => ({
    value: service._id,
    label: service.name,
    subLabel: `$${Math.min(
      ...service.groomingDetails.map((g) => g.price)
    )} - $${Math.max(...service.groomingDetails.map((g) => g.price))}`,
  }));

  const weightOptions = groomingDetails.map((detail) => ({
    value: detail.weightType,
    label: detail.weightType,
    subLabel: `$${detail.price}`,
  }));

  const handleDelete = async (data) => {
    handleLoading(true);
    try {
      await BookingApi.deleteBooking(data?._id);
      toast.success("Booking deleted successfully");
      getAllBoooking();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error?.response?.data?.message || "Failed to delete booking");
    } finally {
      handleLoading(false);
      setDeleteModal(false);
    }
  };

  const bookingColumns = useMemo(
    () =>
      getBookingColumns({
        onEdit: (row) => {
          setOpen(true);
          setSelectedRow(row);
          // updateBookingFormik.setValues({
          //   customerId: row.customer?._id || "",
          //   date: row.date ? moment(row.date).format("YYYY-MM-DD") : "",
          //   timeSlotId: row.timeSlotId || "",
          //   groomerId: row.groomer?._id || "",
          // });
        },
        onDelete: (row) => setDeleteModal(row),
        onAssign: (row) => setAssignModal(row),
      }),
    [setOpen, setDeleteModal, setAssignModal, updateBookingFormik.setValues]
  );

  const filterBookings = () => {
    if (activeTab === "ALL") return bookingData;
    if (activeTab === "Today") {
      const today = new Date().toISOString().split("T")[0];
      return bookingData.filter(
        (booking) =>
          new Date(booking.date).toISOString().split("T")[0] === today
      );
    }
    return bookingData.filter(
      (booking) => booking.status.toLowerCase() === activeTab.toLowerCase()
    );
  };

  function getDetailedAgeFromDOB(dobString) {
    if (!dobString) return "N/A";
    const dob = moment(dobString);
    const now = moment();
    const years = now.diff(dob, "years");
    dob.add(years, "years");
    const months = now.diff(dob, "months");
    dob.add(months, "months");
    const days = now.diff(dob, "days");
    return `${years} years ${months} months ${days} days`;
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold text-primary">Bookings</h2>
      </div>

      <Table2
        column={bookingColumns}
        isExcel={false}
        internalRowData={filterBookings()}
        searchLabel={"Bookings"}
        sheetName={"bookings"}
        isAdd={true}
        setModalOpen={setCreateOrder}
      />

      {open && (
        <SidebarField
          title="Update Booking"
          handleClose={() => {
            setOpen(false);
            updateBookingFormik.resetForm();
            setSelectedRow(null);
          }}
          button1={
            <Button
              onClick={updateBookingFormik.handleSubmit}
              text={"Update"}
              type="submit"
            />
          }
          button2={
            <Button
              variant="outline"
              onClick={() => updateBookingFormik.resetForm()}
              text="Clear"
            />
          }
        >
          <form
            onSubmit={updateBookingFormik.handleSubmit}
            className="space-y-4"
          >
            <div className="px-8">
              <div className="space-y-2 text-gray-500 ">
                <p className="flex justify-center border-b-1 mb-2">
                  Customer Details
                </p>
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{selectedRow?.customer?.first_name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact No:</span>
                  <span>{selectedRow?.customer?.phone_number || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span>{selectedRow?.customer?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span>{selectedRow?.address || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2 text-gray-500 border-b-1">
                <p className="flex justify-center border-b-1 mb-2">
                  Pet Details
                </p>
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{selectedRow?.pet?.petName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pet Type:</span>
                  <span>{selectedRow?.pet?.petType?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Breed:</span>
                  <span>{selectedRow?.pet?.breed?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span>{selectedRow?.pet?.weight || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span>{getDetailedAgeFromDOB(selectedRow?.pet?.dob)}</span>
                </div>
              </div>

              <div className="my-4">
                <div className="flex justify-between mb-2 items-center">
                  <span>Grooming Status:</span>
                  <span
                    className={`${
                      selectedRow?.status === "Pending"
                        ? "bg-yellow-500"
                        : selectedRow?.status === "Grooming"
                          ? "bg-blue-500"
                          : selectedRow?.status === "Done"
                            ? "bg-green-600"
                            : selectedRow?.status === "Cancelled"
                              ? "bg-red-500"
                              : "bg-gray-400"
                    } rounded-md px-2 py-1 text-white`}
                  >
                    {selectedRow?.status || "N/A"}
                  </span>
                </div>
                <InputField
                  name="serviceTypeId"
                  label="Service Type"
                  type="select"
                  options={serviceTypeOptions}
                  value={updateBookingFormik.values.serviceTypeId}
                  onChange={(e) => {
                    updateBookingFormik.handleChange(e);
                    handleSubService(e.target.value);
                    updateBookingFormik.setFieldValue("subServiceId", "");
                  }}
                  error={
                    updateBookingFormik.touched.serviceTypeId &&
                    updateBookingFormik.errors.serviceTypeId
                  }
                  isRequired
                />

                {updateBookingFormik.values.serviceTypeId && (
                  <InputField
                    name="subServiceId"
                    label="Service"
                    type="select"
                    options={subServiceOptions}
                    value={updateBookingFormik.values.subServiceId}
                    onChange={updateBookingFormik.handleChange}
                    error={
                      updateBookingFormik.touched.subServiceId &&
                      updateBookingFormik.errors.subServiceId
                    }
                    isRequired
                  />
                )}

                <InputField
                  name="date"
                  label="Date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={updateBookingFormik.values.date}
                  onChange={(e) => {
                    updateBookingFormik.handleChange(e); // for Formik
                    handleDateUpdateChange(e.target.value); // for custom logic
                  }}
                  error={
                    updateBookingFormik.touched.date &&
                    updateBookingFormik.errors.date
                  }
                  isRequired
                />

                {updateBookingFormik.values.date && (
                  <InputField
                    name="timeSlotId"
                    label="Time Slot"
                    type="select"
                    options={existingSlot.map((slot) => ({
                      value: slot._id,
                      label: moment(slot.startTime).format("hh:mm A"),
                    }))}
                    value={updateBookingFormik.values.timeSlotId}
                    onChange={(e) => {
                      updateBookingFormik.handleChange(e);
                      getAvailableGroomers(
                        selectedRow?.subService?._id,
                        updateBookingFormik.values.date,
                        e.target.value
                      );
                    }}
                    error={
                      updateBookingFormik.touched.timeSlotId &&
                      updateBookingFormik.errors.timeSlotId
                    }
                    isRequired
                  />
                )}

                {updateBookingFormik.values.timeSlotId && (
                  <InputField
                    name="groomerId"
                    label="Groomer"
                    type="select"
                    options={groomerOptions}
                    value={updateBookingFormik.values.groomerId}
                    onChange={updateBookingFormik.handleChange}
                    error={
                      updateBookingFormik.touched.groomerId &&
                      updateBookingFormik.errors.groomerId
                    }
                    isRequired
                  />
                )}
              </div>
            </div>
          </form>
        </SidebarField>
      )}

      {createOrder && (
        <SidebarField
          title={"Create New Booking"}
          handleClose={() => {
            setCreateOrder(false);
            bookingFormik.resetForm();
          }}
          button1={
            <Button
              onClick={bookingFormik.handleSubmit}
              text={"Create Booking"}
              type="submit"
            />
          }
          button2={
            <Button
              variant="outline"
              onClick={() => bookingFormik.resetForm()}
              text="Reset Form"
              className="w-full"
            />
          }
        >
          <form onSubmit={bookingFormik.handleSubmit} className="space-y-4">
            <div className="relative">
              <InputField
                name="customerId"
                label="Customer"
                type="select"
                options={userOptions}
                value={bookingFormik.values.customerId}
                onChange={bookingFormik.handleChange}
                error={
                  bookingFormik.touched.customerId &&
                  bookingFormik.errors.customerId
                }
                isRequired
              />

              <Link
                to={"/pets"}
                className="absolute top-0 right-2 px-4 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Customer
              </Link>
            </div>

            {bookingFormik.values.customerId && (
              <InputField
                name="petId"
                label="Pets"
                type="select"
                options={petOptions}
                value={bookingFormik.values.petId}
                onChange={bookingFormik.handleChange}
                error={
                  bookingFormik.touched.petId && bookingFormik.errors.petId
                }
                isRequired
              />
            )}

            <InputField
              name="serviceTypeId"
              label="Service Type"
              type="select"
              options={serviceTypeOptions}
              value={bookingFormik.values.serviceTypeId}
              onChange={bookingFormik.handleChange}
              error={
                bookingFormik.touched.serviceTypeId &&
                bookingFormik.errors.serviceTypeId
              }
              isRequired
            />

            {bookingFormik.values.serviceTypeId && (
              <InputField
                name="subServiceId"
                label="Service"
                type="select"
                options={subServiceOptions}
                value={bookingFormik.values.subServiceId}
                onChange={bookingFormik.handleChange}
                error={
                  bookingFormik.touched.subServiceId &&
                  bookingFormik.errors.subServiceId
                }
                isRequired
              />
            )}

            {bookingFormik.values.subServiceId && (
              <InputField
                name="petWeight"
                label="Weight Type"
                type="select"
                options={weightOptions}
                value={bookingFormik.values.petWeight}
                onChange={bookingFormik.handleChange}
                error={
                  bookingFormik.touched.petWeight &&
                  bookingFormik.errors.petWeight
                }
                isRequired
              />
            )}

            <InputField
              name="date"
              label="Date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={bookingFormik.values.date}
              onChange={(e) => handleDateChange(e.target.value)}
              error={bookingFormik.touched.date && bookingFormik.errors.date}
              isRequired
            />

            {bookingFormik.values.date && (
              <InputField
                name="timeSlotId"
                label="Time Slot"
                type="select"
                options={existingSlot.map((slot) => ({
                  value: slot._id,
                  label: moment(slot.startTime).format("hh:mm A"),
                }))}
                value={bookingFormik.values.timeSlotId}
                onChange={(e) => handleTimeSlotChange(e.target.value)}
                error={
                  bookingFormik.touched.timeSlotId &&
                  bookingFormik.errors.timeSlotId
                }
                isRequired
              />
            )}

            {bookingFormik.values.timeSlotId && (
              <InputField
                name="groomerId"
                label="Groomer"
                type="select"
                options={groomerOptions}
                value={bookingFormik.values.groomerId}
                onChange={bookingFormik.handleChange}
                error={
                  bookingFormik.touched.groomerId &&
                  bookingFormik.errors.groomerId
                }
                isRequired
              />
            )}

            {bookingFormik.values.petWeight && (
              <PriceDisplay
                label="Total Price"
                value={bookingFormik.values.price}
              />
            )}

            <InputField
              name="status"
              label="Status"
              type="select"
              options={[
                { label: "Pending", value: "Pending" },
                { label: "Confirmed", value: "Confirmed" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
              value={bookingFormik.values.status}
              onChange={bookingFormik.handleChange}
              error={
                bookingFormik.touched.status && bookingFormik.errors.status
              }
              isRequired
            />

            <InputField
              name="notes"
              label="Additional Notes"
              type="textarea"
              value={bookingFormik.values.notes}
              onChange={bookingFormik.handleChange}
              error={bookingFormik.touched.notes && bookingFormik.errors.notes}
            />
          </form>
        </SidebarField>
      )}

      {deleteModal && (
        <DeleteModal
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={() => handleDelete(deleteModal)}
        />
      )}
    </div>
  );
};

export default BookingDashboard;
