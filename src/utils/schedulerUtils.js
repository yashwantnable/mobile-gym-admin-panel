import moment from 'moment';

export const getTimeSlots = (existingSlot = []) => {
  return existingSlot.map((slot) => {
    const startDate = new Date(slot.startTime);
    const endDate = new Date(slot.endTime);

    const formatTime = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    };

    return {
      id: slot?._id,
      hour: startDate.getHours() % 12 || 12,
      minutes: startDate.getMinutes(),
      time: formatTime(startDate),
      endTime: formatTime(endDate),
      slot: startDate,
    };
  });
};

export const getCoveringAppointment = (appointments, groomer, timeSlot) => {
  const slotTime = moment(new Date(timeSlot.slot));
  return appointments.find((appt) => {
    const apptStart = moment.utc(appt.startTime).local();
    const apptEnd = moment.utc(appt.endTime).local();
    return (
      appt.groomerId === groomer._id &&
      slotTime.isSameOrAfter(apptStart) &&
      slotTime.isBefore(apptEnd)
    );
  });
};

export const isSlotAvailable = (appointments, holidays, groomer, timeSlot) => {
  if (holidays?.isClosed) return false;
  return !getCoveringAppointment(appointments, groomer, timeSlot);
};
