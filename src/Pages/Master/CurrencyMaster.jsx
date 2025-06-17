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
// import { currencyRowData } from "../../dummydata";
import { useLoading } from "../../Components/loader/LoaderContext";
import ExchangeCurrency from "./ExchangeCurrency";

const currencyValidationSchema = Yup.object().shape({
  currencyCode: Yup.string()
    .required("Currency code is required")
    .matches(/^[A-Z]{3}$/, "Must be 3 uppercase letters (e.g. USD)"),

  currencyName: Yup.string()
    .required("Currency name is required")
    .min(3, "Name is too short"),

    currencySymbol: Yup.string()
    .required("Symbol is required")
    .max(5, "Symbol is too long"),

    status: Yup.string(),
  country: Yup.string().required("Country is required"),

  // exchange_rate: Yup.number()
  //   .required("Exchange rate is required")
  //   .positive("Exchange rate must be positive"),

  // is_base_currency: Yup.boolean().required("Base currency flag is required"),

  
});

const CurrencyMaster = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const { handleLoading } = useLoading()
  const [currencyData, setCurrencyData] = useState();

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const AllCurrencies = async () => {
    handleLoading(true);
    try {
      const res = await MasterApi.getAllCurrencies();
      setCurrencyData(res.data.data || []);
      console.log(res.data.data);
      
    } catch (err) {
      console.error("Error fetching currencies:", err);
      toast.error("Failed to fetch currencies");
    }
      handleLoading(false);
    
  };
  

  const countryOptions = countryData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteCurrency(deleteModal._id);
      toast.success("Currency deleted successfully");
      // AllCurrencies();
      setDeleteModal(null);
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(err.response?.data?.message || "Failed to delete currency");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCountryChange=(e)=>{
     formik.setFieldValue("country", e.target.value)
  }
  
  const columns = useMemo(
    () => [

      {
        headerName: "Currency Code",
        field: "currencyCode",
        minWidth: 120,
      },

      {
        headerName: "Currency Name",
        field: "currencyName",
        minWidth: 160,
      },
      {
        headerName: "Country Name",
        field: "country.name",
        minWidth: 160,
      },
      {
        headerName: "Currency Symbol",
        field: "currencySymbol",
        minWidth: 100,
      },
      // {
      //   headerName: "Base Currency",
      //   field: "isBaseCurrency",
      //   minWidth: 100,
      // },
      {
        headerName: "status",
        field: "status",
        minWidth: 100,
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
                setSelectedRow(params?.data);
              }}
            >
              <FaRegEdit />
            </button>
            <button
              className="px-4 rounded cursor-pointer text-red-500"
              onClick={() => {
                setOpen(false)
                setDeleteModal(params?.data);
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
      currencyCode: "",
      currencyName: "",
      country:"",
      currencySymbol: "",
      status:"Inactive"
    },
    validationSchema: currencyValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("values:",values);
      
      try {
        const res = selectedRow
          ? await MasterApi.updateCurrency(selectedRow._id, values)
          : await MasterApi.createCurrancy(values);

        toast.success(
          res?.data?.message || "Currency saved successfully"
        );
        // AllCurrencies();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Something went wrong while saving currency"
        );
        console.error("Currency Error:", err);
      }

      setOpen(false);
      setSelectedRow(null);
      formik.resetForm();
    },
  });

  const handleCheckboxChange=(e)=>{
    console.log("check box:",e.target.value===false?"Inactive":"Active");
    formik.setFieldValue("status",e.target.value===false?"Inactive":"Active");
    
  }

  useEffect(() => {
    if (selectedRow) {
      formik.setValues({
        currencyCode: selectedRow.currencyCode || "",
        currencyName: selectedRow.currencyName || "",
        currencySymbol: selectedRow.currencySymbol || "",
        country: selectedRow.country?._id || "",
        // exchange_rate: selectedRow.exchange_rate || "",
        // is_base_currency: selectedRow.is_base_currency || false,
        status: selectedRow.status || "Inactive",
      });
    }
  }, [selectedRow]);

  useEffect(() => {
    // handleCountry();
    // AllCurrencies();
  }, []);

  return (
    <>
      <div className="p-5">
        {/* currency master */}
        <div className="mb-4 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold text-primary">Currency Master</h2>
          </div>

          <Table2
            column={columns}
            internalRowData={currencyData} 
            searchLabel={"Currency"}
            sheetName={"Currency Master"}
            setModalOpen={setOpen}
            isAdd={true}
            setSelectedRow={setSelectedRow}
          />
        </div>

        <ExchangeCurrency currencyData={currencyData}/>

        {open && (
          <SidebarField
            title={selectedRow ? "Edit Currency" : "Add New Currency"}
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
                  name="country"
                  label="Country"
                  type="select"
                  options={countryOptions}
                  isRequired
                  value={formik.values.country}
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.country && formik.errors.country}
                />


                <InputField
                  name="currencyCode"
                  label="Currency Code"
                  placeholder="Enter currency code (e.g., USD)"
                  isRequired
                  value={formik.values.currencyCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.currencyCode && formik.errors.currencyCode
                  }
                />

                <InputField
                  name="currencyName"
                  label="Currency Name"
                  placeholder="Enter currency name (e.g., US Dollar)"
                  isRequired
                  value={formik.values.currencyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.currencyName && formik.errors.currencyName
                  }
                />

                <InputField
                  name="currencySymbol"
                  label="Currency Symbol"
                  placeholder="Enter currency symbol (e.g., $)"
                  isRequired
                  value={formik.values.currencySymbol}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.currencySymbol &&
                    formik.errors.currencySymbol
                  }
                />
            
                <InputField
                  name="status"
                  label="status"
                  type="checkbox"
                  checked={formik.values.status === "Active"}
                  error={formik.touched.status && formik.errors.status}
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

export default CurrencyMaster;