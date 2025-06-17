import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import SidebarField from "../../Components/SideBarField";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { FaCamera, FaRegEdit, FaTimes } from "react-icons/fa";
import { MasterApi } from "../../Api/Master.api";
import { GroomerApi } from "../../Api/Groomer.api";
import { toast } from "react-toastify";
import { ServiceApi } from "../../Api/Service.api";
import { useLoading } from "../../Components/loader/LoaderContext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import DeleteModal from "../../Components/DeleteModal";
import { Table2 } from "../../Components/Table/Table2";
import PhoneInputField from "../../Components/PhoneInputField";

const GroomersEmployee = () => {
  const [open, setOpen] = useState(false);
  const [experienceType, setExperienceType] = useState("");
  const [allGroomers, setAllGroomers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [services, setServices] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);

  const validationSchema = Yup.object({
    serviceProvider: Yup.array()
      .min(1, "Select at least one service type")
      .required("Service Type is required"),
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone_number: Yup.string().required("Phone Number is required"),
    address: Yup.string().required("Address is required"),
    gender: Yup.string().required("Gender is required"),
    age: Yup.number()
      .min(18, "Age must be at least 18")
      .required("Age is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    password: selectedRow?._id
      ? ""
      : Yup.string().required("Password is required"),
    specialization: Yup.string().required("Specialization is required"),
    experience: Yup.string().required("Experience is required"),
    experienceYear: Yup.number().when("experience", {
      is: "EXPERIENCE",
      then: (schema) => schema.required("Years of Experience is required"),
    }),
  });

  const { handleLoading } = useLoading();

  const formik = useFormik({
    initialValues: {
      serviceProvider: selectedRow?.serviceProvider || [],
      first_name: selectedRow?.first_name || "",
      last_name: selectedRow?.last_name || "",
      email: selectedRow?.email || "",
      phone_number: selectedRow?.phone_number || "",
      address: selectedRow?.address || "",
      gender: selectedRow?.gender || "",
      age: selectedRow?.age || "",
      profile_image: selectedRow?.profile_image || null,
      country: selectedRow?.country?._id || "",
      city: selectedRow?.city?._id || "",
      password: selectedRow?.password || "",
      specialization: selectedRow?.specialization || "",
      experience: selectedRow?.experience || "",
      experienceYear: selectedRow?.experienceYear || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleLoading(true);

      const formData = new FormData();
      values.serviceProvider.forEach((id) => {
        formData.append("serviceProvider[]", id);
      });
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone_number);
      formData.append("address", values.address);
      formData.append("gender", values.gender);
      formData.append("age", values.age);
      formData.append("country", values.country);
      formData.append("city", values.city);
      formData.append("password", values.password);
      formData.append("specialization", values.specialization);
      formData.append("experience", values.experience);
      formData.append("experienceYear", values.experienceYear);
      if (values.profile_image) {
        formData.append("profile_image", values.profile_image);
      }
      console.log("Form Submitted:", values);
      console.log("selectedRow:", selectedRow?._id);
      try {
        const res = selectedRow?._id
          ? await GroomerApi.updateGroomer(selectedRow?._id, formData)
          : await GroomerApi.createGroomer(formData);
        console.log(res.data?.data);
        toast.success(
          selectedRow?._id
            ? "User updated successfully"
            : "user created successfully"
        );
      } catch (err) {
        console.log(err);
      }
      setOpen(false);
      getGroomers();
      handleLoading(false);
    },
  });

  const getGroomers = async () => {
    handleLoading(true);
    try {
      const res = await GroomerApi.getAllGroomers();
      setAllGroomers(res?.data?.data);
    } catch (err) {
      toast.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await GroomerApi.DeleteGroomer(id);
      toast.success(res?.message);
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleteModal();
      getGroomers();
    }
  };
  const handleServiceType = async () => {
    handleLoading(true);
    try {
      const res = await ServiceApi.serviceType();
      // console.log(res.data);
      setServices(res.data?.data);
    } catch (err) {
      console.log(err);
    }
    handleLoading(false);
  };

  useEffect(() => {
    handleServiceType();
  }, []);

  const serviceTypeOption = services.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        formik.setFieldError("profile_image", "Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        formik.setFieldError("profile_image", "Image must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      formik.setFieldValue("profile_image", file);
      formik.setFieldError("profile_image", undefined);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    formik.setFieldValue("profile_image", null);
  };

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const cityDataforEdit = async (countryId) => {
    try {
      const res = await MasterApi.city(countryId);
      setCityData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    setCountryId(selectedCountryId);
    formik.setFieldValue("country", selectedCountryId);

    if (selectedCountryId) {
      try {
        const res = await MasterApi.city(selectedCountryId);
        setCityData(res.data?.data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    setImagePreview(selectedRow?.profile_image);
    cityDataforEdit(selectedRow?.country?._id);
  }, [selectedRow]);

  useEffect(() => {
    handleCountry();
    getGroomers();
  }, []);

  const countryOptions = countryData.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const cityOptions = cityData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const columns = useMemo(
    () => [
      {
        headerName: "Groomer Name",
        field: "first_name",
        cellRenderer: (params) => {
          const imageUrl = params.data?.profile_image;
          const name = params.data?.first_name || "N/A";
          return (
            <div className="flex items-center space-x-2">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="capitalize">{name}</span>
            </div>
          );
        },
      },
      {
        headerName: "Phone Number",
        field: "phone_number",
      },
      {
        headerName: "Email",
        field: "email",
      },
      {
        headerName: "Gender",
        field: "gender",
      },
      {
        headerName: "Age",
        field: "age",
      },
      {
        headerName: "Experience",
        field: "experienceYear",
      },
      {
        headerName: "Specialization",
        field: "specialization",
        valueGetter: (params) => params.data?.specialization ?? "N/A",
      },
      {
        headerName: "Actions",
        field: "actions",
        minWidth: 150,
        cellRenderer: (params) => (
          <div className="flex items-center space-x-3 mt-2">
            <button
              className="text-primary transition-colors cursor-pointer"
              onClick={() => {
                setOpen(true);
                setSelectedRow(params?.data);
                console.log(params?.data);
              }}
            >
              <FaRegEdit size={18} />
            </button>
            <button
              className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
              onClick={() => setDeleteModal(params?.data)}
            >
              <MdOutlineDeleteOutline size={20} />
            </button>
          </div>
        ),
      },
    ],
    []
  );
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    removeImage();
    formik.resetForm();
  };

  return (
    <>
      <div className="m-4">
        <h2 className="text-primary text-3xl font-semibold">Groomers</h2>
        <div>
          <Table2
            column={columns}
            internalRowData={allGroomers}
            searchLabel={"Groomers"}
            sheetName={"groomers"}
            setModalOpen={setOpen}
            isAdd={true}
          />

          {open && (
            <SidebarField
              title="Add New Groomer"
              handleClose={handleClose}
              button1={
                <Button
                  onClick={formik.handleSubmit}
                  text={selectedRow?._id ? "Update" : "Save"}
                  type="submit"
                />
              }
              button2={
                <Button variant="outline" onClick={handleClose} text="Cancel" />
              }
            >
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div
                      className={`w-32 mb-3 h-32 rounded-full border-2 ${
                        formik.errors.profile_image
                          ? "border-red-500"
                          : "border-gray-300"
                      } flex items-center justify-center overflow-hidden bg-gray-100 transition-all duration-200 hover:border-primary`}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <FaTimes className="text-red-500 w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FaCamera className="w-8 h-8 mb-2" />
                          <span className="text-xs">Add Photo</span>
                        </div>
                      )}
                    </div>

                    <label className="mt-4 cursor-pointer">
                      <span className="px-4 py-2 bg-primary ml-2 text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 text-sm">
                        {imagePreview ? "Change Photo" : "Upload Photo"}
                      </span>
                      <input
                        type="file"
                        name="profile_image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        onBlur={formik.handleBlur}
                      />
                    </label>
                  </div>

                  {formik.touched.profile_image &&
                    formik.errors.profile_image && (
                      <div className="mt-2 text-sm text-red-600">
                        {formik.errors.profile_image}
                      </div>
                    )}
                </div>

                <InputField
                  name="serviceProvider"
                  label="Service Type"
                  type="select"
                  isMulti={true}
                  options={serviceTypeOption}
                  value={formik.values.serviceProvider}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.serviceProvider &&
                    formik.errors.serviceProvider
                  }
                  isRequired
                />

                <InputField
                  name="first_name"
                  label="First Name"
                  placeholder="Enter First Name"
                  isRequired
                  value={formik.values.first_name}
                  error={formik.touched.first_name && formik.errors.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="last_name"
                  label="Last Name"
                  placeholder="Enter Last Name"
                  isRequired
                  value={formik.values.last_name}
                  error={formik.touched.last_name && formik.errors.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <InputField
                  name="email"
                  label="Email"
                  placeholder="Enter Email"
                  type="email"
                  isRequired
                  value={formik.values.email}
                  error={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <PhoneInputField
                  name="phone_number"
                  label="Phone Number"
                  value={formik.values.phone_number}
                  error={formik.errors.phone_number}
                  touched={formik.touched.phone_number}
                  onChange={formik.setFieldValue}
                  onBlur={formik.setFieldTouched}
                  isRequired
                />
                <InputField
                  name="address"
                  label="Address"
                  placeholder="Enter Address"
                  isRequired
                  value={formik.values.address}
                  error={formik.touched.address && formik.errors.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="gender"
                  label="Gender"
                  type="select"
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                  isRequired
                  value={formik.values.gender}
                  error={formik.touched.gender && formik.errors.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="age"
                  label="Age"
                  type="number"
                  isRequired
                  value={formik.values.age}
                  error={formik.touched.age && formik.errors.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="country"
                  label="Country"
                  type="select"
                  options={countryOptions}
                  isRequired
                  value={formik.values.country}
                  error={formik.touched.country && formik.errors.country}
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="city"
                  label="City"
                  type="select"
                  options={cityOptions}
                  isRequired
                  value={formik.values.city}
                  error={formik.touched.city && formik.errors.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {!selectedRow?._id && (
                  <InputField
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    isRequired
                    value={formik.values.password}
                    error={formik.touched.password && formik.errors.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
                <InputField
                  name="specialization"
                  label="Specialization"
                  placeholder="Enter Specialization"
                  isRequired
                  value={formik.values.specialization}
                  error={
                    formik.touched.specialization &&
                    formik.errors.specialization
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="experience"
                  label="Experience"
                  type="select"
                  options={[
                    { label: "Experience", value: "EXPERIENCE" },
                    { label: "Fresher", value: "FRESHER" },
                  ]}
                  isRequired
                  value={formik.values.experience}
                  error={formik.touched.experience && formik.errors.experience}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setExperienceType(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.values.experience === "EXPERIENCE" && (
                  <InputField
                    name="experienceYear"
                    label="How many years of experience?"
                    placeholder="Enter years of experience"
                    value={formik.values.experienceYear}
                    error={
                      formik.touched.experienceYear &&
                      formik.errors.experienceYear
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
              </form>
            </SidebarField>
          )}
        </div>
      </div>
      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          deleteModal={deleteModal}
          handleDelete={() => handleDelete(deleteModal?._id)}
        />
      )}
    </>
  );
};

export default GroomersEmployee;
