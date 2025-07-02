import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { BookingApi } from "../../Api/Booking.api";
import { toast } from "react-toastify";
import { useLoading } from "../../Components/loader/LoaderContext";
import './CustomCalendar.css'; // You'll need to create this CSS file

const Scheduler = () => {
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);
    const { handleLoading } = useLoading();

    const getBookings = async () => {
        try {
            handleLoading(true);
            const res = await BookingApi.getAllBooking();
            const bookingsData = res?.data?.data || [];
            console.log("booking:",res?.data?.data);
            
            setBookings(bookingsData);
            const calendarEvents = convertBookingsToEvents(bookingsData);
            setEvents(calendarEvents);
        } catch (err) {
            toast.error("Error loading bookings");
        } finally {
            handleLoading(false);
        }
    };

   const convertBookingsToEvents = (bookings) => {
    const events = [];
    const seenSubscriptions = new Set();
    
    bookings?.forEach((booking) => {
        const subscription = booking.subscription;
        if (!subscription || !subscription.date || subscription.date.length !== 2) return;

        if (seenSubscriptions.has(subscription._id)) return;
        seenSubscriptions.add(subscription._id);

        const { name, startTime, endTime } = subscription;
        const startDate = new Date(subscription.date[0]);
        const endDate = new Date(subscription.date[1]);
        
        // Add 1 day to make the end date inclusive
        const inclusiveEndDate = new Date(endDate);
        inclusiveEndDate.setDate(endDate.getDate() + 1);

        events.push({
            id: subscription._id,
            title: name,
            start: startDate,
            end: inclusiveEndDate,  // Now includes the last day
            extendedProps: {
                type: booking.type || 'general',
                details: booking.details || '',
            },
        });
    });

    return events;
};

    const renderEventContent = (eventInfo) => {
        const eventType = eventInfo.event.extendedProps.type;
        const details = eventInfo.event.extendedProps.details;
        
        return (
            <div className={`custom-event ${eventType.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="event-title">{eventInfo.event.title}</div>
                {details && <div className="event-details">{details}</div>}
                <div className="event-dates">
                    {eventInfo.event.start.toLocaleDateString()} - {eventInfo.event.end.toLocaleDateString()}
                </div>
            </div>
        );
    };

    useEffect(() => {
        getBookings();
    }, []);

    return (
        <div className="w-[90%] mx-auto">
            <div className='flex justify-between items-center mb-4'>
          <h2 className='text-4xl font-bold text-primary'>Session Calender</h2>
        </div>
            
            <div className="upcoming-events-section">
                {/* <h2 className=''>Upcoming Holiday</h2> */}
                {events.filter(e => e.extendedProps.type === 'Bereavement Leave').slice(0, 1).map(event => (
                    <div key={event.id} className="upcoming-event">
                        <div className="event-person">{event.title}</div>
                        <div className="event-type">{event.extendedProps.type}</div>
                        <div className="event-dates">
                            From: {event.start.toLocaleDateString()} To: {event.end.toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: ''
                }}
                events={events}
                eventDisplay="block"
                eventContent={renderEventContent}
                height="auto"
            />
{/* 
            <div className="calendar-legend">
                <h3>Legend</h3>
                <div className="legend-item">
                    <span className="legend-color bereavement-leave"></span>
                    <span>Bereavement Leave</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color grand-game"></span>
                    <span>Grand Game</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color out-of-station"></span>
                    <span>Out of Station</span>
                </div>
            </div> */}
        </div>
    );
};

export default Scheduler;