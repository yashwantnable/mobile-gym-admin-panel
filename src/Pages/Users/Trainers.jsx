import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SidebarField from '../../Components/SideBarField';
import InputField from '../../Components/InputField';
import Button from '../../Components/Button';
import { FaCamera, FaEye, FaEyeSlash, FaLock, FaRegEdit, FaTimes } from 'react-icons/fa';
import { MasterApi } from '../../Api/Master.api';
import { toast } from 'react-toastify';
import { ServiceApi } from '../../Api/Service.api';
import { useLoading } from '../../Components/loader/LoaderContext';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import DeleteModal from '../../Components/DeleteModal';
import { Table2 } from '../../Components/Table/Table2';
import PhoneInputField from '../../Components/PhoneInputField';
import { dummyTrainerList } from './EmployeeData';
import { TrainerApi } from '../../Api/Trainer.api';

const Trainers = () => {
  const [open, setOpen] = useState(false);
  const [experienceType, setExperienceType] = useState('');
  const [allTrainer, setAllTrainer] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [services, setServices] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);

  const validationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    emirates_id: Yup.number().required('Emirates Id is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone_number: Yup.string().required('Phone Number is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.string().required('Gender is required'),
    age: Yup.number().min(18, 'Age must be at least 18').required('Age is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    password: selectedRow?._id ? '' : Yup.string().required('Password is required'),
    specialization: Yup.string().required('Specialization is required'),
    experience: Yup.string().required('Experience is required'),
    experienceYear: Yup.number().when('experience', {
      is: 'EXPERIENCE',
      then: (schema) => schema.required('Years of Experience is required'),
    }),
  });

  const { handleLoading } = useLoading();

  useEffect(() => {
    if (selectedRow?._id) {
      setIdProofPreview(selectedRow?.id_proof || null);
      setCertificatePreview(selectedRow?.certificate || null);

      // (optional) profile too if you want
      setImagePreview(selectedRow?.profile_image || null);
    } else {
      // create mode
      setIdProofPreview(null);
      setCertificatePreview(null);
      setImagePreview(null);
    }
  }, [selectedRow]);

  const formik = useFormik({
    initialValues: {
      // serviceProvider: selectedRow?.serviceProvider || [],
      first_name: selectedRow?.first_name || '',
      last_name: selectedRow?.last_name || '',
      email: selectedRow?.email || '',
      emirates_id: selectedRow?.emirates_id || '',
      phone_number: selectedRow?.phone_number || '',
      address: selectedRow?.address || '',
      gender: selectedRow?.gender || '',
      age: selectedRow?.age || '',
      profile_image: selectedRow?.profile_image || null,
      id_proof: selectedRow?.id_proof || null,
      certificate: selectedRow?.certificate || null,
      country: selectedRow?.country?._id || '',
      city: selectedRow?.city?._id || '',
      password: selectedRow?.password || '',
      specialization: selectedRow?.specialization || '',
      experience: selectedRow?.experience || '',
      experienceYear: selectedRow?.experienceYear || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleLoading(true);

      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('emirates_id', values.emirates_id);
      formData.append('email', values.email);
      formData.append('phone_number', values.phone_number);
      formData.append('address', values.address);
      formData.append('gender', values.gender);
      formData.append('age', values.age);
      formData.append('country', values.country);
      formData.append('city', values.city);
      formData.append('password', values.password);
      formData.append('specialization', values.specialization);
      formData.append('experience', values.experience);
      formData.append('experienceYear', values.experienceYear);
      if (values.profile_image) {
        formData.append('profile_image', values.profile_image);
      }
      if (values.id_proof) {
        formData.append('id_proof', values.id_proof);
      }
      if (values.certificate) {
        formData.append('certificate', values.certificate);
      }
      console.log('Form Submitted:', values);
      console.log('selectedRow:', selectedRow?._id);
      try {
        const res = selectedRow?._id
          ? await TrainerApi.updateTrainer(selectedRow?._id, formData)
          : await TrainerApi.createTrainer(formData);
        console.log(res.data?.data);
        toast.success(selectedRow?._id ? 'User updated successfully' : 'user created successfully');
      } catch (err) {
        console.error(err);
      }
      setOpen(false);
      getTrainer();
      formik.resetForm();
      handleLoading(false);
    },
  });

  const getTrainer = async () => {
    handleLoading(true);
    try {
      const res = await TrainerApi.getAllTrainers();
      console.log('trainers:', res?.data?.data);

      setAllTrainer(res?.data?.data);
    } catch (err) {
      toast.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await TrainerApi.DeleteTrainer(id);
      toast.success(res?.message);
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleteModal();
      getTrainer();
    }
  };
  // const handleServiceType = async () => {
  //   handleLoading(true);
  //   try {
  //     const res = await ServiceApi.serviceType();
  //     // console.log(res.data);
  //     setServices(res.data?.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   handleLoading(false);
  // };
  console.log('allTrainer:', allTrainer);

  useEffect(() => {
    getTrainer();
  }, []);

  const serviceTypeOption = services.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     if (!file.type.match('image.*')) {
  //       formik.setFieldError('profile_image', 'Please select an image file');
  //       return;
  //     }
  //     if (file.size > 2 * 1024 * 1024) {
  //       formik.setFieldError('profile_image', 'Image must be less than 2MB');
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     formik.setFieldValue('profile_image', file);
  //     formik.setFieldError('profile_image', undefined);
  //   }
  // };
  const handleFileChange = (
    e,
    fieldName,
    { allowImage = true, allowPdf = false, maxSizeMB = 2, setPreview } = {}
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    // type validation
    if ((!allowImage && isImage) || (!allowPdf && isPdf) || (!isImage && !isPdf)) {
      formik.setFieldError(fieldName, 'Invalid file type');
      return;
    }

    // size validation
    if (file.size > maxSizeMB * 1024 * 1024) {
      formik.setFieldError(fieldName, `File must be under ${maxSizeMB}MB`);
      return;
    }

    // ✅ preview logic
    if (setPreview) {
      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else if (isPdf) {
        // preview as browser blob link
        const pdfUrl = URL.createObjectURL(file);
        setPreview(pdfUrl);
      }
    }

    formik.setFieldValue(fieldName, file);
    formik.setFieldError(fieldName, undefined);
  };

  // const removeImage = () => {
  //   setImagePreview(null);
  //   formik.setFieldValue('profile_image', null);
  // };
  const removeFile = (fieldName, setPreview) => {
    formik.setFieldValue(fieldName, null);
    if (setPreview) setPreview(null);
  };

  const cityDataforEdit = async (countryId) => {
    try {
      const res = await MasterApi.city(countryId);
      setCityData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;

    setCountryId(selectedCountryId);
    formik.setFieldValue('country', selectedCountryId);

    // ✅ reset city
    formik.setFieldValue('city', '');
    setCityData([]);

    if (selectedCountryId) {
      try {
        const res = await MasterApi.city(selectedCountryId);
        setCityData(res.data?.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  // useEffect(() => {
  //   handleCountryChange();
  // }, [selectedRow]);

  useEffect(() => {
    handleCountry();
    // getTrainer();
  }, []);

  const countryOptions = countryData.map((item) => {
    return {
      value: item?._id,
      label: `${item?.name}`,
    };
  });

  const cityOptions = cityData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const trainerColumns = useMemo(
    () => [
      {
        headerName: 'Profile Image',
        field: 'profile_image',
        cellRenderer: (params) =>
          params?.data?.profile_image ? (
            <img
              src={params.data.profile_image}
              alt='Profile'
              className='w-10 h-10 rounded-full object-cover'
            />
          ) : (
            'N/A'
          ),
      },
      {
        headerName: 'Name',
        field: 'first_name',
        cellRenderer: (params) =>
          `${params?.data?.first_name || ''} ${params?.data?.last_name || ''}`,
      },
      {
        headerName: 'Email',
        field: 'email',
      },
      {
        headerName: 'Emirates Id',
        field: 'emirates_id',
      },
      {
        headerName: 'Phone Number',
        field: 'phone_number',
      },
      {
        headerName: 'Address',
        field: 'address',
      },
      {
        headerName: 'Gender',
        field: 'gender',
      },
      {
        headerName: 'Age',
        field: 'age',
      },
      {
        headerName: 'Country',
        field: 'country',
        cellRenderer: (params) => params?.data?.country?.name || 'N/A',
      },
      {
        headerName: 'City',
        field: 'city',
        cellRenderer: (params) => params?.data?.city?.name || 'N/A',
      },
      {
        headerName: 'Specialization',
        field: 'specialization',
      },
      {
        headerName: 'Experience',
        field: 'experience',
      },
      {
        headerName: 'Experience Years',
        field: 'experienceYear',
        cellRenderer: (params) =>
          params?.data?.experience === 'EXPERIENCE' ? params?.data?.experienceYear || 'N/A' : '-',
      },
      {
        headerName: 'Certificate',
        field: 'certificate',
        cellRenderer: (params) =>
          params?.data?.certificate ? (
            <a
              href={params.data.certificate}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline'
            >
              View
            </a>
          ) : (
            'N/A'
          ),
      },
      {
        headerName: 'ID Proof',
        field: 'id_proof',
        cellRenderer: (params) =>
          params?.data?.id_proof ? (
            <a
              href={params.data.id_proof}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline'
            >
              View
            </a>
          ) : (
            'N/A'
          ),
      },
      {
        headerName: 'Actions',
        field: 'actions',
        minWidth: 150,
        cellRenderer: (params) => (
          <div className='flex items-center space-x-3 mt-2'>
            <button
              className='text-primary transition-colors cursor-pointer'
              onClick={() => {
                setOpen(true);
                setSelectedRow(params?.data);
              }}
            >
              <FaRegEdit size={18} />
            </button>
            <button
              className='text-red-600 hover:text-red-800 transition-colors cursor-pointer'
              onClick={() => setDeleteModal(params?.data)}
            >
              <MdOutlineDeleteOutline size={20} />
            </button>
          </div>
        ),
      },
    ],
    [setOpen, setSelectedRow, setDeleteModal]
  );

  useEffect(() => {
    const selectedCountryId = selectedRow?.country?._id;

    if (open && selectedCountryId) {
      // set country in form (optional but safe)
      formik.setFieldValue('country', selectedCountryId);

      // load cities for that country
      cityDataforEdit(selectedCountryId);
    }
  }, [open, selectedRow]);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    removeFile();
    formik.resetForm();
  };

  return (
    <>
      <div className='m-4'>
        <h2 className='text-primary text-3xl font-semibold'>Trainer</h2>
        <div>
          <Table2
            column={trainerColumns}
            internalRowData={allTrainer}
            searchLabel={'Trainer'}
            sheetName={'groomers'}
            setModalOpen={setOpen}
            isAdd={true}
          />

          {open && (
            <SidebarField
              title={selectedRow?._id ? `Update Trainer` : `Add New Trainer`}
              handleClose={handleClose}
              button1={
                <Button
                  onClick={formik.handleSubmit}
                  text={selectedRow?._id ? 'Update' : 'Save'}
                  type='submit'
                />
              }
              button2={<Button variant='outline' onClick={handleClose} text='Cancel' />}
            >
              <form onSubmit={formik.handleSubmit} className='space-y-4'>
                <div className='flex flex-col items-center mb-6'>
                  <div className='relative group'>
                    <div
                      className={`w-32 mb-3 h-32 rounded-full border-2 ${
                        formik.errors.profile_image ? 'border-red-500' : 'border-gray-300'
                      } flex items-center justify-center overflow-hidden bg-gray-100 transition-all duration-200 hover:border-primary`}
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt='Profile Preview'
                            className='w-full h-full object-cover'
                          />
                          <button
                            type='button'
                            onClick={() => removeFile('profile_image', setImagePreview)}
                            className='absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                          >
                            <FaTimes className='text-red-500 w-4 h-4' />
                          </button>
                        </>
                      ) : (
                        <div className='flex flex-col items-center justify-center text-gray-400'>
                          <FaCamera className='w-8 h-8 mb-2' />
                          <span className='text-xs'>Add Photo</span>
                        </div>
                      )}
                    </div>

                    <label className='mt-4 cursor-pointer'>
                      <span className='px-4 py-2 bg-primary ml-2 text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 text-sm'>
                        {imagePreview ? 'Change Photo' : 'Upload Photo'}
                      </span>
                      <input
                        type='file'
                        name='profile_image'
                        className='hidden'
                        accept='image/*'
                        onChange={(e) =>
                          handleFileChange(e, 'profile_image', {
                            allowImage: true,
                            allowPdf: false,
                            setPreview: setImagePreview,
                          })
                        }
                        onBlur={formik.handleBlur}
                      />
                    </label>
                  </div>

                  {formik.touched.profile_image && formik.errors.profile_image && (
                    <div className='mt-2 text-sm text-red-600'>{formik.errors.profile_image}</div>
                  )}
                </div>

                {/* <InputField
                  name="serviceProvider"
                  label="Category"
                  type="select"
                  isMulti={true}
                  options={serviceTypeOption}
                  value={formik.values.serviceProvider}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.serviceProvider &&
                    formik.errors.serviceProvider
                  }
                  isRequired
                /> */}

                <InputField
                  name='first_name'
                  label='First Name'
                  placeholder='Enter First Name'
                  isRequired
                  value={formik.values.first_name}
                  error={formik.touched.first_name && formik.errors.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name='last_name'
                  label='Last Name'
                  placeholder='Enter Last Name'
                  isRequired
                  value={formik.values.last_name}
                  error={formik.touched.last_name && formik.errors.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <InputField
                  name='email'
                  label='Email'
                  placeholder='Enter Email'
                  type='email'
                  isRequired
                  value={formik.values.email}
                  error={formik.touched.email && formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <InputField
                  name='emirates_id'
                  label='Emirates Id'
                  placeholder='Enter Emirates Id'
                  isRequired
                  value={formik.values.emirates_id}
                  error={formik.touched.emirates_id && formik.errors.emirates_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <PhoneInputField
                  name='phone_number'
                  label='Phone Number'
                  value={formik.values.phone_number}
                  error={formik.errors.phone_number}
                  touched={formik.touched.phone_number}
                  onChange={formik.setFieldValue}
                  onBlur={formik.setFieldTouched}
                  isRequired
                />
                <InputField
                  name='address'
                  label='Address'
                  placeholder='Enter Address'
                  isRequired
                  value={formik.values.address}
                  error={formik.touched.address && formik.errors.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name='gender'
                  label='Gender'
                  type='select'
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Others' },
                  ]}
                  isRequired
                  value={formik.values.gender}
                  error={formik.touched.gender && formik.errors.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputField
                  name='age'
                  label='Age'
                  type='number'
                  isRequired
                  value={formik.values.age}
                  error={formik.touched.age && formik.errors.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {/* {JSON.stringify(formik.values.country)} */}
                <InputField
                  name='country'
                  label='Country'
                  type='select'
                  options={countryOptions}
                  isRequired
                  value={formik.values.country}
                  error={formik.touched.country && formik.errors.country}
                  onChange={handleCountryChange}
                  onBlur={formik.handleBlur}
                />
                {/* {JSON.stringify(formik.values.city)} */}
                <InputField
                  name='city'
                  label='City'
                  type='select'
                  options={cityOptions}
                  isRequired
                  value={formik.values.city}
                  error={formik.touched.city && formik.errors.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {!selectedRow?._id && (
                  <div>
                    <label
                      htmlFor='password'
                      className='block text-gray-700 dark:bg-themeBG dark:text-themeText font-medium mb-2'
                    >
                      Password <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <div className='absolute top-4 left-0 pl-3 flex items-center pointer-events-none'>
                        <FaLock className='text-gray-400' />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        id='password'
                        placeholder='Enter your password'
                        className='w-full pl-8 pr-10 py-3 border border-gray-300 rounded-lg outline-none'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        type='button'
                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className='mt-1 text-sm text-red-600'>{formik.errors.password}</p>
                    )}
                  </div>
                )}
                <InputField
                  name='specialization'
                  label='Specialization'
                  placeholder='Enter Specialization'
                  isRequired
                  value={formik.values.specialization}
                  error={formik.touched.specialization && formik.errors.specialization}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                
                <DocumentUploadBox
                  label='ID Proof'
                  preview={idProofPreview}
                  accept='image/*,.pdf'
                  error={formik.touched.id_proof && formik.errors.id_proof}
                  onChange={(e) =>
                    handleFileChange(e, 'id_proof', {
                      allowImage: true,
                      allowPdf: true,
                      setPreview: setIdProofPreview,
                    })
                  }
                  onRemove={() => removeFile('id_proof', setIdProofPreview)}
                />
                <DocumentUploadBox
                  label='Certificate'
                  preview={certificatePreview}
                  accept='image/*,.pdf'
                  error={formik.touched.certificate && formik.errors.certificate}
                  onChange={(e) =>
                    handleFileChange(e, 'certificate', {
                      allowImage: true,
                      allowPdf: true,
                      setPreview: setCertificatePreview,
                    })
                  }
                  onRemove={() => removeFile('certificate', setCertificatePreview)}
                />

                <InputField
                  name='experience'
                  label='Experience'
                  type='select'
                  options={[
                    { label: 'Experience', value: 'EXPERIENCE' },
                    { label: 'Fresher', value: 'FRESHER' },
                  ]}
                  isRequired
                  value={formik.values.experience}
                  error={formik.touched.experience && formik.errors.experience}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setExperienceType(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.values.experience === 'EXPERIENCE' && (
                  <InputField
                    name='experienceYear'
                    label='How many years of experience?'
                    placeholder='Enter years of experience'
                    value={formik.values.experienceYear}
                    error={formik.touched.experienceYear && formik.errors.experienceYear}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                )}
              </form>
            </SidebarField>
          )}
        </div>
      </div>
      {deleteModal && (
        <DeleteModal
          setDeleteModal={setDeleteModal}
          deleteModal={deleteModal}
          handleDelete={() => handleDelete(deleteModal?._id)}
        />
      )}
    </>
  );
};

export default Trainers;

const DocumentUploadBox = ({
  label,
  preview,
  accept,
  onChange,
  onRemove,
  error,
  isRequired = false,
}) => {
  const isPdf = preview?.includes('.pdf') || preview?.startsWith('blob:');

  return (
    <div className="mb-6">
      {/* Label like other inputs */}
      <label className="block text-gray-700 font-medium mb-2">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>

      {/* Preview box */}
      <div className="relative group flex justify-center mb-3">
        <div
          className={`w-40 h-40 rounded-lg border-2 ${
            error ? 'border-red-500' : 'border-gray-300'
          } flex items-center justify-center overflow-hidden bg-gray-100`}
        >
          {preview ? (
            <>
              {isPdf ? (
                <div className="flex flex-col items-center justify-center text-gray-600 text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-xs mt-1">PDF Selected</span>
                  <a
                    href={preview}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-xs mt-2"
                  >
                    View PDF
                  </a>
                </div>
              ) : (
                <img
                  src={preview}
                  alt={`${label} Preview`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100"
              >
                <FaTimes className="text-red-500 w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <FaCamera className="w-8 h-8 mb-1" />
              <span className="text-xs">{label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Input-like upload button */}
      <label className="block">
        <div className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-500 hover:border-primary transition">
          {preview ? `Change ${label}` : `Upload ${label}`}
        </div>

        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={onChange}
        />
      </label>

      {/* Error */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

