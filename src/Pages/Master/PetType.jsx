import React, { useEffect, useMemo, useState } from 'react';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MasterApi } from '../../Api/Master.api';
import { toast } from 'react-toastify';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import DeleteModal from '../../Components/DeleteModal';
import { Table2 } from '../../Components/Table/Table2';
import { useLoading } from '../../Components/loader/LoaderContext';

const PetType = () => {
  const [open, setOpen] = useState(false);
  const [petTypeData, setPetTypeData] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [deleteModal, setDeleteModal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { handleLoading } = useLoading();

  const petTypeColumns = useMemo(
    () => [
      {
        headerName: 'Pet Type Name',
        field: 'name',
        editable: true,
        cellRenderer: (params) => {
          const name = params.value || '';
          return name.charAt(0).toUpperCase() + name.slice(1);
        },
      },

      {
        headerName: 'Created At',
        field: 'createdAt',
        cellRenderer: (params) => {
          return new Date(params.value).toLocaleDateString();
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
    name: Yup.string().required('Pet type name is required'),
    isActive: Yup.boolean().default(true),
  });

  const formik = useFormik({
    initialValues: {
      _id: selectedRow?._id || '',
      name: selectedRow?.name || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('Submitted values:', values);
      try {
        const res = selectedRow
          ? await MasterApi.updatepetType(selectedRow?._id, values)
          : await MasterApi.createpetType(values);
        console.log('response of Pet Type:', res?.data?.data);
        toast.success('Pet type created successfully');
      } catch (err) {
        toast.error('error:', err);
      } finally {
        setOpen(false);
        setSelectedRow('');
        getAllpetType();
        formik.resetForm();
      }
    },
  });

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await MasterApi.deletepetType(deleteModal._id);
      if (res.status === 200) {
        toast.success('Pet Type deleted successfully');
      } else if (res.status === 203) {
        toast.error('Cannot delete pet type. It is referenced in one or more breeds.');
      }
      getAllpetType();
      setDeleteModal(false);
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllpetType = async () => {
    handleLoading(true);
    try {
      const res = await MasterApi.getAllpetType();
      console.log('All Pet Types', res?.data?.data);
      setPetTypeData(res?.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getAllpetType();
  }, []);

  return (
    <>
      <div className='p-5'>
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-4xl font-bold text-primary'>Pet Type Master</h2>
          </div>

          <Table2
            column={petTypeColumns}
            internalRowData={petTypeData}
            searchLabel={'Pet Type'}
            sheetName={'Pet Type'}
            setModalOpen={setOpen}
            setSelectedRow={setSelectedRow}
            isAdd={true}
          />
        </div>

        {open && (
          <SidebarField
            title='Add New Pet Type'
            handleClose={() => {
              setOpen(false);
              setSelectedRow('');
              formik.resetForm();
            }}
            button1={
              <Button
                onClick={formik.handleSubmit}
                text={selectedRow ? `Update` : `Save`}
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
                  label='Pet Type Name'
                  placeholder='Enter pet type (e.g., Dog, Cat)'
                  isRequired
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
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

export default PetType;
