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

const lateFeeValidationSchema = Yup.object().shape({
  extraprice: Yup.string().required("Late Fee is required"),
});

const LateFeesMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lateFeeData, setLateFee] = useState([]);
  const { handleLoading } = useLoading();

  const getAllLateFee = async () => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllLateFee();
      setLateFee(res?.data?.data || []);
      console.log("get all tax master:", res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching taxes:", err);
      toast.error("Failed to fetch taxes");
    } finally {
      handleLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteTax(deleteModal._id);
      toast.success("Late Fee deleted successfully");
      getAllLateFee();
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
        headerName: "Late fee",
        field: "extraprice",
        minWidth: 160,
      },
      {
        headerName: "Status",
        field: "is_default",
        minWidth: 120,
        cellRenderer: (params) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              params.data.is_default
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {params.data.is_default ? "Active" : "Inactive"}
          </span>
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
                setSelectedRow(params.data);
              }}
            >
              <FaRegEdit />
            </button>
            {/* <button
              className="px-4 rounded cursor-pointer text-red-500"
              onClick={() => {
                setOpen(false);
                setDeleteModal(params.data);
              }}
            >
              <MdOutlineDeleteOutline />
            </button> */}
          </div>
        ),
      },
    ],
    []
  );

  const formik = useFormik({
    initialValues: {
      extraprice: selectedRow?.extraprice || "",
      is_default: selectedRow?.is_default || "",
    },
    validationSchema: lateFeeValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("form value :", values);

      try {
        const res = selectedRow?._id
          ? await MasterApi.updateLateFee(selectedRow._id, values)
          : await MasterApi.createLateFee(values);

        toast.success(res?.data?.message || "Late Fee saved successfully");
        getAllLateFee();
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Something went wrong while saving tax"
        );
        console.error("Late Fee Error:", err);
      }

      setOpen(false);
      setSelectedRow(null);
      formik.resetForm();
    },
  });

  console.log("selected order", selectedRow);

  useEffect(() => {
    getAllLateFee();
  }, []);

  return (
    <>
      <div className="p-5">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold text-primary">Late Fee Master</h2>
          </div>

          <Table2
            column={columns}
            internalRowData={lateFeeData}
            searchLabel={"Late Fee"}
            sheetName={"Late Fee Master"}
            setModalOpen={setOpen}
            isAdd={true}
            setSelectedRow={setSelectedRow}
          />
        </div>

        {open && (
          <SidebarField
            title={selectedRow ? "Edit Late fee" : "Add New Late fee"}
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
                  name="extraprice"
                  label="Name"
                  placeholder="Enter Late fee amount"
                  isRequired
                  value={formik.values.extraprice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.extraprice && formik.errors.extraprice}
                />

                <InputField
                  name="is_default"
                  label="Active Late Fee"
                  type="checkbox"
                  checked={formik.values.is_default}
                  error={formik.touched.is_default && formik.errors.is_default}
                  onChange={formik.handleChange}
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

export default LateFeesMaster;
