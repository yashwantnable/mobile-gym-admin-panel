import React, { useEffect, useMemo, useState } from 'react';
import { Table2 } from '../../Components/Table/Table2';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import DeleteModal from '../../Components/DeleteModal';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from '../../Components/InputField';
import { MasterApi } from '../../Api/Master.api';
import { toast } from 'react-toastify';
import { useLoading } from '../../Components/loader/LoaderContext';

const policyValidationSchema = Yup.object().shape({

  title: Yup.string().required('Title is required').min(3, 'Title too short'),
  content: Yup.string()
    .required('Content is required')
    .min(20, 'Content must be at least 20 characters'),
  version: Yup.string().required('Version is required'),
  is_active: Yup.boolean(),
});

const PolicyMaster = () => {
  const [activeTab, setActiveTab] = useState('PRIVACY');
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policyData, setPolicyData] = useState([]);
  const [termsData, setTermsData] = useState([]);
  const { handleLoading } = useLoading();

  // ✅ Fetch All Policies (from API)
  const getAllTerms = async () => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllTerms();
      setTermsData(res?.data?.data || []);
      console.log("terms:",res?.data?.data)
    } catch (err) {
      console.error('Error fetching policies:', err);
      toast.error('Failed to fetch policies');
    } finally {
      handleLoading(false);
    }
  };

  const getAllPolicies = async () => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllPolicies();
      setPolicyData(res?.data?.data || []);
      console.log(res?.data?.data);
    } catch (err) {
      console.error('Error fetching policies:', err);
      toast.error('Failed to fetch policies');
    } finally {
      handleLoading(false);
    }
  };

  // ✅ Delete Policy
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteTermsNpolicy(deleteModal._id); // 🔹 changed
      toast.success('Policy deleted successfully');
      getAllPolicies();
      getAllTerms();
      setDeleteModal(null);
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error(err.response?.data?.message || 'Failed to delete PRIVACY');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Table Columns
const columns = useMemo(
  () => [
    { headerName: "Type", field: "type", minWidth: 120 },
    { headerName: "Title", field: "title", minWidth: 200 },
   {
  headerName: "Content",
  field: "content",
  minWidth: 300,
  flex: 1,
  renderCell: (params) => {
    const text = params.value || "";
    return text.length > 10 ? text.substring(0, 100) + "..." : text;
  },
},
    {
      headerName: "Created At",
      field: "createdAt",
      minWidth: 180,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      headerName: "Actions",
      field: "actions",
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="text-xl flex items-center gap-3 py-2">
          <button
            className="rounded cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => {
              setOpen(true);
              setSelectedRow(params.data);
            }}
          >
            <FaRegEdit />
          </button>
          <button
            className="rounded cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => {
              setOpen(false);
              setDeleteModal(params.data);
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

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      type: selectedRow?.type || activeTab.toUpperCase(), // auto-select based on tab
      title: selectedRow?.title || '',
      content: selectedRow?.content || '',
      version: selectedRow?.version || '1.0',
      // is_active: selectedRow?.is_active || false,
    },
    validationSchema: policyValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // always override type with activeTab
        const finalValues = {
          ...values,
          type: activeTab.toUpperCase(), // ensures correct type
        };

        const res = selectedRow?._id
          ? await MasterApi.updateTermsNpolicy(selectedRow._id, finalValues)
          : await MasterApi.createTermsNpolicy(finalValues);

        toast.success(res?.data?.message || 'Policy saved successfully');
        getAllPolicies();
        getAllTerms();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong while saving PRIVACY');
        console.error('Policy Error:', err);
      }
      setOpen(false);
      setSelectedRow(null);
      formik.resetForm();
    },
  });

  useEffect(() => {
    getAllPolicies();
    getAllTerms();
  }, []);

  return (
    <>
      <div className='p-5'>
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-4xl font-bold text-primary'>Policy Master</h2>
          </div>

          <div className='flex border-b border-gray-200 mb-4'>
            <button
              onClick={() => setActiveTab('PRIVACY')}
              className={`px-6 py-2 font-medium text-sm focus:outline-none ${
                activeTab === 'PRIVACY'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-2 font-medium text-sm focus:outline-none ${
                activeTab === 'terms'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Terms & Conditions
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'PRIVACY' && (
            <Table2
              column={columns}
              internalRowData={[policyData]}
              searchLabel={'Policy'}
              sheetName={'Policy Master'}
              setModalOpen={setOpen}
              isAdd={true}
              setSelectedRow={setSelectedRow}
            />
          )}

          {activeTab === 'terms' && (
            <Table2
              column={columns}
              internalRowData={[termsData]}
              searchLabel={'Terms'}
              sheetName={'Terms Master'}
              setModalOpen={setOpen}
              isAdd={true}
              setSelectedRow={setSelectedRow}
            />
          )}
        </div>

        {open && (
          <SidebarField
            title={
              selectedRow
                ? activeTab === 'PRIVACY'
                  ? 'Edit Policy'
                  : 'Edit Terms'
                : activeTab === 'PRIVACY'
                  ? 'Add New Policy'
                  : 'Add New Terms'
            }
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
              <div className='space-y-4'>
                {/* Type field - auto selects based on activeTab */}
                {/* <InputField
                  name='type'
                  label='Policy Type'
                  type='select'
                  options={[
                    { value: 'TERMS', label: 'Terms & Conditions' },
                    { value: 'PRIVACY', label: 'Privacy Policy' },
                  ]}
                  isRequired
                  value={
                    selectedRow
                      ? formik.values.type // keep existing if editing
                      : activeTab === 'PRIVACY'
                        ? 'PRIVACY'
                        : 'TERMS'
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.type && formik.errors.type}
                /> */}

                <InputField
                  name='title'
                  label='Title'
                  placeholder={activeTab === 'PRIVACY' ? 'Enter Privacy Policy title' : 'Enter terms title'}
                  isRequired
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && formik.errors.title}
                />

                <InputField
                  name='content'
                  label='Content'
                  type='textarea'
                  placeholder={
                    activeTab === 'PRIVACY'
                      ? 'Enter full Privacy Policy content'
                      : 'Enter full terms content'
                  }
                  rows={6}
                  isRequired
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.content && formik.errors.content}
                />

                <InputField
                  name='version'
                  label='Version'
                  placeholder='Enter version (e.g., 1.0)'
                  value={formik.values.version}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.version && formik.errors.version}
                />

                {/* <InputField
                  name='is_active'
                  label='Active Status'
                  type='checkbox'
                  checked={formik.values.is_active}
                  error={formik.touched.is_active && formik.errors.is_active}
                  onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                  onBlur={formik.handleBlur}
                /> */}
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

export default PolicyMaster;
