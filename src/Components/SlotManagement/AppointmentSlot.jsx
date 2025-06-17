import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiMapPin } from 'react-icons/fi';
import { colors } from './constants';
import moment from 'moment';

const AppointmentSlot = ({
  groomer,
  timeSlot,
  appointment,
  isAvailable,
  isStartOfAppointment,
  slotHeight,
  onSlotClick,
  isHoliday,
}) => {
  if (isHoliday) {
    return (
      <motion.div
        key={`${groomer.id}-${timeSlot.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='h-16 border-b border-r border-gray-200 p-1 bg-red-50 text-red-500 text-xs flex items-center justify-center'
      >
        Closed
      </motion.div>
    );
  }

  if (appointment && isStartOfAppointment) {
    return (
      <motion.div
        key={`${groomer.id}-${appointment.orderId}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: slotHeight }}
        transition={{ duration: 0.2 }}
        onClick={() => onSlotClick(groomer, timeSlot, appointment)}
        className='border-b border-r border-gray-200 p-1 cursor-pointer overflow-hidden'
        style={{
          backgroundColor: colors.accentLight,
          borderLeft: `4px solid ${colors.primary}`,
        }}
      >
        <div
          className='text-xs p-2 rounded h-full flex flex-col'
          style={{ backgroundColor: colors.accent }}
        >
          <div className='flex justify-between items-start'>
            <div className='space-y-1'>
              <div className='flex items-start'>
                <span className='font-medium mr-1' style={{ color: colors.primaryLight }}>
                  Customer:
                </span>
                <span className='font-medium truncate' style={{ color: colors.primary }}>
                  {appointment.customerName.split(' ')[0]}
                </span>
              </div>
              <div className='flex items-start'>
                <span className='font-medium mr-1' style={{ color: colors.primaryLight }}>
                  Pet:
                </span>
                <span className='truncate capitalize' style={{ color: colors.primary }}>
                  {appointment.petName.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
          <div className='text-xs mt-2 flex items-center' style={{ color: colors.primaryLight }}>
            <FiClock className='mr-1' size={12} />
            {moment(appointment.startTime).local().format('hh:mm A')} -{' '}
            {moment(appointment.endTime).local().format('hh:mm A')}
          </div>
          {appointment.travelTime && (
            <div
              className='mt-auto text-xs flex items-center'
              style={{ color: colors.primaryLight }}
            >
              <FiMapPin className='mr-1' size={12} />
              Travel time: {appointment.travelTime}min
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (isAvailable) {
    return (
      <motion.div
        key={`${groomer.id}-${timeSlot.id}`}
        whileHover={{ scale: 0.98 }}
        whileTap={{ scale: 0.95 }}
        // onClick={() => onSlotClick(groomer, timeSlot)}
        className='h-28 border-b border-r border-gray-200 flex items-center justify-center'
        style={{
          backgroundColor: colors.white,
          border: `1px dashed ${colors.primary}`,
          color: colors.primary,
        }}
      >
        <div className='text-center text-xs'>
          <div className='font-medium'>Available</div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      key={`${groomer.id}-${timeSlot.id}`}
      className='h-16 border-b border-r border-gray-200'
      style={{ backgroundColor: colors.white }}
    >
      &nbsp;
    </div>
  );
};

export default AppointmentSlot;
