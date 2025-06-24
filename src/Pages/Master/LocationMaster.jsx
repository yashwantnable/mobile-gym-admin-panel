import React, { useEffect, useMemo, useState } from "react";
import { Table2 } from "../../Components/Table/Table2";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import DeleteModal from "../../Components/DeleteModal";
import SidebarField from "../../Components/SideBarField";
import Button from "../../Components/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../Components/InputField";
import { MasterApi } from "../../Api/Master.api";
import { toast } from "react-toastify";
import { useLoading } from "../../Components/loader/LoaderContext";

const locationValidationSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  pin: Yup.string().required("Pin code is required"),
  streetName: Yup.string().required("Street name is required"),
  pinAddress: Yup.string().required("Pin address is required"),
});

const LocationMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [countryId, setCountryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleLoading } = useLoading();

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };


  const fetchCityIfEditing = async (id) => {
    if (id) {
      try {
        const res = await MasterApi.city(id);
        setCityData(res.data?.data || []);
      } catch (err) {
        console.log("Error fetching city:", err);
      }
    }
  };

 useEffect(() => {
  fetchCityIfEditing(selectedRow?.country?._id);
}, [selectedRow?.country?._id]);

   
  const handleCountryChange = async (e) => {
     const selectedCountryId = e.target.value;
     setCountryId(selectedCountryId);
     formik.setFieldValue("country", selectedCountryId);
    getCityById(selectedCountryId)
    //  if (selectedCountryId) {
    //    try {
    //      const res = await MasterApi.city(selectedCountryId);
    //      setCityData(res.data?.data);
    //    } catch (err) {
    //      console.log(err);
    //    }
    //  }
   };
 const getCityById=async(selectedCountryId)=>{
    if (selectedCountryId) {
       try {
         const res = await MasterApi.city(selectedCountryId);
         setCityData(res.data?.data);
       } catch (err) {
         console.log(err);
       }
     }
 }
   

  const countryOptions = countryData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const cityOptions = cityData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const getAllLocations = async () => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllLocation();
      setLocationData(res?.data?.data?.allLocationMasters || []);
    //   console.log(res?.data?.data?.allLocationMasters);
      
    } catch (err) {
      console.error("Error fetching locations:", err);
      toast.error("Failed to fetch locations");
    } finally {
      handleLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteLocation(deleteModal._id);
      toast.success("Location deleted successfully");
      getAllLocations();
      setDeleteModal(null);
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(err.response?.data?.message || "Failed to delete location");
    } finally {
      setIsLoading(false);
    }
  };
 console.log("selectedRow:",selectedRow);
 
  const columns = useMemo(
    () => [
      {
        headerName: "Country",
        field: "country",
        minWidth: 160,
        cellRenderer: (params) => params.data.country?.name || "N/A",
      },
      {
        headerName: "City",
        field: "city",
        minWidth: 160,
        cellRenderer: (params) => params.data.city?.name || "N/A",
      },
      {
        headerName: "Pin",
        field: "pin",
        minWidth: 100,
      },
      {
        headerName: "Street Name",
        field: "streetName",
        minWidth: 180,
      },
      {
        headerName: "Pin Address",
        field: "pinAddress",
        minWidth: 200,
      },
      {
        headerName: "Actions",
        field: "actions",
        minWidth: 150,
        cellRenderer: (params) => (
          <div className="text-xl flex items-center py-2">
            <button
              className="rounded cursor-pointer"
              onClick={() => {
                setOpen(true);
                setSelectedRow(params.data);
              }}
            >
              <FaRegEdit />
            </button>
            <button
              className="px-4 rounded cursor-pointer text-red-500"
              onClick={() => {
                setOpen(false);
                setDeleteModal(params.data);
              }}
            >
              <MdOutlineDeleteOutline />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const formik = useFormik({
    initialValues: {
      country:selectedRow?.Country?._id || selectedRow?.country || "", 
    city: selectedRow?.city?._id || selectedRow?.city || "",
      pin: selectedRow?.pin || "",
      streetName: selectedRow?.streetName || "",
      pinAddress: selectedRow?.pinAddress || "",
    },
    validationSchema: locationValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const res = selectedRow?._id
          ? await MasterApi.updateLocation(selectedRow._id, values)
          : await MasterApi.createLocation(values);

        toast.success(res?.data?.message || "Location saved successfully");
        getAllLocations();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Something went wrong while saving location"
        );
        console.error("Location Error:", err);
      }
      setOpen(false);
      setSelectedRow(null);
      formik.resetForm();
    },
  });

 useEffect(() => {
  const countryId = selectedRow?.country?._id || selectedRow?.country;

  if (countryId) {
    getCityById(countryId);
    console.log("Fetched cities for countryId:", countryId);
  }
}, [selectedRow]);


  useEffect(() => {
    getAllLocations();
    handleCountry();
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-bold text-primary">Location Master</h2>
        </div>

        <Table2
          column={columns}
          internalRowData={locationData}
          searchLabel="Location"
          sheetName="Location Master"
          setModalOpen={setOpen}
          isAdd={true}
          setSelectedRow={setSelectedRow}
        />

        {open && (
          <SidebarField
            title={selectedRow ? "Edit Location" : "Add New Location"}
            handleClose={() => {
              setOpen(false);
              setSelectedRow(null);
              formik.resetForm();
            }}
            button1={
              <Button
                onClick={formik.handleSubmit}
                text={selectedRow ? "Update" : "Save"}
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              />
            }
            button2={
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  formik.resetForm();
                }}
                text="Cancel"
              />
            }
          >
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* {JSON.stringify(formik.values.country)} */}

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
                {/* {JSON.stringify(formik.values.city)} */}
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

              <InputField
                name="pin"
                label="Pin Code"
                placeholder="Enter pin code"
                value={formik.values.pin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pin && formik.errors.pin}
              />

              <InputField
                name="streetName"
                label="Street Name"
                placeholder="Enter street name"
                value={formik.values.streetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.streetName && formik.errors.streetName}
              />

              <InputField
                name="pinAddress"
                label="Pin Address"
                placeholder="Enter pin address"
                value={formik.values.pinAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pinAddress && formik.errors.pinAddress}
              />
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

export default LocationMaster;
