import React, { useEffect, useMemo, useState } from 'react';
import { Table2 } from '../../Components/Table/Table2';
import DeleteModal from '../../Components/DeleteModal';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import { FaRegEdit, FaTimes, FaUpload } from 'react-icons/fa';
import InputField from '../../Components/InputField';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useFormik } from 'formik';
import { MasterApi } from '../../Api/Master.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { CategoryApi } from '../../Api/Category.Api';
import { toast } from 'react-toastify';

const MySessions = () => {
  const { handleLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [sId, setSid] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [categories, setCategories] = useState(null);
  console.log('deleteModal:', deleteModal);

  const handleCancelImage = (isServiceType) => {
    if (isServiceType) {
      serviceTypeFormik.setFieldValue('image', null);
      setImagePreview(null);
    } else {
      formik.setFieldValue('image', null);
      setImagePreview(null);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await MasterApi.deleteSession(deleteModal);
      toast.success('session deleted successfully');
      setDeleteModal(false);
      getAllCategories();
    } catch (err) {
      toast.error('error:', err);
    }
  };

  const handleImageUpload = (isServiceType, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (isServiceType) {
        serviceTypeFormik.setFieldValue('image', file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        formik.setFieldValue('image', file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      alert('Please upload a valid image');
    }
  };

  useEffect(() => {
    setImagePreview(sId?.image);
  }, [sId]);
  console.log('sission id:', sId);

  const columns = useMemo(
    () => [
      {
        headerName: 'Image',
        field: 'image',
        minWidth: 150,
        cellRenderer: (params) => (
          <img src={params.value} alt='Service' className='w-20 h-full object-cover' />
        ),
      },
      {
        headerName: 'Name',
        field: 'sessionName',
        minWidth: 150,
      },
      {
        headerName: 'Description',
        field: 'description',
        minWidth: 150,
        flex: 1,
        cellRenderer: (params) => {
          const text = params.value || '';
          return text.length > 50 ? text.substring(0, 50) + '...' : text;
        },
      },

      {
        headerName: 'Actions',
        field: 'actions',
        minWidth: 150,
        cellRenderer: (params) => (
          <div className='text-xl flex items-center py-2'>
            <button
              className='rounded cursor-pointer'
              onClick={() => {
                setOpen(true);
                setSid(params?.data);
              }}
            >
              <FaRegEdit />
            </button>
            <button
              className='px-4 rounded cursor-pointer text-red-500'
              onClick={() => setDeleteModal(params?.data?._id)}
            >
              <MdOutlineDeleteOutline />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const getAllServiceData = async () => {
    handleLoading(true);
    try {
      const res = await MasterApi.getAllSession();
      setSessions(res.data?.data);
    } catch (err) {
      console.log(err);
    }
    handleLoading(false);
  };

  const getAllCategories = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllCategory();
      console.log('categories:', res.data?.data);

      setCategories(res.data?.data);
    } catch (err) {
      console.log(err);
    }
    handleLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      categoryId: sId?.categoryId?._id || '',
      sessionName: sId?.sessionName || '',
      description: sId?.description || '',
      image: sId?.image || null,
    },
    //   validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('values:', values);

      handleLoading(true);
      try {
        const formData = new FormData();
        formData.append('sessionName', values.sessionName);
        formData.append('categoryId', values.categoryId);
        formData.append('description', values.description);
        formData.append('image', values.image);
        sId
          ? await MasterApi.updateSession(sId?._id, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
          : await MasterApi.createSession(formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
        toast.success(
          isEditMode ? 'Service type updated successfully' : 'Service type created successfully'
        );
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message);
        handleLoading(false);
      }
      setOpen(false);
      getAllServiceData();
      handleLoading(false);
      formik.resetForm();
      setImagePreview(null);
      setSid(null);
    },
  });

  useEffect(() => {
    getAllServiceData();
    getAllCategories();
  }, []);
  return (
    <div className='p-5'>
      <h2 className='text-4xl font-bold text-primary'>Sessions</h2>

      <Table2
        column={columns}
        internalRowData={sessions}
        searchLabel={'Sessions'}
        sheetName={'sessions'}
        setModalOpen={setOpen}
        isAdd={true}
      />

      {open && (
        <SidebarField
          title={sId ? 'Update Session' : 'Add New Session'}
          handleClose={() => {
            setOpen(false);
            setImagePreview(null);
            formik.resetForm();
            setSid(null);
          }}
          button1={<Button onClick={formik.handleSubmit} text={sId ? 'Update' : 'Save'} />}
          button2={
            <Button
              variant='outline'
              onClick={() => {
                setOpen(false);
                setImagePreview(null);
                formik.resetForm();
                setSid(null);
              }}
              text='Cancel'
            />
          }
        >
          <form onSubmit={formik.handleSubmit} className='space-y-4'>
            <div className='border p-4 rounded-lg '>
              <h3 className='text-xl font-semibold mb-4'>Upload Image</h3>
              <div className='relative w-full h-48 border-dashed border-2 rounded-lg overflow-hidden'>
                {imagePreview ? (
                  <img src={imagePreview} alt='Preview' className='w-full h-full object-contain' />
                ) : (
                  <label className='absolute inset-0 flex items-center justify-center cursor-pointer text-primary'>
                    <FaUpload className='mr-2' />
                    Upload Image
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleImageUpload(false, e)}
                      className='absolute inset-0 opacity-0'
                    />
                  </label>
                )}
              </div>
              {imagePreview && (
                <button
                  type='button'
                  onClick={() => handleCancelImage(false)}
                  className='mt-2 text-red-600 flex items-center gap-1'
                >
                  <FaTimes /> Cancel
                </button>
              )}
              {formik.touched.image && formik.errors.image && (
                <p className='text-red-600'>{formik.errors.image}</p>
              )}
            </div>

            <InputField
              name='categoryId'
              label='Category'
              type='select'
              options={categories.map((cat) => ({
                label: `${cat.cName}`,
                value: cat._id,
              }))}
              value={formik.values.categoryId}
              onChange={(e) => formik.setFieldValue('categoryId', e.target.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.categoryId && formik.errors.categoryId}
              isRequired
            />

            <InputField
              name='sessionName'
              label='Session Name'
              placeholder='Enter Session Name'
              value={formik.values.sessionName}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.sessionName && formik.errors.sessionName}
              isRequired
            />

            <InputField
              name='description'
              label='Description'
              placeholder='description'
              type='textarea'
              options={[]}
              value={formik.values.description}
              onChange={(e) => formik.setFieldValue('description', e.target.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.description && formik.errors.description}
              isRequired
              className='w-full h-50 px-4 py-2 border rounded-lg outline-none border-[#d1d5db]'
            />
          </form>
        </SidebarField>
      )}
      {deleteModal && (
        <DeleteModal
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
          title='Delete Promo Code'
          message={`Are you sure you want to delete the Type ? `}
        />
      )}
    </div>
  );
};

export default MySessions;
