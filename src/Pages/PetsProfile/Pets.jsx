import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaTrash, FaUpload, FaTimes, FaRegEdit } from "react-icons/fa";
import SidebarField from "../../Components/SideBarField";
import Button from "../../Components/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../Components/InputField";
import { PetProfileApi } from "../../Api/PetProfile.api";
import { toast } from "react-toastify";
import { MasterApi } from "../../Api/Master.api";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { toFormData } from "../formHandling";
import DeleteModal from "../../Components/DeleteModal";
import { useLoading } from "../../Components/loader/LoaderContext";
import { Table2 } from "../../Components/Table/Table2";

const validationSchema = Yup.object({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  phone_number: Yup.string().required("Contact Number is required"),
  // address: Yup.string().required("Address is required"),
  email: Yup.string().required("Email is required"),
  petinfo: Yup.array()
    .of(
      Yup.object({
        petName: Yup.string().required("Pet Name is required"),
        petType: Yup.string().required("petType is required"),
        breed: Yup.string().required("Breed is required"),
        gender: Yup.string().required("Gender is required"),
        weight: Yup.number()
          .positive("Weight must be positive")
          .required("Weight is required"),
        dob: Yup.date().required("Date of Birth is required"),
        activity_level: Yup.string().required("Activity level is required"),
        day_Habits: Yup.string().required("This field is required"),
        personality: Yup.string(),
        health_issues: Yup.string(),
        special_care: Yup.string(),
        document: Yup.mixed().nullable(),
        microchip_number: Yup.string(),
        warning: Yup.string(),
        dietary_requirements: Yup.string(),
        life_usage: Yup.string(),
      })
    )
    .min(1, "At least one pet is required"),
});

const Pets = () => {
  const [open, setOpen] = useState(false);
  const [petTypeData, setPetTypeData] = useState([]);
  const [breedTypeData, setBreedTypeData] = useState([]);
  const [idForBreed, setIdForBreed] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRefs = useRef([]);

  const { handleLoading } = useLoading()

  const getAllPets = async () => {
    handleLoading(true)
    try {
      const res = await PetProfileApi.getAllPet();
      setAllUsers(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pets");
    }
    handleLoading(false)
  };

  const getAllPetType = async () => {
    handleLoading(true)
    try {
      const res = await MasterApi.getAllpetType();
      setPetTypeData(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch pet types", err);
    }
    handleLoading(false)
  };

  const getAllBreeds = async () => {
    handleLoading(true)
    try {
      const res = await MasterApi.getAllBreed();
      setBreedTypeData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch breeds");
    }
    handleLoading(false)
  };

  const getFilteredBreeds = (petTypeId) => {
    if (!petTypeId) return [];
    return breedTypeData
      .filter((breed) => breed.petTypeId?._id === petTypeId)
      .map((breed) => ({
        label: breed.name,
        value: breed._id,
      }));
  };

  useEffect(() => {
    getAllPets();
    getAllPetType();
    getAllBreeds();
  }, []);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      address: "",
      petinfo: [
        {
          petName: "",
          petType: "",
          breed: "",
          dob: "",
          gender: "",
          weight: "",
          activity_level: "",
          day_Habits: "",
          personality: "",
          health_issues: "",
          special_care: "",
          microchip_number: "",
          warning: "",
          dietary_requirements: "",
          life_usage: "",
          image: null,
          document: null,
          existingImage: null,
          existingDocument: null,
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const payload = {
          ...(!selectedRow ? {
            // first_name: values.first_name,
            // last_name: values.last_name,
            // phone_number: values.phone_number,
            // address: values.address,
            email: values.email,
          } : {}),
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          address: values.address,

          petinfo: values.petinfo.map(pet => ({
            petName: pet.petName,
            petType: pet.petType,
            breed: pet.breed,
            dob: pet.dob,
            gender: pet.gender,
            weight: pet.weight,
            activity_level: pet.activity_level,
            day_Habits: pet.day_Habits,
            personality: pet.personality,
            health_issues: pet.health_issues,
            special_care: pet.special_care,
            microchip_number: pet.microchip_number,
            warning: pet.warning,
            dietary_requirements: pet.dietary_requirements,
            life_usage: pet.life_usage,
            ...(pet.image ? { image: pet.image } :
              pet.existingImage ? { existingImage: pet.existingImage } : {}),
            ...(pet.document ? { document: pet.document } :
              pet.existingDocument ? { existingDocument: pet.existingDocument } : {})
          }))
        };

        const formData = toFormData(payload);
        handleLoading(true)

        const res = selectedRow
          ? await PetProfileApi.updatePet(selectedRow._id, formData)
          : await PetProfileApi.createPet(formData);

        toast.success(res?.data?.message || "Operation successful");
        getAllPets();
        setOpen(false);
        setSelectedRow(null);
        formik.resetForm();
      } catch (err) {
        console.error("Error:", err);
        toast.error(err.response?.data?.message || "Operation failed");
      } finally {
        setIsLoading(false);
        handleLoading(false)
      }
    },
  });

  useEffect(() => {
    if (selectedRow) {
      formik.setValues({
        first_name: selectedRow?.userId?.first_name || "",
        last_name: selectedRow?.userId?.last_name || "",
        phone_number: selectedRow?.userId?.phone_number || "",
        email: selectedRow?.userId?.email || "",
        address: selectedRow?.userId?.address || "",
        petinfo: [
          {
            petName: selectedRow?.petName || "",
            petType: selectedRow?.petType?._id || "",
            breed: selectedRow?.breed?._id || "",
            dob: selectedRow?.dob || "",
            gender: selectedRow?.gender || "",
            weight: selectedRow?.weight || "",
            activity_level: selectedRow?.activity_level || "",
            day_Habits: selectedRow?.day_Habits || "",
            personality: selectedRow?.personality || "",
            health_issues: selectedRow?.health_issues || "",
            special_care: selectedRow?.special_care || "",
            microchip_number: selectedRow?.microchip_number || "",
            warning: selectedRow?.warning || "",
            dietary_requirements: selectedRow?.dietary_requirements || "",
            life_usage: selectedRow?.life_usage || "",
            image: null,
            document: null,
            existingImage: selectedRow?.image || null,
            existingDocument: selectedRow?.document || null,
          },
        ],
      });
      setIdForBreed(selectedRow?.petType?._id || "");
    }
  }, [selectedRow]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      handleLoading(true)
      await PetProfileApi.deletePet(deleteModal._id);
      toast.success("Pet deleted successfully");
      getAllPets();
      setDeleteModal(null);
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(err.response?.data?.message || "Failed to delete pet");
    } finally {
      setIsLoading(false);
      handleLoading(false)
    }
  };

  const handleAddPet = () => {
    formik.setFieldValue("petinfo", [
      ...formik.values.petinfo,
      {
        petName: "",
        petType: "",
        breed: "",
        dob: "",
        gender: "",
        weight: "",
        activity_level: "",
        day_Habits: "",
        personality: "",
        health_issues: "",
        special_care: "",
        microchip_number: "",
        warning: "",
        dietary_requirements: "",
        life_usage: "",
        image: null,
        document: null,
        existingImage: null,
        existingDocument: null,
      },
    ]);
  };

  const handleRemovePet = (index) => {
    const petinfo = [...formik.values.petinfo];
    petinfo.splice(index, 1);
    formik.setFieldValue("petinfo", petinfo);
  };

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const petinfo = [...formik.values.petinfo];
      petinfo[index] = {
        ...petinfo[index],
        image: file,
        existingImage: null
      };
      formik.setFieldValue("petinfo", petinfo);
    }
  };

  const handleDocumentChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const petinfo = [...formik.values.petinfo];
      petinfo[index] = {
        ...petinfo[index],
        document: file,
        existingDocument: null
      };
      formik.setFieldValue("petinfo", petinfo);
    }
  };

  const removeImage = (index) => {
    const petinfo = [...formik.values.petinfo];
    petinfo[index] = {
      ...petinfo[index],
      image: null,
      existingImage: null
    };
    formik.setFieldValue("petinfo", petinfo);
  };

  const removeDocument = (index) => {
    const petinfo = [...formik.values.petinfo];
    petinfo[index] = {
      ...petinfo[index],
      document: null,
      existingDocument: null
    };
    formik.setFieldValue("petinfo", petinfo);
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedRow(null);
    formik.resetForm();
  };

  const petColumns = useMemo(() => [

    {
      headerName: "Client Name",
      field: "userId",
      cellRenderer: (params) => params?.data?.userId?.first_name || "N/A",
    },
    {
      headerName: "Email Address",
      field: "email",
      cellRenderer: (params) => params?.data?.userId?.email || "N/A",
    },
    {
      headerName: "Contact Number",
      field: "phone_number",
      cellRenderer: (params) => params?.data?.userId?.phone_number || "N/A",
    },
    {
      headerName: "Address",
      field: "address",
      cellRenderer: (params) => params?.data?.userId?.address || "N/A",
    },
    {
      headerName: "Pets Name",
      field: "petName",
    },
    {
      headerName: "Pet Type",
      field: "petType",
      cellRenderer: (params) => `${params?.data?.petType?.name || "N/A"}`,
    },
    {
      headerName: "Pet Breed",
      field: "breed",
      cellRenderer: (params) => `${params?.data?.breed?.name || "N/A"}`,
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
  ], []);

  return (
    <>
      <div className="p-5">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold text-primary">Pets</h2>
          </div>

          <Table2
            column={petColumns}
            internalRowData={allUsers}
            searchLabel={"Pets"}
            sheetName={"pet"}
            setModalOpen={setOpen}
            isAdd={true}
          />
        </div>

        {open && (
          <SidebarField
            title={selectedRow ? "Update Customer" : "Add New Customer"}
            handleClose={handleModalClose}
            button1={
              <Button
                onClick={formik.handleSubmit}
                text={selectedRow ? "Update" : "Save"}
                type="submit"
                disabled={isLoading}
              />
            }
            button2={
              <Button
                variant="outline"
                onClick={handleModalClose}
                text="Cancel"
                disabled={isLoading}
              />
            }
          >
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="first_name"
                    label="First Name"
                    placeholder="Enter First Name"
                    isRequired
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={formik.touched.first_name && formik.errors.first_name}
                    disabled={!!selectedRow}
                  />
                  <InputField
                    name="last_name"
                    label="Last Name"
                    placeholder="Enter Last Name"
                    isRequired
                    value={formik.values.last_name}
                    error={formik.touched.last_name && formik.errors.last_name}
                    onChange={formik.handleChange}
                    disabled={!!selectedRow}
                  />
                  <InputField
                    name="phone_number"
                    label="Contact Number"
                    placeholder="Enter Phone Number"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    error={formik.touched.phone_number && formik.errors.phone_number}
                    disabled={!!selectedRow}
                  // isRequired
                  />
                  <InputField
                    name="email"
                    label="Email Address"
                    placeholder="Enter Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && formik.errors.email}
                    isRequired
                    disabled={!!selectedRow}
                  />
                </div>
                <InputField
                  name="address"
                  label="Address"
                  placeholder="Enter Full Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && formik.errors.address}
                  // isRequired
                  disabled={!!selectedRow}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Pet Information
                </h3>
                {formik.values.petinfo.map((pet, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 relative bg-gray-50"
                  >
                    {formik.values.petinfo.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePet(index)}
                        className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                        disabled={isLoading}
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                    <h4 className="text-lg font-medium mb-4 text-gray-700">
                      Pet {index + 1}
                    </h4>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Image {pet.image || pet.existingImage ? (
                          <span className="text-green-500 ml-2">✓ Uploaded</span>
                        ) : null}
                      </label>
                      {pet.image || pet.existingImage ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              pet.image ?
                                URL.createObjectURL(pet.image) :
                                pet.existingImage
                            }
                            alt="Pet preview"
                            className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-800"
                            disabled={isLoading}
                          >
                            <FaTimes size={18} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors bg-white">
                          <div className="flex flex-col items-center">
                            <FaUpload className="text-gray-400 mb-2 text-2xl" />
                            <span className="text-sm text-gray-600">
                              Click to upload image
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              jpeg|jpg|png|gif|tiff|bmp|webp (Max 1MB)
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, index)}
                            ref={el => fileInputRefs.current[index] = { ...fileInputRefs.current[index], image: el }}
                            key={`image-input-${index}`}
                          />
                        </label>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        name={`petinfo[${index}].petName`}
                        label="Pet Name"
                        placeholder="Enter pet name"
                        value={pet.petName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.petinfo?.[index]?.petName &&
                          formik.errors.petinfo?.[index]?.petName
                        }
                        isRequired
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].petType`}
                        label="Pet Type"
                        type="select"
                        options={petTypeData.map((pt) => ({
                          label: pt.name,
                          value: pt._id,
                        }))}
                        value={pet.petType}
                        onChange={(e) => {
                          setIdForBreed(e.target.value);
                          formik.handleChange(e);
                        }}
                        error={
                          formik.touched.petinfo?.[index]?.petType &&
                          formik.errors.petinfo?.[index]?.petType
                        }
                        isRequired
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].breed`}
                        label="Breed"
                        type="select"
                        options={getFilteredBreeds(pet.petType)}
                        value={pet.breed}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.petinfo?.[index]?.breed &&
                          formik.errors.petinfo?.[index]?.breed
                        }
                        isRequired
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].gender`}
                        label="Gender"
                        type="select"
                        options={[
                          { label: "Male", value: "Male" },
                          { label: "Female", value: "Female" },
                        ]}
                        value={pet.gender}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.petinfo?.[index]?.gender &&
                          formik.errors.petinfo?.[index]?.gender
                        }
                        isRequired
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].weight`}
                        label="Weight (kg)"
                        placeholder="Enter weight"
                        value={pet.weight}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.petinfo?.[index]?.weight &&
                          formik.errors.petinfo?.[index]?.weight
                        }
                        isRequired
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].dob`}
                        label="Date of Birth"
                        type="date"
                        value={pet.dob}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.petinfo?.[index]?.dob &&
                          formik.errors.petinfo?.[index]?.dob
                        }
                        isRequired
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].activity_level`}
                        label="Activity Level"
                        type="select"
                        placeholder={"Select Activity"}
                        options={[
                          { label: "Lazy", value: "Lazy" },
                          { label: "Fairly Active", value: "Fairly Active" },
                          { label: "Often Active", value: "Often Active" },
                        ]}
                        value={pet.activity_level}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.petinfo?.[index]?.activity_level &&
                          formik.errors.petinfo?.[index]?.activity_level
                        }
                        isRequired
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].day_Habits`}
                        label="Day Habits"
                        type="select"
                        options={[
                          { label: "At Home", value: "At Home" },
                          { label: "Outside", value: "Outside" },
                          { label: "Mix of Both", value: "Mix Of Both" },
                        ]}
                        value={pet.day_Habits}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.petinfo?.[index]?.day_Habits &&
                          formik.errors.petinfo?.[index]?.day_Habits
                        }
                        isRequired
                        disabled={isLoading}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <InputField
                        name={`petinfo[${index}].personality`}
                        label="Personality"
                        placeholder="Describe pet's personality"
                        value={pet.personality}
                        onChange={formik.handleChange}
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].health_issues`}
                        label="Health Issues"
                        placeholder="Any health concerns"
                        value={pet.health_issues}
                        onChange={formik.handleChange}
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].special_care`}
                        label="Special Care"
                        placeholder="Special care requirements"
                        value={pet.special_care}
                        onChange={formik.handleChange}
                        disabled={isLoading}
                      />

                      {/* Document Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Documents {pet.document || pet.existingDocument ? (
                            <span className="text-green-500 ml-2">✓ Uploaded</span>
                          ) : null}
                        </label>
                        {pet.document || pet.existingDocument ? (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-700">
                              {pet.document?.name || "Document uploaded"}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-600 hover:text-red-800"
                              disabled={isLoading}
                            >
                              <FaTimes size={18} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors bg-white">
                            <div className="flex flex-col items-center">
                              <FaUpload className="text-gray-400 mb-2 text-2xl" />
                              <span className="text-sm text-gray-600">
                                Click to upload document
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                pdf|doc|docx|txt (Max 1MB)
                              </span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleDocumentChange(e, index)}
                              disabled={isLoading}
                            />
                          </label>
                        )}
                      </div>

                      <InputField
                        name={`petinfo[${index}].microchip_number`}
                        label="Microchip Number"
                        placeholder="Enter microchip number"
                        value={pet.microchip_number}
                        onChange={formik.handleChange}
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].warning`}
                        label="Warning"
                        placeholder="Any warnings about the pet"
                        value={pet.warning}
                        onChange={formik.handleChange}
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].dietary_requirements`}
                        label="Dietary Requirements"
                        placeholder="Special dietary needs"
                        value={pet.dietary_requirements}
                        onChange={formik.handleChange}
                        disabled={isLoading}
                      />
                      <InputField
                        name={`petinfo[${index}].life_usage`}
                        label="Life Usage"
                        placeholder="Pet's daily routine"
                        value={pet.life_usage}
                        onChange={formik.handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddPet}
                  className="mt-4 flex items-center cursor-pointer justify-center gap-2 px-4 py-2 text-white bg-primary rounded-lg transition-colors w-full md:w-auto"
                  disabled={isLoading}
                >
                  <FaPlus /> Add Another Pet
                </button>
              </div>
            </form>
          </SidebarField>
        )}
      </div>
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default Pets;