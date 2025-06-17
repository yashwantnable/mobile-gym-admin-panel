import React, { useEffect, useMemo, useState } from 'react';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { MasterApi } from '../../Api/Master.api';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import DeleteModal from '../../Components/DeleteModal';
import { Table2 } from '../../Components/Table/Table2';
import { useLoading } from '../../Components/loader/LoaderContext';

const BreedType = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [breedTypeData, setBreedTypeData] = useState([]);
  const [petTypes, setPetTypes] = useState('');
  const [deleteModal, setDeleteModal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { handleLoading } = useLoading();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteBreed(deleteModal._id);
      toast.success('Breed deleted successfully');
      getAllBreeds();
      setDeleteModal(null);
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error(err.response?.data?.message || 'Failed to delete pet');
    } finally {
      setIsLoading(false);
    }
  };

  const breedTypeColumns = useMemo(
    () => [
      {
        headerName: 'Breed Name',
        field: 'name',
        editable: true,
        cellRenderer: (params) => {
          const name = params.value || '';
          return name.charAt(0).toUpperCase() + name.slice(1);
        },
      },
      {
        headerName: 'Pet Type',
        field: 'petTypeId',
        cellRenderer: (params) => {
          const name = params?.value?.name || 'N/A';
          return name.charAt(0).toUpperCase() + name.slice(1);
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
                setSelectedRow(params?.data);
              }}
            >
              <FaRegEdit />
            </button>
            <button
              className='px-4 rounded cursor-pointer text-red-500'
              onClick={() => {
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Breed name is required'),
    petTypeId: Yup.string().required('choose a pet type'),
    // isActive: Yup.boolean().default(true),
  });

  const getAllBreeds = async () => {
    handleLoading(true);
    try {
      const res = await MasterApi.getAllBreed();
      console.log('All Breed Types', res?.data?.data);
      setBreedTypeData(res?.data?.data);
    } catch (err) {
      toast.error(err);
    }
    handleLoading(false);
  };

  const getAllPets = async () => {
    try {
      const res = await MasterApi.getAllpetType();
      console.log('get all pets:', res?.data?.data);
      setPetTypes(res?.data?.data);
    } catch (err) {
      toast.error(err);
    }
  };

  const formik = useFormik({
    initialValues: {
      // _id: selectedRow?._id||"",
      name: selectedRow?.name || '',
      petTypeId: selectedRow?.petTypeId?._id || '',
      // description: "",
      // isActive: true,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('Submitted values:', values);
      try {
        const res = selectedRow
          ? await MasterApi.updateBreed(selectedRow?._id, values)
          : await MasterApi.createBreed(values);
        console.log('response of Breed Type:', res?.data?.data);
        toast.success(res?.data?.data);
        getAllBreeds();
      } catch (err) {
        toast.error('error:', err);
      }
      setOpen(false);
      setSelectedRow();
      formik.resetForm();
    },
  });

  useEffect(() => {
    getAllPets();
    getAllBreeds();
  }, []);

  return (
    <>
      <div className='p-5'>
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-4xl font-bold text-primary'>Breed Type Master</h2>
          </div>

          <Table2
            column={breedTypeColumns}
            internalRowData={breedTypeData}
            searchLabel={'Breed'}
            sheetName={'Breed Type'}
            setModalOpen={setOpen}
            isAdd={true}
            setSelectedRow={setSelectedRow}
          />
        </div>

        {open && (
          <SidebarField
            title='Add New Breed Type'
            handleClose={() => {
              setOpen(false);
              setSelectedRow();
              formik.resetForm();
            }}
            button1={
              <Button
                onClick={formik.handleSubmit}
                text={selectedRow ? 'Update' : 'Save'}
                type='submit'
                disabled={!formik.isValid}
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
              <div className='space-y-4'>
                <InputField
                  name='name'
                  label='Breed Name'
                  placeholder='Enter breed name (e.g., Labrador Retriever)'
                  isRequired
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />

                <InputField
                  name='petTypeId'
                  label='Pet Type'
                  type='select'
                  options={petTypes.map((pt) => ({
                    label: pt.name,
                    value: pt._id,
                  }))}
                  isRequired
                  value={formik.values.petTypeId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.petTypeId && formik.errors.petTypeId}
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

export default BreedType;
