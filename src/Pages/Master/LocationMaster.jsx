import React, { useEffect, useMemo, useState } from 'react';
import { Table2 } from '../../Components/Table/Table2';
import { FaRegEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import DeleteModal from '../../Components/DeleteModal';
import SidebarField from '../../Components/SideBarField';
import Button from '../../Components/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import InputField from '../../Components/InputField';
import { MasterApi } from '../../Api/Master.api';
import { toast } from 'react-toastify';
import { useLoading } from '../../Components/loader/LoaderContext';

const locationValidationSchema = Yup.object().shape({
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  streetName: Yup.string().required('Street name is required'),
  landmark: Yup.string().required('landmark is required'),
});

const LocationMaster = () => {
  const [mapCenter, setMapCenter] = useState([25.276987, 55.296249]); // Default: Dubai
  const [selectedCoordinates, setSelectedCoordinates] = useState(mapCenter);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [countryId, setCountryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { handleLoading } = useLoading();
  console.log('mapCenter:', mapCenter);

  useEffect(() => {
  formik.setFieldValue('location', mapCenter);
}, [mapCenter]);


  const handleCountry = async () => {
    try {
      const res = await MasterApi.country();
      setCountryData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const LocationMarker = ({ setCoordinates }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates([lat, lng]);
        setMapCenter([lat, lng]);
        
      },
    });

    return null;
  };

  const handleGetMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setSelectedCoordinates([latitude, longitude]);
        },
        (err) => {
          toast.error('Failed to fetch your location');
          console.error('Geolocation error:', err);
        }
      );
    } else {
      toast.warn('Geolocation is not supported by your browser');
    }
  };

  const getCoordinates = async (address) => {
    console.log('address for coordinates:', address);

    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data?.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  };

  const fetchCityIfEditing = async (id) => {
    if (id) {
      try {
        const res = await MasterApi.city(id);
        setCityData(res.data?.data || []);
      } catch (err) {
        console.log('Error fetching city:', err);
      }
    }
  };

  useEffect(() => {
    fetchCityIfEditing(selectedRow?.country?._id);
  }, [selectedRow?.country?._id]);

  const handleCountryChange = async (e) => {
    const selectedCountryId = e.target.value;
    setCountryId(selectedCountryId);
    formik.setFieldValue('country', selectedCountryId);
    getCityById(selectedCountryId);
    //  if (selectedCountryId) {
    //    try {
    //      const res = await MasterApi.city(selectedCountryId);
    //      setCityData(res.data?.data);
    //    } catch (err) {
    //      console.log(err);
    //    }
    //  }
  };
  const getCityById = async (selectedCountryId) => {
    if (selectedCountryId) {
      try {
        const res = await MasterApi.city(selectedCountryId);
        setCityData(res.data?.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const countryOptions = countryData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const cityOptions = cityData.map((item) => ({
    value: item?._id,
    label: item?.name,
  }));

  const getAllLocations = async () => {
    try {
      handleLoading(true);
      const res = await MasterApi.getAllLocation();
      setLocationData(res?.data?.data?.allLocationMasters || []);
      //   console.log(res?.data?.data?.allLocationMasters);
    } catch (err) {
      console.error('Error fetching locations:', err);
      toast.error('Failed to fetch locations');
    } finally {
      handleLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await MasterApi.deleteLocation(deleteModal._id);
      toast.success('Location deleted successfully');
      getAllLocations();
      setDeleteModal(null);
    } catch (err) {
      console.error('Error deleting:', err);
      toast.error(err.response?.data?.message || 'Failed to delete location');
    } finally {
      setIsLoading(false);
    }
  };
  console.log('selectedRow:', selectedRow);

  const columns = useMemo(
    () => [
      {
        headerName: 'Country',
        field: 'country',
        minWidth: 160,
        cellRenderer: (params) => params.data.Country?.name || 'N/A',
      },
      {
        headerName: 'City',
        field: 'city',
        minWidth: 160,
        cellRenderer: (params) => params.data.City?.name || 'N/A',
      },
      {
        headerName: 'Land Mark',
        field: 'landmark',
        minWidth: 100,
      },
      {
        headerName: 'Street Name',
        field: 'streetName',
        minWidth: 180,
      },
      {
      headerName: 'Coordinates',
      field: 'location',
      minWidth: 200,
      cellRenderer: (params) => {
        const coords = params.data?.location?.coordinates;
        if (Array.isArray(coords) && coords.length === 2) {
          return `Lat: ${coords[1]}, Lng: ${coords[0]}`;
        }
        return 'N/A';
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
                setSelectedRow(params.data);
              }}
            >
              <FaRegEdit />
            </button>
            <button
              className='px-4 rounded cursor-pointer text-red-500'
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

  const formik = useFormik({
  initialValues: {
    country: selectedRow?.Country?._id || selectedRow?.country || '',
    city: selectedRow?.city?._id || selectedRow?.city || '',
    streetName: selectedRow?.streetName || '',
    landmark: selectedRow?.landmark || '',
     location: {
      type: 'Point',
      coordinates: selectedRow?.location,
    },
  },
  validationSchema: locationValidationSchema,
  enableReinitialize: true,
  onSubmit: async (values) => {
    try {
      const res = selectedRow?._id
        ? await MasterApi.updateLocation(selectedRow._id, values)
        : await MasterApi.createLocation(values);

      toast.success(res?.data?.message || 'Location saved successfully');
      getAllLocations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong while saving location');
      console.error('Location Error:', err);
    }

    setOpen(false);
    setSelectedRow(null);
    formik.resetForm();
  },
});


  useEffect(() => {
    const countryId = selectedRow?.country?._id || selectedRow?.country;

    if (countryId) {
      getCityById(countryId);
      console.log('Fetched cities for countryId:', countryId);
    }
  }, [selectedRow]);

  useEffect(() => {
    const { country, city, streetName } = formik.values;

    if (country && city) {
      const countryName = countryData.find((c) => c._id === country)?.name || '';
      const cityName = cityData.find((c) => c._id === city)?.name || '';
      const addressParts = [streetName, cityName, countryName].filter(Boolean);
      const fullAddress = addressParts.join(', ');
      if (fullAddress.length > 0) {
        getCoordinates(fullAddress);
      }
    }
  }, [formik.values.country, formik.values.city, formik.values.streetName]);

  useEffect(() => {
    getAllLocations();
    handleCountry();
  }, []);

  return (
    <>
      <div className='p-5'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-4xl font-bold text-primary'>Location Master</h2>
        </div>

        <Table2
          column={columns}
          internalRowData={locationData}
          searchLabel='Location'
          sheetName='Location Master'
          setModalOpen={setOpen}
          isAdd={true}
          setSelectedRow={setSelectedRow}
        />

        {open && (
          <SidebarField
            title={selectedRow ? 'Edit Location' : 'Add New Location'}
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

              {/* <InputField
                name='pin'
                label='Pin Code'
                placeholder='Enter pin code'
                value={formik.values.pin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pin && formik.errors.pin}
              /> */}

              <InputField
                name='landmark'
                label='Landmark'
                placeholder='Enter Landmark'
                value={formik.values.landmark}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.landmark && formik.errors.landmark}
              />

              <InputField
                name='streetName'
                label='Street Name'
                placeholder='Enter street name'
                value={formik.values.streetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.streetName && formik.errors.streetName}
              />

              <div className='flex justify-end mb-2'>
                <Button type='button' onClick={handleGetMyLocation} text='Get My Location' />
              </div>

              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '300px', width: '100%', borderRadius: '12px' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker position={mapCenter}>
                  <Popup>Selected Location</Popup>
                </Marker>
                <LocationMarker setCoordinates={setSelectedCoordinates} />
              </MapContainer>
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

export default LocationMaster;
