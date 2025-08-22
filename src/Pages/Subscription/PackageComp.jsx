import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../Components/Modal';
import InputField from '../../Components/InputField';
import { useFormik } from 'formik';
import { PackageApi } from '../../Api/Subscription.api';
import { toast } from 'react-toastify';
import { useLoading } from '../../Components/loader/LoaderContext';
import { FiCalendar, FiEdit, FiPackage, FiPlus, FiTrash, FiTrash2 } from 'react-icons/fi';
import Button from '../../Components/Button';

const PackageComp = ({ activeTab, isOpen, setOpen }) => {
  const { handleLoading } = useLoading();
  const [allPackages, setAllpackages] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isPackageModal, setIsPackageModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: selectedRow?.name || '',
      price: selectedRow?.price || '',
      duration: selectedRow?.duration || '', // e.g., 'monthly'
      numberOfClasses: selectedRow?.numberOfClasses || '',
      image: selectedRow?.image || '', // file or existing path
      features: selectedRow?.features || [''],
    },
    // validationSchema: packageValidationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      console.log('values:', values);
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('duration', values.duration);
      formData.append('numberOfClasses', values.numberOfClasses);
      values.features.forEach((feature) => {
  formData.append('features[]', feature);
});
      if (values.image instanceof File) {
        formData.append('image', values.image);
      }

      try {
        let res;
        handleLoading(true)
        if (selectedRow?._id) {
          res = await PackageApi.updatePackage(selectedRow._id, formData);
          toast.success('Package updated successfully');
        } else {
          res = await PackageApi.createPackage(formData);
          toast.success('Package created successfully');
        }

        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        resetForm();
        getPackages();
        setAllpackages();
        setOpen(null);
        setSelectedRow(null);
      } catch (error) {
        console.error('Package submission error:', error);
        toast.error(error?.response?.data?.message);
      }finally{
        handleLoading(false)
      }
    },
  });

  console.log('selectedRow:', selectedRow);
  const fileInputRef = useRef(null);
  const [showUpload, setShowUpload] = useState(!selectedRow?.image);
  const [previewImage, setPreviewImage] = useState();

  useEffect(() => {
    if (selectedRow?.image && typeof selectedRow.image === 'string') {
      setPreviewImage(selectedRow.image);
      setShowUpload(false); // important!
    } else {
      setPreviewImage(null);
      setShowUpload(true);
    }
  }, [selectedRow]);

  const handleImageClick = () => {
    setShowUpload(true);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = (e) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  console.log('allPackages:', allPackages);
  const getPackages = async () => {
    try {
      handleLoading(true);
      const res = await PackageApi.getAllPackage();
      setAllpackages(res?.data?.data?.packages);
    } catch (err) {
      toast.error('error:', err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getPackages();
  }, [activeTab==="packages"]);
  return (
    <div>
      {activeTab === 'packages' && (
        <div className='flex justify-end'>
          <Button text='Create Membership' onClick={() => setOpen('package')} />
        </div>
      )}
      {activeTab === 'packages' && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
          {allPackages?.map((pkg) => (
            <div
              key={pkg._id}
              className='relative group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-100'
            >
              {/* Top-right action buttons */}
              <div className='absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <button
                  onClick={() => {
                    setSelectedRow(pkg);
                    setOpen('package');
                  }}
                  className='p-2 bg-white/90 backdrop-blur-sm shadow-md text-primary rounded-full hover:bg-primary hover:text-white transition-all'
                  title='Edit'
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => setDeleteModal(pkg)}
                  className='p-2 bg-white/90 backdrop-blur-sm shadow-md text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all'
                  title='Delete'
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              {/* Image */}
              {pkg.image && (
                <div className='relative h-48 overflow-hidden'>
                  <img src={pkg.image} alt={pkg.name} />

                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                  <span className='absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full capitalize'>
                    {pkg.duration}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className='p-5 flex flex-col gap-3'>
                <div>
                  <h2 className='text-xl font-bold text-gray-800 capitalize line-clamp-1'>
                    {pkg.name}
                  </h2>
                  <p className='text-sm text-gray-500'>Package deal</p>
                </div>

                {/* Number of classes and duration */}
                <div className='flex flex-wrap gap-2'>
                  <span className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs'>
                    <FiPackage className='w-3 h-3 mr-1' />
                    {pkg.numberOfClasses} Classes
                  </span>
                  <span className='inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-800 text-xs capitalize'>
                    <FiCalendar className='w-3 h-3 mr-1' />
                    {pkg.duration}
                  </span>
                </div>

                {/* Created date */}
                <div className='text-sm text-gray-500'>
                  Created on:{' '}
                  {new Date(pkg.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                {/* Price */}
                <div className='mt-4 flex items-center justify-end'>
                  <p className='text-lg font-bold text-primary'>AED {pkg.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setOpen(null);
          setSelectedRow(null);
        }}
        title={`Create Membership`}
      >
        <form onSubmit={formik.handleSubmit} className='space-y-6'>
          {/* 🖼️ Image Preview or Upload */}
          <div className='flex justify-center'>
            {!showUpload && previewImage ? (
              <img
                src={previewImage}
                alt='Package Preview'
                className='w-72 h-48 object-cover rounded-lg cursor-pointer shadow-md hover:opacity-80 transition'
                onClick={handleImageClick}
                title='Click to change image'
              />
            ) : (
              <InputField
                name='image'
                label='Upload Image'
                type='file'
                accept='image/*'
                inputRef={fileInputRef}
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                error={formik.touched.image && formik.errors.image}
                isRequired
              />
            )}
          </div>

          {/* 📦 Package Name */}
          <InputField
            name='name'
            label='Package Name'
            placeholder='Enter package name'
            isRequired
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          {/* 💸 Price / 🎯 Classes / 📅 Duration */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <InputField
              name='price'
              label='Price'
              placeholder='Enter price'
              type='number'
              isRequired
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && formik.errors.price}
            />
            <InputField
              name='numberOfClasses'
              label='No. of Classes'
              placeholder='Enter number of classes'
              type='number'
              isRequired
              value={formik.values.numberOfClasses}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.numberOfClasses && formik.errors.numberOfClasses}
            />
            <InputField
              name='duration'
              label='Duration'
              type='select'
              isRequired
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Daily', value: 'daily' },
              ]}
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.duration && formik.errors.duration}
            />
          </div>

               {/* Features Input Section */}
          <div>
            <label className='block text-md font-medium text-gray-700 mb-1'>
              Features <span className='text-red-500'>*</span>
            </label>

            {formik.values.features.map((feature, index) => (
              <div key={index} className='flex gap-2 items-center mb-2'>
                <input
                  type='text'
                  name={`features[${index}]`}
                  value={feature}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='flex-1 px-3 py-2 border rounded border-gray-300'
                  placeholder={`Feature ${index + 1}`}
                />

                {/* Remove Button (if more than 1 feature) */}
                {formik.values.features.length > 1 && (
                  <button
                    type='button'
                    onClick={() => {
                      const updated = [...formik.values.features];
                      updated.splice(index, 1);
                      formik.setFieldValue('features', updated);
                    }}
                    className='text-red-500 hover:text-red-700'
                  >
                    <FiTrash />
                  </button>
                )}

                {/* Add Button (only on last item) */}
                {index === formik.values.features.length - 1 && (
                  <button
                    type='button'
                    onClick={() =>
                      formik.setFieldValue('features', [...formik.values.features, ''])
                    }
                    className='text-primary hover:text-blue-600'
                  >
                    <FiPlus />
                  </button>
                )}
              </div>
            ))}

            {/* Optional Error Display */}
            {formik.touched.features && typeof formik.errors.features === 'string' && (
              <p className='text-red-500 text-sm mt-1'>{formik.errors.features}</p>
            )}
          </div>

          {/* 🧩 Actions */}
          <div className='flex justify-center gap-6 pt-4'>
            <button
              type='button'
              className='px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition'
              onClick={() => {
                setOpen(null);
                setSelectedRow(null);
              }}
            >
              Close
            </button>
            <button
              type='submit'
              className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition'
            >
              {selectedRow ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackageComp;
