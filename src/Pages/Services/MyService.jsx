import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SidebarField from '../../Components/SideBarField';
import { rowData } from '../../dummydata';
import InputField from '../../Components/InputField';
import Button from '../../Components/Button';
import ServiceCard from './ServiceCard';
import { FaPlus, FaTimes, FaTrash, FaUpload } from 'react-icons/fa';
import { useLoading } from '../../Components/loader/LoaderContext';
// import { ServiceApi } from "../../Api/Service.api";
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Table2 } from '../../Components/Table/Table2';
import DeleteModal from '../../Components/DeleteModal';

const validationSchema = Yup.object({
  categoryId: Yup.string().required('Service Type is required'),
  name: Yup.string().required('Service Name is required'),
  groomingDetails: Yup.array()
    .of(
      Yup.object({
        weightType: Yup.string().required('Weight Type is required'),
        description: Yup.string().max(300, 'Description should be max 300 characters'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
      })
    )
    .min(1, 'At least one grooming detail is required'),
  image: Yup.mixed().nullable().required('Image is required'),
});

const serviceTypeValidationSchema = Yup.object({
  name: Yup.string().required('Service Type Name is required'),
  image: Yup.mixed().nullable().required('Image is required'),
});

const ServicesTable = React.memo(
  ({ rowData, setOpen, setDeleteModal, setSid, subService, handleService }) => {
    const columns = [
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
        field: 'name',
        minWidth: 150,
      },

      {
        headerName: 'Weight Type',
        field: 'groomingDetails',
        minWidth: 150,
        cellRenderer: (params) => params.value?.[0]?.weightType || 'N/A',
      },
      {
        headerName: 'Description',
        field: 'groomingDetails',
        minWidth: 300,
        cellRenderer: (params) => {
          const description = params.value?.[0]?.description || '';
          const items = description.split(',\n');
          return (
            <div className='space-y-1 text-sm pt-2'>
              {items.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          );
        },
      },
      {
        headerName: 'Price',
        field: 'groomingDetails',
        minWidth: 100,
        cellRenderer: (params) => `AED ${params.value?.[0]?.price || 0}`,
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
                setSid(params?.data?._id);
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
    ];

    useEffect(() => {
      // handleService()
    }, []);

    return (
      <Table2
        column={columns}
        internalRowData={subService}
        searchLabel={'Sessions'}
        sheetName={'sessions'}
        setModalOpen={setOpen}
        isAdd={true}
      />
    );
  }
);

const MyService = () => {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [services, setServices] = useState([]);
  const [openType, setOpenType] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { handleLoading } = useLoading();
  const [isEditMode, setIsEditMode] = useState(false);
  const [subService, setSubService] = useState([]);
  const [singleService, setSingleService] = useState(null);
  const [sId, setSid] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    if (isEditMode && editingService) {
      serviceTypeFormik.setValues({
        name: editingService.name || '',
        image: editingService.image || null,
        description: editingService.description || null,
      });
      setImagePreview(editingService.image || null);
    }
  }, [isEditMode, editingService]);

  // const handlesingleService = async () => {
  //     handleLoading(true);
  //     try {
  //         const res = await ServiceApi.singleService(sId);
  //         setSingleService(res.data?.data);
  //     } catch (err) {
  //         console.log(err);
  //     }
  //     handleLoading(false);
  // };

  console.log('deleteModal:', deleteModal);

  //  const handleDelete = async () => {
  //         if (!deleteModal) return;
  //         handleLoading(true);
  //         try {
  //             await ServiceApi.deleteService(deleteModal);
  //             fetchPromoCodes();
  //             setDeleteModal(null);
  //         } catch (err) {
  //             console.error('Error deleting promo code:', err);
  //         }
  //         handleLoading(false);
  //     };

  useEffect(() => {
    if (sId) {
      // handlesingleService()
    }
  }, [sId]);

  // const handleServiceType = async () => {
  //     handleLoading(true);
  //     try {
  //         const res = await ServiceApi.serviceType();
  //         setServices(res.data?.data);
  //     } catch (err) {
  //         console.log(err);
  //     }
  //     handleLoading(false);
  // };

  // const handleService = async () => {
  //     handleLoading(true);
  //     try {
  //         const res = await ServiceApi.service();
  //         setSubService(res.data?.data)

  //     } catch (err) {
  //         console.log(err);
  //     }
  //     handleLoading(false);
  // };

  useEffect(() => {
    // handleServiceType();
  }, []);

  const serviceTypeOption = services.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const formik = useFormik({
    initialValues: {
      categoryId: '',
      name: '',
      groomingDetails: [],
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      // const { weightType, description, price, ...payload } = values;
      // const formData = new FormData();
      // Object.entries(payload).forEach(([key, value]) => {
      //     if (key === 'groomingDetails') {
      //         formData.append(key, JSON.stringify(value));
      //     } else {
      //         formData.append(key, value);
      //     }
      // });
      // handleLoading(true)
      // try {
      //     sId ? await ServiceApi.updateService(sId, formData) : await ServiceApi.createService(formData);
      //     toast.success(sId ? "Sub service updated successfully" : "Sub service created successfully")
      // }
      // catch (err) {
      //     console.log(err)
      //     toast.error(err?.response?.data?.message)
      //     handleLoading(false)
      // }
      // setOpen(false);
      // handleService()
      // handleLoading(false)
      // formik.resetForm();
      // setImagePreview(null);
      // setSid(null)
    },
  });

  useEffect(() => {
    if (singleService) {
      formik.setValues({
        name: singleService.name || '',
        categoryId: singleService.categoryId || '',
        image: singleService.image || null,
        groomingDetails: singleService.groomingDetails.map((groomingDetails) => ({
          _id: groomingDetails?._id,
          weightType: groomingDetails?.weightType,
          price: groomingDetails?.price,
          description: groomingDetails?.description,
        })),
      });
      setImagePreview(singleService.image || null);
    }
  }, [singleService]);

  const serviceTypeFormik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: null,
    },
    validationSchema: serviceTypeValidationSchema,
    onSubmit: async (values) => {
      // handleLoading(true)
      // try {
      //     const formData = new FormData();
      //     formData.append('name', values.name);
      //     formData.append('description', values.description);
      //     formData.append('image', values.image);
      //     isEditMode
      //         ? await ServiceApi.updateServiceType(id, formData)
      //         : await ServiceApi.createServiceType(formData);
      //     toast.success(isEditMode ? "Service type updated successfully" : "Service type created successfully")
      // } catch (err) {
      //     console.log(err);
      //     handleLoading(false)
      // }
      // handleLoading(false)
      // setOpenType(false);
      // serviceTypeFormik.resetForm();
      // setImagePreview(null);
      // handleServiceType()
      // setEditingService(null)
      // setIsEditMode(false)
      // setId(null)
    },
  });

  const handleCancelImage = (isServiceType) => {
    if (isServiceType) {
      serviceTypeFormik.setFieldValue('image', null);
      setImagePreview(null);
    } else {
      formik.setFieldValue('image', null);
      setImagePreview(null);
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

  const handleAddGroomingDetail = () => {
    const { weightType, description, price } = formik.values;
    if (weightType && description && price) {
      formik.setFieldValue('groomingDetails', [
        ...formik.values.groomingDetails,
        { weightType, description, price },
      ]);
      formik.setFieldValue('weightType', '');
      formik.setFieldValue('description', '');
      formik.setFieldValue('price', '');
    }
  };

  const handleRemoveGroomingDetail = (index) => {
    const updatedDetails = formik.values.groomingDetails.filter((_, i) => i !== index);
    formik.setFieldValue('groomingDetails', updatedDetails);
  };

  return (
    <div className='p-5'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-4xl font-bold text-primary'>Sessions</h2>
        {/* <button
          onClick={() => setOpenType(true)}
          className='flex items-center gap-2 px-4 py-1 cursor-pointer border-[0.1rem] border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300'
        >
          <span>Add New</span>
          <FaPlus />
        </button> */}
      </div>

      {/* <div className='flex items-center flex-wrap lg:gap-20 gap-2  justify-center w-full'>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            icon={<FaRegEdit />}
            icon2={<MdOutlineDeleteOutline />}
            onEdit={() => {
              setEditingService(service);
              setIsEditMode(true);
              setOpenType(true);
              setId(service?._id);
              console.log(service);
            }}
            handleServiceType={handleServiceType}
          />
        ))}
      </div> */}

      <ServicesTable
        rowData={rowData}
        setDeleteModal={setDeleteModal}
        setOpen={setOpen}
        setSid={setSid}
        subService={subService}
        handleService={[]}
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
              options={[]}
              value={formik.values.categoryId}
              onChange={(e) => formik.setFieldValue('categoryId', e.target.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.categoryId && formik.errors.categoryId}
              isRequired
            />
            <InputField
              name='name'
              label='Session Name'
              placeholder='Enter Session Name'
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.name && formik.errors.name}
              isRequired
            />

            <InputField
              name='categoryId'
              label='Trainer'
              type='select'
              options={[]}
              value={formik.values.categoryId}
              onChange={(e) => formik.setFieldValue('categoryId', e.target.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.categoryId && formik.errors.categoryId}
              isRequired
            />

            {/* {formik.values.groomingDetails.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-2xl font-semibold mb-4'>Added Grooming Details</h3>
                <div className='space-y-4'>
                  {formik.values.groomingDetails.map((detail, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center bg-gray-100 p-4 rounded-lg'
                    >
                      <div>
                        <p className='font-semibold'>Pet Weight : {detail.weightType}</p>
                        <p>{detail.description}</p>
                        <p>
                          <span className='font-bold'>AED</span> {detail.price}
                        </p>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveGroomingDetail(index)}
                        className='text-red-600 cursor-pointer'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </form>
        </SidebarField>
      )}
      {deleteModal && (
        <DeleteModal
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
          title='Delete Promo Code'
          message={`Are you sure you want to delete the promo code "${deleteModal.code}"? This action cannot be undone.`}
        />
      )}

      {openType && (
        <SidebarField
          title={isEditMode ? 'Update Service Type' : 'Add Service Type'}
          handleClose={() => {
            setOpenType(false);
            setImagePreview(null);
            serviceTypeFormik.resetForm();
            setEditingService(null);
            setIsEditMode(false);
            setId(null);
          }}
          button1={<Button onClick={serviceTypeFormik.handleSubmit} text='Save' />}
          button2={
            <Button
              variant='outline'
              onClick={() => {
                setOpenType(false);
                setImagePreview(null);
                serviceTypeFormik.resetForm();
                setEditingService(null);
                setIsEditMode(false);
                setId(null);
              }}
              text='Cancel'
            />
          }
        >
          <form onSubmit={serviceTypeFormik.handleSubmit} className='space-y-4'>
            <div className='border p-4 cursor-pointer rounded-lg'>
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
                      onChange={(e) => handleImageUpload(true, e)}
                      className='absolute inset-0 opacity-0'
                    />
                  </label>
                )}
              </div>
              {imagePreview && (
                <button
                  type='button'
                  onClick={() => handleCancelImage(true)}
                  className='mt-2 text-red-600 flex items-center gap-1'
                >
                  <FaTimes /> Cancel
                </button>
              )}
              {serviceTypeFormik.touched.image && serviceTypeFormik.errors.image && (
                <p className='text-red-600'>{serviceTypeFormik.errors.image}</p>
              )}
            </div>

            <InputField
              name='name'
              label='Service Type'
              placeholder='Enter Service Type'
              value={serviceTypeFormik.values.name}
              onBlur={serviceTypeFormik.handleBlur}
              onChange={serviceTypeFormik.handleChange}
              error={serviceTypeFormik.touched.name && serviceTypeFormik.errors.name}
              isRequired
            />

            <InputField
              name='description'
              label='Description'
              type='textarea'
              placeholder='Enter Description'
              value={serviceTypeFormik.values.description}
              onChange={serviceTypeFormik.handleChange}
              onBlur={serviceTypeFormik.handleBlur}
              error={serviceTypeFormik.touched.description && serviceTypeFormik.errors.description}
            />
          </form>
        </SidebarField>
      )}
    </div>
  );
};

export default MyService;
