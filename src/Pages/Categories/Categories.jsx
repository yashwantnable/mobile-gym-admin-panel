import React, { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import DeleteModal from '../../Components/DeleteModal';
import { Table2 } from '../../Components/Table/Table2';
import { useFormik } from 'formik';
import { CategoryApi } from '../../Api/Category.Api';
import { toast } from 'react-toastify';

const Categories = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [caregoryData, setCaregoryData] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    console.log("delete:",deleteModal?._id);
    


    const handleDelete=async()=>{
        try{
            const res= await CategoryApi.deleteCategory(deleteModal?._id);
            toast.success("Category deleted successfully")
            setDeleteModal(null)
            getAllCategories();
        }catch(err){
            toast.error("error:",err)
        }
    }

    const getAllCategories=async()=>{
        try{

            const categories= await CategoryApi.getAllCategory();
            console.log("categories:",categories?.data?.data);
            setCaregoryData(categories?.data?.data);
        }catch(err){
            console.error(err)
        }
    }



    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            formik.setFieldValue("image", file);
        }
    };

    const handleCancelImage = () => {
        setImagePreview(null);
        formik.setFieldValue("image", null);
    };

    const formik = useFormik({
        initialValues: {
            cName: '',
            cLevel: '',
        },
        onSubmit: async (values) => {
            console.log("Submitting", values);
            console.log("selected Id:",selectedId);
            
            try{
                const res=  selectedId ?await CategoryApi.updateCategory(selectedId,values) : await CategoryApi.createCategory(values);
                toast.success("category created successfully.")
                setOpen(false);
                getAllCategories();
                console.log("categories:",res.data); 
            }catch(err){
                toast.error("error:",res.message)
            }

        },
    });

   const categoryColumns = useMemo(() => [
    { headerName: "Category Name", field: "cName" },
    { headerName: "Category Level", field: "cLevel" },
    {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
            <div className="flex items-center space-x-3 mt-2">
                <button onClick={() => {
                    setOpen(true);
                    console.log("id:",params.data._id);
                    
                    setIsEditMode(true);
                    setSelectedId(params.data._id);
                    formik.setValues(params.data);
                    setImagePreview(params.data.imagePreview || null);
                }}>
                    <FaRegEdit />
                </button>
                <button onClick={() => setDeleteModal(params.data)}>
                    <MdOutlineDeleteOutline className="text-red-600" />
                </button>
            </div>
        )
    }
], []);

useEffect(()=>{
    getAllCategories();
},[])


    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-bold text-primary">Fitness Categories</h2>
                {/* <button
                    onClick={() => {
                        setOpen(true);
                        setIsEditMode(false);
                        formik.resetForm();
                        setImagePreview(null);
                    }}
                    className="flex items-center gap-2 px-4 py-1 border border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white"
                >
                    <span>Add New</span>
                    <FaPlus />
                </button> */}
            </div>

            <Table2
                column={categoryColumns}
                internalRowData={caregoryData}
                searchLabel={"Fitness Categories"}
                isAdd={true}
                sheetName={"fitness-categories"}
                setModalOpen={setOpen}
            />

            {open && (
                <SidebarField
                    title={isEditMode ? "Edit Category" : "Add New Category"}
                    handleClose={() => {
                        setOpen(false);
                        setImagePreview(null);
                        formik.resetForm();
                        setSelectedId(null);
                    }}
                    button1={<Button onClick={formik.handleSubmit} text={isEditMode ? "Update" : "Save"} />}
                    button2={<Button variant="outline" text="Cancel" onClick={() => setOpen(false)} />}
                >
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* <div className="border p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Upload Image</h3>
                            <div className="relative w-full h-48 border-dashed border-2 rounded-lg overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer text-primary">
                                        <FaUpload className="mr-2" /> Upload Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0"
                                        />
                                    </label>
                                )}
                            </div>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={handleCancelImage}
                                    className="mt-2 text-red-600 flex items-center gap-1"
                                >
                                    <FaTimes /> Cancel
                                </button>
                            )}
                        </div> */}

                        <InputField
                            name="cName"
                            label="Category Name"
                            placeholder="e.g. Cardio"
                            value={formik.values.cName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.cName && formik.errors.cName}
                            isRequired
                        />


                        <InputField
                            name="cLevel"
                            label="Level"
                            type="select"
                            options={[
                                { label: "Beginner", value: "Beginner" },
                                { label: "Intermediate", value: "Intermediate" },
                                { label: "Advanced", value: "Advanced" },
                            ]}
                            value={formik.values.cLevel}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.cLevel && formik.errors.cLevel}
                            isRequired
                        />

                        {/* <InputField
                            name="duration"
                            label="Default Duration (in minutes)"
                            type="number"
                            placeholder="e.g. 30"
                            value={formik.values.duration}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.duration && formik.errors.duration}
                        /> */}

                        {/* <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isPopular"
                                checked={formik.values.isPopular}
                                onChange={(e) => formik.setFieldValue('isPopular', e.target.checked)}
                            />
                            <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">Mark as Popular</label>
                        </div> */}
                    </form>
                </SidebarField>
            )}

            {deleteModal && (
                <DeleteModal
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                    handleDelete={handleDelete}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${deleteModal.name}"?`}
                />
            )}
        </div>
    );
};

export default Categories;
