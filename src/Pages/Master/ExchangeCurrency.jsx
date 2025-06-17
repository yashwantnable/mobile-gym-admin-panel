import React, { useEffect, useMemo, useState } from "react";
import { Table2 } from "../../Components/Table/Table2";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import DeleteModal from "../../Components/DeleteModal";
import SidebarField from "../../Components/SideBarField";
import Button from "../../Components/Button";
import { FieldArray, useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../Components/InputField";
import { MasterApi } from "../../Api/Master.api";
import { toast } from "react-toastify";
// import { currencyRowData } from "../../dummydata";
import { useLoading } from "../../Components/loader/LoaderContext";

const ExchangeCurrency = ({ currencyData }) => {
  const [allExchanfeCurrency, setAllExchanfeCurrency] = useState();
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCurrencyName, setIsCurrencyName] = useState(null);
  const { handleLoading } = useLoading();
  console.log("currencyData:", currencyData);
  console.log("isCurrencyName:", isCurrencyName);
  console.log("selectedRow:", selectedRow);

  const exchangeColumns = useMemo(
    () => [
      {
        headerName: "Currency Code",
        field: "baseCurrencyId.currencyCode",
        minWidth: 120,
      },
      {
        headerName: "Base Currency",
        field: "baseCurrencyId.currencyName",
        minWidth: 160,
      },
      {
        headerName: "Base Currency Country",
        field: "country.name",
        minWidth: 160,
      },
      {
        headerName: "Currency Symbol",
        field: "baseCurrencyId.currencySymbol",
        minWidth: 100,
      },
      {
        headerName: "Exchange Currencies",
        field: "exchangeRateDetails",
        minWidth: 250,
        cellRenderer: (params) => (
          <div className="whitespace-pre-wrap">
            {params.value
              ?.map((item) => {
                const code = item.exchangeCurrencyId?.currencyCode;
                const symbol = item.exchangeCurrencyId?.currencySymbol;
                const rate = item.exchangeRate;
                return `${code} ( ${rate} ${symbol})`;
              })
              .join(", ")}
          </div>
        ),
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
                setOpen(false);
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

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteExchangeCurrency(deleteModal._id);
      toast.success("Currency deleted successfully");
      getAllExchangeCurrencies();
      setDeleteModal(null);
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(err.response?.data?.message || "Failed to delete currency");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllExchangeCurrencies = async () => {
    handleLoading(true);
    try {
      const res = await MasterApi.getAllExchangeCurrency();
      setAllExchanfeCurrency(res.data.data || []);
      console.log("all exchange currency:", res.data.data);
    } catch (err) {
      console.error("Error fetching exchange currencies:", err);
      toast.error("Failed to fetch exchange currencies");
    }
    handleLoading(false);
  };
  console.log("currencyData:", currencyData);
  const countryOptions =
  currencyData?.map((item) => ({
    value: item.country?._id,
    label: item.country?.name,
  })) || [];


  const handleCheckboxChange = (e) => {
    formik.setFieldValue("status", e.target.checked ? "Active" : "Inactive");
  };

  const handleBaseCurrencyChange = (e) => {
    const selectedCountryId = e.target.value;
    console.log("selectedCountry:", e.target.value);
    console.log("currencyData:", currencyData);
    // formik.setFieldValue("baseCurrencyId.country", selectedCountry);
    const found = currencyData.find((cur) => cur.country._id === selectedCountryId);
    console.log("found:", found);
    if (found) {
      formik.setFieldValue("baseCurrencyId", {
        currencyCode: found.currencyCode,
        currencyName: found.currencyName,
        currencySymbol: found.currencySymbol,
      });
      formik.setFieldValue("countryId", found.country._id);
    }
    
  };

  const formik = useFormik({
    initialValues: {
      baseCurrencyId: {
        currencyCode: selectedRow?.baseCurrencyId?.currencyCode || "",
        currencyName: selectedRow?.baseCurrencyId?.currencyName || "",
      },
      countryId: selectedRow?.country?._id || "",
    
      exchangeRateDetails: selectedRow?.exchangeRateDetails?.length > 0
        ? selectedRow.exchangeRateDetails.map(data => ({
            currencyCode: data.exchangeCurrencyId.currencyCode || "",
            exchangeRate: data.exchangeRate || "",
          }))
        : [
            {
              currencyCode: "",
              exchangeRate: "",
            },
          ],
    },    
    // validationSchema: currencyExchangeValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          baseCurrencyCode: values.baseCurrencyId.currencyCode,
          countryId: values.countryId,
          exchangeRateDetails: values.exchangeRateDetails.map((item) => ({
            currencyCode: item.currencyCode,
            exchangeRate: item.exchangeRate,
          })),  
        };
        console.log("Payload Exchange Currency:", payload);

        const res = selectedRow
          ? await MasterApi.createExchangeCurrency(payload)
          : await MasterApi.createExchangeCurrency(payload);

        toast.success(res?.data?.message || "Currency exchange saved successfully");
        getAllExchangeCurrencies();
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Something went wrong while saving currency exchange"
        );
        console.error("Currency Exchange Error:", err);
      }

      setOpen(false);
      setSelectedRow(null);
      formik.resetForm();
    },
  });

  useEffect(() => {
    getAllExchangeCurrencies();
  }, []);
  return (
    <>
      <div className="mt-10">
        {/* currency Exchange master */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold text-primary">
              Currency Exchange Master
            </h2>
          </div>
          <Table2
            column={exchangeColumns}
            internalRowData={allExchanfeCurrency}
            searchLabel={"CurrencyExchange"}
            sheetName={"Currency Exchange Master"}
            setModalOpen={setOpen}
            isAdd={true}
            setSelectedRow={setSelectedRow}
          />
        </div>
      </div>
      {open && (
        <SidebarField
          title={selectedRow ? "Edit Exchange Rate" : "Add Exchange Rate"}
          handleClose={() => {
            setOpen(false);
            formik.resetForm();
            setSelectedRow(null);
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
            {/* Base Currency Section */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="countryId"
                label="Country"
                type="select"
                options={countryOptions}
                value={formik.values.countryId}
                onChange={handleBaseCurrencyChange}
                error={
                  formik.touched?.countryId &&
                  formik.errors?.countryId
                }
              />

              <InputField
                name="baseCurrencyId.currencyName"
                label="Currency Name"
                value={
                  isCurrencyName || formik.values.baseCurrencyId.currencyName
                }
                readOnly
              />
              <InputField
                name="baseCurrencyId.currencyCode"
                label="Currency Code"
                value={formik.values.baseCurrencyId.currencyCode}
                readOnly
              />
            </div>

            {/* Exchange Rate Details */}
            <div className="border-t pt-4">
              <label className="font-semibold">Exchange Rates</label>
              <div className="space-y-4">
                {formik.values.exchangeRateDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center"
                  >
                    <InputField
                      name={`exchangeRateDetails[${index}].currencyCode`}
                      className='w-[200px]'
                      type="select"
                      label="Exchange Currency"
                      options={currencyData.map((c) => ({
                        label: `${c.currencyCode} (${c.currencyName})`,
                        value: c.currencyCode,
                      }))}
                      value={detail.currencyCode}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.exchangeRateDetails?.[index]
                          ?.currencyCode &&
                        formik.errors.exchangeRateDetails?.[index]?.currencyCode
                      }
                    />

                    <InputField
                      name={`exchangeRateDetails[${index}].exchangeRate`}
                      label="Exchange Rate"
                      placeholder="e.g., 3.67"
                      type="number"
                      step="any"
                      value={detail.exchangeRate}
                      onChange={formik.handleChange}
                    />

                    <button
                      type="button"
                      className="text-red-500 w-10"
                      onClick={() => {
                        const newList =
                          formik.values.exchangeRateDetails.filter(
                            (_, i) => i !== index
                          );
                        formik.setFieldValue("exchangeRateDetails", newList);
                      }}
                    >
                       <MdOutlineDeleteOutline size={18}/>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newList = [
                      ...formik.values.exchangeRateDetails,
                      {
                        currencyCode: "",
                        exchangeRate: "",
                      },
                    ];
                    formik.setFieldValue("exchangeRateDetails", newList);
                  }}
                  className="text-teal-600 font-semibold"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* <InputField
              name="status"
              label="Status"
              type="checkbox"
              checked={formik.values.status === "Active"}
              onChange={handleCheckboxChange}
            /> */}
          </form>
        </SidebarField>
      )}
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        handleDelete={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default ExchangeCurrency;
