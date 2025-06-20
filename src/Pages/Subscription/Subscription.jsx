import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';

// Dummy card data
const dummySubscriptions = [
  {
    id: 1,
    name: 'Gold Gym Package',
    category: 'Fitness',
    service: 'Gym Access',
    tenure: 'Monthly',
    price: 49.99,
    description: 'Full access to gym equipment and group classes.',
    location: 'Dubai',
    image:
      'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Zumba Pro Plan',
    category: 'Zumba',
    service: 'Group Zumba Classes',
    tenure: 'Weekly',
    price: 19.99,
    description: 'Fun Zumba sessions every week with certified trainers.',
    location: 'Abu Dhabi',
    image:
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Yoga Retreat',
    category: 'Yoga',
    service: 'Daily Yoga',
    tenure: 'Daily',
    price: 5.0,
    description: 'Morning yoga sessions for a peaceful start.',
    location: 'Sharjah',
    image:
      'https://images.unsplash.com/photo-1550985607-b2839c2a1f4f?auto=format&fit=crop&w=800&q=80',
  },
];

const tenureOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

const Subscription = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [subscriptions, setSubscriptions] = useState(dummySubscriptions);

  const subscriptionValidationSchema = Yup.object({
    name: Yup.string().required('Required'),
    image: Yup.string().required('Image is required'),
    category: Yup.string().required('Required'),
    service: Yup.string().required('Required'),
    tenure: Yup.string().required('Required'),
    price: Yup.number().required('Required'),
    description: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      name: selectedRow?.name || '',
      category: selectedRow?.category || '',
      image: selectedRow?.image || '',
      service: selectedRow?.service || '',
      tenure: selectedRow?.tenure || '',
      price: selectedRow?.price || '',
      description: selectedRow?.description || '',
      location: selectedRow?.location || '',
    },
    validationSchema: subscriptionValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (selectedRow) {
        // Update existing
        setSubscriptions((prev) =>
          prev.map((item) => (item.id === selectedRow.id ? { ...item, ...values } : item))
        );
      } else {
        // Create new
        const newSub = { id: Date.now(), ...values };
        setSubscriptions((prev) => [...prev, newSub]);
      }
      setOpen(false);
      setSelectedRow(null);
      formik.resetForm();
    },
  });

  return (
    <div className='p-10'>
      <div className='flex justify-between mb-4'>
        <h2 className='text-4xl font-bold text-primary'>Subscription</h2>
        <Button text='Create Subscription' onClick={() => setOpen(true)} />
      </div>

      {/* Subscription Cards Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10 mx-auto'>
        {subscriptions.map((sub) => (
  <div
    key={sub.id}
    className="group bg-white rounded-2xl shadow p-2 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-300"
  >
    {/* Image Wrapper with Buttons Overlay */}
    <div className="relative mb-3">
      {sub.image && (
        <img
          src={sub.image}
          alt={sub.name}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}

      {/* Hover Buttons Positioned on Top of Image */}
      <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          text="Update"
          cssClass="hover:shadow-lg px-4 py-1 text-sm"
          size="sm"
          onClick={() => {
            setSelectedRow(sub);
            setOpen(true);
          }}
        />
        <Button
          text="Delete"
          size="sm"
          variant="outline"
          cssClass="px-4 py-1 text-sm text-red-500 hover:shadow-lg"
          onClick={() =>
            setSubscriptions((prev) => prev.filter((item) => item.id !== sub.id))
          }
        />
      </div>
    </div>

    {/* Content Section */}
    <div>
      <h2 className="text-lg font-semibold text-primary">{sub.name}</h2>
      <p className="text-sm text-gray-500 mb-1">{sub.category}</p>
      <p className="text-sm text-gray-500 mb-1">{sub.service}</p>
      <p className="text-sm text-gray-500 mb-1">Tenure: {sub.tenure}</p>
      <p className="text-sm text-gray-500 mb-1">Location: {sub.location}</p>
      <p className="text-sm text-gray-500 mb-2">Price: ${sub.price}</p>
      <p className="text-sm text-gray-600">{sub.description}</p>
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
                formik.resetForm();
              }}
              text='Cancel'
            />
          }
        >
          <form onSubmit={formik.handleSubmit} className='space-y-4'>
            <InputField
              name='image'
              label='Image'
              type='file'
              accept='image/*'
              isRequired
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    formik.setFieldValue('image', reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.image && formik.errors.image}
            />

            {/* Preview below input */}
            {formik.values.image && (
              <img
                src={formik.values.image}
                alt='Preview'
                className='w-32 h-32 object-cover rounded-md mt-2 border'
              />
            )}

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
            <InputField
              name='category'
              label='Category'
              placeholder='Enter category'
              isRequired
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && formik.errors.category}
            />
            <InputField
              name='service'
              label='Service'
              placeholder='Enter service'
              isRequired
              value={formik.values.service}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.service && formik.errors.service}
            />
            <InputField
              name='tenure'
              label='Tenure'
              type='select'
              options={tenureOptions}
              isRequired
              value={formik.values.tenure}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tenure && formik.errors.tenure}
            />
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
              name='description'
              label='Description'
              placeholder='Enter description'
              isRequired
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && formik.errors.description}
            />
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
    </div>
  );
};

export default Subscription;
