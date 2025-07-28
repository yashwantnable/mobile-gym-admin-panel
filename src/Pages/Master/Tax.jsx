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

const taxValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Tax name is required")
    .min(3, "Name is too short"),

  rate: Yup.number()
    .required("Tax rate is required")
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100%"),
  country: Yup.string().required("country is required"),
  is_active: Yup.boolean(),
  description: Yup.string().max(200, "Description too long"),
});

const TaxMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [countryId, setCountryId] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [taxData, setTaxData] = useState([]);
  const { handleLoading } = useLoading();

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    console.log("selectedCountryId:", selectedCountryId);

    setCountryId(e.target.value);
    formik.setFieldValue("country", e.target.value);
  };

  const handleCheckboxChange=(e)=>{
    console.log("check box:",e.target.value);
    formik.setFieldValue("is_active",e.target.value);
    
  }
  const countryOptions = countryData.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const getAllTaxes = async () => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllTax();
      setTaxData(res?.data?.data || []);
      console.log("get all tax master:", res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching taxes:", err);
      toast.error("Failed to fetch taxes");
    } finally {
      handleLoading(false);
    }
  };
  // console.log("taxData:",taxData);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteTax(deleteModal._id);
      toast.success("Tax deleted successfully");
      getAllTaxes();
      setDeleteModal(null);
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(err.response?.data?.message || "Failed to delete tax");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        minWidth: 160,
      },
      {
        headerName: "Rate (%)",
        field: "rate",
        minWidth: 120,
        cellRenderer: (params) => params.data.rate?.$numberDecimal || "N/A",
      },
      {
        headerName: "Country",
        field: "country",
        minWidth: 180,
        cellRenderer: (params) => params.data.country?.name || "N/A",
      },
      {
        headerName: "Active Status",
        field: "is_active",
        minWidth: 180,
        cellRenderer: (params) =>
          params.data.is_active === true
            ? "Active"
            : params.data.is_active === false
            ? "Inactive"
            : "N/A",
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
      name: selectedRow?.name || "",
      rate: selectedRow?.rate?.$numberDecimal || "",
      country: selectedRow?.country?._id || "",
      is_active: selectedRow?.is_active || false,
    },
    validationSchema: taxValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("form value :", values);

      try {
        const res = selectedRow?._id
          ? await MasterApi.updateTax(selectedRow._id, values)
          : await MasterApi.createTax(values);

        toast.success(res?.data?.message || "Tax saved successfully");
        // getAllTaxes();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Something went wrong while saving tax"
        );
        console.error("Tax Error:", err);
      }
      getAllTaxes();
      setOpen(false);
      setSelectedRow(null);
      formik.resetForm();
    },
  });

  // useEffect(() => {
  //     if (selectedRow) {
  //         formik.setValues({
  //             name: selectedRow.name || "",
  //             rate: selectedRow.rate?.$numberDecimal || "",
  //             Country: selectedRow.Country?._id || "",
  //         });
  //     }
  // }, [selectedRow]);

  useEffect(() => {
    getAllTaxes();
    handleCountry();
  }, []);

  return (
    <>
      <div className="p-5">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold text-primary">Tax Master</h2>
          </div>

          <Table2
            column={columns}
            internalRowData={taxData}
            searchLabel={"Tax"}
            sheetName={"Tax Master"}
            setModalOpen={setOpen}
            isAdd={true}
            setSelectedRow={setSelectedRow}
          />
        </div>

        {open && (
          <SidebarField
            title={selectedRow ? "Edit Tax" : "Add New Tax"}
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
              <div className="space-y-4">
                <InputField
                  name="name"
                  label="Name"
                  placeholder="Enter tax name (e.g., GST)"
                  isRequired
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />

                <InputField
                  name="rate"
                  label="Rate"
                  placeholder="Enter tax rate (e.g., 18)"
                  type="number"
                  step="0.01"
                  isRequired
                  value={formik.values.rate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.rate && formik.errors.rate}
                />
                <InputField
                  name="country"
                  label="country"
                  type="select"
                  options={countryOptions}
                  isRequired
                  value={formik.values.country}
                  error={formik.touched.country && formik.errors.country}
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name="is_active"
                  label="Active Status"
                  type="checkbox"
                  checked={formik.values.is_active}
                  error={formik.touched.is_active && formik.errors.is_active}
                  onChange={handleCheckboxChange}
                  onBlur={formik.handleBlur}
                />
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

export default TaxMaster;
