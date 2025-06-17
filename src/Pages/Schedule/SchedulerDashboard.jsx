import React, { useState, useMemo, useEffect } from "react";
import { addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment/moment";
import InputField from "../../Components/InputField";
import UpdateOrderModal from "./UpdateOrderModal";
import { colors } from "../../Components/SlotManagement/constants";
import DateNavigation from "../../Components/SlotManagement/DateNavigation";
import HolidayBanner from "../../Components/SlotManagement/HolidayBanner";
import TimeColumn from "../../Components/SlotManagement/TimeColumn";
import GroomerHeader from "../../Components/SlotManagement/GroomerHeader";
import AppointmentSlot from "../../Components/SlotManagement/AppointmentSlot";
import { useSchedulerApi } from "../../hooks/useSchedulerApi";

const Scheduler = ({ groomers }) => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedService, setSelectedService] = useState("");
  const [selectedSubService, setSelectedSubService] = useState("");

  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const {
    servicesData,
    subService,
    appointments,
    existingSlot,
    holidays,
    fetchSubServices,
    fetchSlots,
    setExistingSlot,
    setAppointments,
    defaultServiceId,
    defaultSubServiceId,
  } = useSchedulerApi(currentDate, selectedSubService);

  useEffect(() => {
    if (defaultServiceId && defaultSubServiceId) {
      setSelectedService(defaultServiceId);
      setSelectedSubService(defaultSubServiceId);
    }
  }, [defaultSubServiceId]);

  // Process time slots
  const timeSlots = useMemo(() => {
    return existingSlot.map((slot) => {
      const startDate = new Date(slot.startTime);
      const endDate = new Date(slot.endTime);

      const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
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
  }, [existingSlot]);

  const handleDateNavigation = (days) => {
    setCurrentDate(addDays(currentDate, days));
  };

  const handleDateChange = (date) => {
    setCurrentDate(new Date(date));
  };

  const handleSlotClick = (groomer, timeSlot, appointment) => {
    if (holidays?.isClosed) return;
    setSelectedSlot(appointment || { groomer, timeSlot });
    setIsModalOpen(true);
  };

  const getCoveringAppointment = (groomer, timeSlot) => {
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

  const isSlotAvailable = (groomer, timeSlot) => {
    if (holidays?.isClosed) return false;
    return !getCoveringAppointment(groomer, timeSlot);
  };

  return (
    <div className="mx-auto p-4" style={{ backgroundColor: colors.white }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div className="flex gap-2">
          <InputField
            label="Service Type"
            name="servicesId"
            type="select"
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              fetchSubServices(e.target.value);
              setExistingSlot([]);
              setSelectedSubService([]);
              setAppointments([]);
            }}
            isRequired
            className=""
            labelClassName="text-sm"
            placeholder="Select a Service"
            options={servicesData.map((service) => ({
              value: service._id,
              label: `${service?.name}`,
            }))}
          />
          <InputField
            label="Subservice Type"
            type="select"
            value={selectedSubService}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedSubService(value);
              fetchSlots(value);
            }}
            isRequired
            labelClassName="text-sm"
            placeholder="Select a subservice"
            options={subService?.map((service) => ({
              value: service._id,
              label: `${service.name}`,
            }))}
          />
        </div>

        <DateNavigation
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onNavigate={handleDateNavigation}
        />
      </motion.div>

      <HolidayBanner holiday={holidays} />

      {/* Scheduler Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-lg shadow overflow-hidden border relative"
        style={{
          backgroundColor: colors.white,
          borderColor: colors.accent,
        }}
      >
        <TimeColumn timeSlots={timeSlots} />

        {/* Scrollable Content Area */}
        <div className="ml-[150px] overflow-x-auto">
          <GroomerHeader groomers={groomers} />

          {/* Appointment Slots */}
          <div
            className="flex"
            style={{
              minWidth:
                groomers.length > 4 ? `${groomers.length * 200}px` : "100%",
            }}
          >
            {groomers?.map((groomer) => (
              <div
                key={groomer.id}
                className="border-r"
                style={{
                  flex: groomers.length <= 4 ? "1" : "0 0 200px",
                }}
              >
                <div className="flex-1 overflow-y-auto">
                  {timeSlots.length > 0 ? (
                    <div className="space-y-0">
                      {timeSlots.map((timeSlot) => {
                        const appointment = getCoveringAppointment(
                          groomer,
                          timeSlot
                        );
                        const slotTime = moment(new Date(timeSlot.slot));
                        const isStartOfAppointment =
                          appointment &&
                          moment
                            .utc(appointment.startTime)
                            .local()
                            .isSame(slotTime, "minute");
                        const isAvailable = isSlotAvailable(groomer, timeSlot);
                        const apptDuration = appointment
                          ? moment
                              .utc(appointment.endTime)
                              .local()
                              .diff(
                                moment.utc(appointment.startTime).local(),
                                "minutes"
                              )
                          : 0;
                        const slotHeight =
                          apptDuration >= 60
                            ? `${(apptDuration / 60) * 4.8}rem`
                            : "5rem";

                        if (showAvailableOnly && !isAvailable && !appointment) {
                          return null;
                        }

                        return (
                          <AppointmentSlot
                            key={`${groomer.id}-${timeSlot.id}`}
                            groomer={groomer}
                            timeSlot={timeSlot}
                            appointment={appointment}
                            isAvailable={isAvailable}
                            isStartOfAppointment={isStartOfAppointment}
                            slotHeight={slotHeight}
                            onSlotClick={handleSlotClick}
                            isHoliday={holidays?.isClosed}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 text-center p-4">
                        No time slots available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <UpdateOrderModal
        timeSlot={timeSlots}
        selectedSlot={selectedSlot}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchSlots={fetchSlots}
        setCurrentDate={setCurrentDate}
      />
    </div>
  );
};

export default Scheduler;
