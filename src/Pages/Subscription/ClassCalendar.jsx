import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const formatClassEvents = (allClasses) => {
  return allClasses.flatMap((cls) => {
    return cls.date.map((dateStr) => {
      const start = `${dateStr.split('T')[0]}T${cls.startTime}`;
      const end = `${dateStr.split('T')[0]}T${cls.endTime}`;
      return {
        id: cls._id || cls.id,
        title: cls.name,
        start,
        end,
        extendedProps: cls,
      };
    });
  });
};

const renderEventContent = (eventInfo) => {
  const { extendedProps } = eventInfo?.event;
  console.log('extendedProps:', extendedProps);
  const coords = extendedProps?.Address?.location?.coordinates;

const latitude = coords?.[1];
const longitude = coords?.[0];

const isValidCoords = latitude !== undefined && longitude !== undefined;


  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className='font-semibold truncate bg-primary text-white cursor-pointer px-4 py-4 rounded-md'>
            {eventInfo?.event?.title}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side='top'
            className='bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-sm text-gray-700 w-72 z-50'
            sideOffset={8}
          >
            <div className='flex flex-col gap-2'>
             {isValidCoords && (
  <div className='w-full h-32 rounded-md overflow-hidden'>
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  </div>
)}


              <div className='text-base font-semibold text-gray-900'>{extendedProps?.name}</div>
              <div className='flex justify-between text-sm'>
                <span className='font-medium text-gray-600'>Trainer:</span>
                <span className='text-gray-800'>
                  {extendedProps?.trainer?.first_name} {extendedProps?.trainer?.last_name}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='font-medium text-gray-600'>Location:</span>
                <div className='text-right text-gray-800'>
                  {extendedProps?.Address?.streetName || '—'},{' '}
                  {extendedProps?.Address?.landmark || '—'},{' '}
                  {extendedProps?.Address?.city?.name || '—'}
                </div>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='font-medium text-gray-600'>Price:</span>
                <span className='text-gray-800'>₹{extendedProps?.price}</span>
              </div>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>Description:</span>
                <br />
                <span className='text-gray-700 line-clamp-2'>{extendedProps?.description}</span>
              </div>
            </div>
            <Tooltip.Arrow className='fill-white' />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const ClassCalendar = ({ allClasses }) => {
  const events = formatClassEvents(allClasses);

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventContent={renderEventContent}
        slotMinTime='06:00:00'
        slotMaxTime='22:00:00'
        height='auto'
      />
    </div>
  );
};

export default ClassCalendar;
