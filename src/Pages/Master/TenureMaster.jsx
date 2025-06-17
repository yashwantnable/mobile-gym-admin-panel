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

const tenureValidationSchema = Yup.object().shape({
  name: Yup.string().required("Tenure name is required"),
  duration: Yup.number().required("Duration is required").min(1, "Must be at least 1 day"),
  description: Yup.string().max(200),
  is_active: Yup.boolean(),
});

const TenureMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tenureData, setTenureData] = useState([]);
  const { handleLoading } = useLoading();

  const getAllTenures = async () => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllTenure();
      setTenureData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch tenures");
    } finally {
      handleLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteTenure(deleteModal._id);
      toast.success("Tenure deleted");
      getAllTenures();
      setDeleteModal(null);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(() => [
    { headerName: "Name", field: "name", minWidth: 160 },
    { headerName: "Duration (Days)", field: "duration", minWidth: 160 },
    { headerName: "Active Status", field: "is_active", minWidth: 140, cellRenderer: (params) => params.data.is_active ? "Active" : "Inactive" },
    {
      headerName: "Actions", field: "actions", minWidth: 150,
      cellRenderer: (params) => (
        <div className="text-xl flex items-center">
          <button onClick={() => { setOpen(true); setSelectedRow(params.data); }}><FaRegEdit /></button>
          <button className="text-red-500 px-4" onClick={() => { setOpen(false); setDeleteModal(params.data); }}><MdOutlineDeleteOutline /></button>
        </div>
      )
    }
  ], []);

  const formik = useFormik({
    initialValues: {
      name: selectedRow?.name || "",
      duration: selectedRow?.duration || "",
      description: selectedRow?.description || "",
      is_active: selectedRow?.is_active || false,
    },
    enableReinitialize: true,
    validationSchema: tenureValidationSchema,
    onSubmit: async (values) => {
      try {
        const res = selectedRow?._id
          ? await MasterApi.updateTenure(selectedRow._id, values)
          : await MasterApi.createTenure(values);
        toast.success(res?.data?.message || "Saved");
        setOpen(false);
        setSelectedRow(null);
        formik.resetForm();
        getAllTenures();
      } catch (err) {
        toast.error("Save failed");
      }
    },
  });

  useEffect(() => {
    getAllTenures();
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-bold text-primary">Tenure Master</h2>
        </div>

        <Table2
          column={columns}
          internalRowData={tenureData}
          searchLabel={"Tenure"}
          sheetName={"Tenure Master"}
          setModalOpen={setOpen}
          isAdd={true}
          setSelectedRow={setSelectedRow}
        />

        {open && (
          <SidebarField
            title={selectedRow ? "Edit Tenure" : "Add Tenure"}
            handleClose={() => {
              setOpen(false);
              formik.resetForm();
              setSelectedRow(null);
            }}
            button1={<Button onClick={formik.handleSubmit} text={selectedRow ? "Update" : "Save"} />}
            button2={<Button variant="outline" onClick={() => { setOpen(false); formik.resetForm(); }} text="Cancel" />}
          >
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <InputField name="name" label="Tenure Name" placeholder="e.g. Monthly" isRequired
                value={formik.values.name} onChange={formik.handleChange} error={formik.touched.name && formik.errors.name} />
              <InputField name="duration" label="Duration (Days)" placeholder="e.g. 30" type="number" isRequired
                value={formik.values.duration} onChange={formik.handleChange} error={formik.touched.duration && formik.errors.duration} />
              <InputField name="description" label="Description" placeholder="Optional"
                value={formik.values.description} onChange={formik.handleChange} error={formik.touched.description && formik.errors.description} />
              <InputField name="is_active" label="Active" type="checkbox"
                checked={formik.values.is_active} onChange={formik.handleChange} />
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

export default TenureMaster;
