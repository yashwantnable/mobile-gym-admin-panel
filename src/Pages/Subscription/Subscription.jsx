import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import { SubscriptionApi } from '../../Api/Subscription.api';
import { toast } from 'react-toastify';
import { CategoryApi } from '../../Api/Category.Api';
import { MasterApi } from '../../Api/Master.api';
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import DeleteModal from '../../Components/DeleteModal';


const Subscription = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [allSubscription, setAllSubscription] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
   const [deleteModal, setDeleteModal] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tenureOptions, setTenureOptions] = useState([]);

  const subscriptionValidationSchema = Yup.object({
    name: Yup.string().required('Required'),
    media: Yup.string().required('Image is required'),
    categoryId: Yup.string().required('Required'),
    sessionType: Yup.string().required('Required'),
    duration: Yup.string().required('Required'),
    price: Yup.number().required('Required'),
    description: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
  });


    

  const allSubscriptions = async () => {
    try {
      const res = await SubscriptionApi.getAllSubscription();
      setAllSubscription(res?.data?.data);
      console.log('all subscriptions:', res?.data?.data);
    } catch (err) {
      toast.error('error:', err);
    }
  };

  const handleDelete=async()=>{
          try{
              const res= await SubscriptionApi.DeleteSubscription(deleteModal?._id);
              toast.success("Subscription deleted successfully")
              setDeleteModal(null)
              allSubscriptions();
          }catch(err){
              toast.error("error:",err)
          }
      }

  const getAllSession = async () => {
    try {
      const res = await MasterApi.getAllSession();
      setAllSessions(res?.data?.data);
      console.log('all sessions:', res?.data?.data);
    } catch (err) {
      toast.error('error:', err);
    }
  };
  const getAllTenures = async () => {
    try {
      const res = await MasterApi.getAllTenure();
      setTenureOptions(res?.data?.data);
      console.log('All Tenures:', res?.data?.data);
    } catch (err) {
      toast.error('error:', err);
    }
  };

  const getAllCategories = async () => {
    try {
      const categories = await CategoryApi.getAllCategory();
      console.log('categories:', categories?.data?.data);
      setCategoryOptions(categories?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: selectedRow?.name || '',
      categoryId: selectedRow?.categoryId?._id || '',
      media: selectedRow?.media || '',
      sessionType: selectedRow?.sessionType?._id || '',
      duration: selectedRow?.duration?._id || '',
      price: selectedRow?.price || '',
      description: selectedRow?.description || '',
      location: selectedRow?.location || '',
    },
    validationSchema: subscriptionValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      console.log('Form values:', values);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('categoryId', values.categoryId);
      formData.append('sessionType', values.sessionType);
      formData.append('duration', values.duration);
      formData.append('price', values.price);
      formData.append('description', values.description);
      formData.append('location', values.location);

      if (values.media) {
        formData.append('media', values.media); // file object
      }

      try {
        let res;
        if (selectedRow?._id) {
          res = await SubscriptionApi.updateSubscription(selectedRow._id, formData);
          toast.success('Subscription updated successfully');
        } else {
          res = await SubscriptionApi.createSubscription(formData);
          toast.success('Subscription created successfully');
        }

        console.log('res:', res);
        resetForm();
        allSubscriptions();
        setOpen(false);
        setSelectedRow(null);
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('Failed to save subscription');
      }
    },
  });

  useEffect(() => {
    allSubscriptions();
    getAllCategories();
    getAllSession();
    getAllTenures();
  }, []);

  return (
    <div className='p-10'>
      <div className='flex justify-between mb-4'>
        <h2 className='text-4xl font-bold text-primary'>Subscription</h2>
        <Button text='Create Subscription' onClick={() => setOpen(true)} />
      </div>

      {/* Subscription Cards Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10 mx-auto'>
        {allSubscription.map((sub) => (
          <div
            key={sub._id}
            className='relative bg-white rounded-2xl shadow p-2 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-300'
          >
            {/* Buttons at the top-right of the card */}
            <div className='absolute top-2 right-2 z-10 flex gap-2'>
               <button
        className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition'
        onClick={() => {
          setSelectedRow(sub);
          setOpen(true);
        }}
      >
        <FiEdit size={16} />
      </button>

      <button
        className='p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition'
        onClick={() => {
          // setSelectedRow();
          setDeleteModal(sub);
        }}
      >
        <FiTrash2 size={16} />
      </button>
            </div>

            {/* Image */}
            <div className='mb-3'>
              {sub.media && (
                <img
                  src={sub.media}
                  alt={sub.name}
                  className='w-full h-40 object-cover rounded-lg'
                />
              )}
            </div>

            {/* Card Content */}
            <div>
              <h2 className='text-lg font-semibold text-primary'>{sub.name}</h2>
              <p className='text-sm text-gray-500 mb-1'>{sub.categoryId?.cName}</p>
              <p className='text-sm text-gray-500 mb-1'>{sub.sessionType?.sessionName}</p>
              <p className='text-sm text-gray-500 mb-1'>Tenure: {sub.duration?.name}</p>
              <p className='text-sm text-gray-500 mb-1'>Location: {sub.location}</p>
              <p className='text-sm text-gray-500 mb-2'>Price: ${sub.price}</p>
              <p className='text-sm text-gray-600'>{sub.description}</p>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <SidebarField
          title={selectedRow ? 'Edit Subscription' : 'Create Subscription'}
          handleClose={() => {
            setOpen(false);
            setSelectedRow(null);
            formik.resetForm();
          }}
          button1={
            <Button
              onClick={formik.handleSubmit}
              text={selectedRow ? 'Update' : 'Save'}
              type='submit'
              disabled={!formik.isValid || formik.isSubmitting}
            />
          }
          button2={
            <Button
              variant='outline'
              onClick={() => {
                setOpen(false);
                setSelectedRow(null);
                formik.resetForm();
              }}
              text='Cancel'
            />
          }
        >
          <form onSubmit={formik.handleSubmit} className='space-y-4'>
            {/* Image Upload */}
            <InputField
              name='media'
              label='Image'
              type='file'
              accept='image/*'
              isRequired
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  formik.setFieldValue('media', file);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.media && formik.errors.media}
            />

            {/* Preview */}
            {formik.values.media && (
              <img
                src={formik.values.media}
                alt='Preview'
                className='w-32 h-32 object-cover rounded-md mt-2 border'
              />
            )}

            {/* Name */}
            <InputField
              name='name'
              label='Subscription Name'
              placeholder='Enter subscription name'
              isRequired
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />

            {/* Category */}
            <InputField
              name='categoryId'
              label='Category'
              type='select'
              options={categoryOptions.map((cat) => ({
                label: `${cat.cName} (${cat.cLevel})`, // You can customize label as needed
                value: cat._id,
              }))}
              value={formik.values.categoryId}
              onChange={(e) => formik.setFieldValue('categoryId', e.target.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.categoryId && formik.errors.categoryId}
              isRequired
            />
            <InputField
              name='sessionType'
              label='Session'
              type='select'
              options={
                allSessions && allSessions.length > 0
                  ? allSessions.map((session) => ({
                      label: session.sessionName,
                      value: session._id,
                    }))
                  : []
              }
              value={formik.values.sessionType}
              onChange={(e) => formik.setFieldValue('sessionType', e.target.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.sessionType && formik.errors.sessionType}
              isRequired
            />

            {/* Tenure */}
            <InputField
              name='duration'
              label='Tenure'
              type='select'
              options={tenureOptions.map((duration) => ({
                label: `${duration.name}`, // You can customize label as needed
                value: duration._id,
              }))}
              isRequired
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.duration && formik.errors.duration}
            />

            {/* Price */}
            <InputField
              name='price'
              label='Price'
              type='number'
              placeholder='Enter price'
              isRequired
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && formik.errors.price}
            />

            {/* Description */}
            <InputField
              name='description'
              label='Description'
              placeholder='Enter description'
              isRequired
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && formik.errors.description}
            />

            {/* Location */}
            <InputField
              name='location'
              label='Location'
              placeholder='Enter location'
              isRequired
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && formik.errors.location}
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
          message={`Are you sure you want to delete the promo code "${deleteModal.code}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Subscription;
