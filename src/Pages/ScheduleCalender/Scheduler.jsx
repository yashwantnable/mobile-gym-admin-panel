import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { BookingApi } from "../../Api/Booking.api";
import { toast } from "react-toastify";
import { useLoading } from "../../Components/loader/LoaderContext";
import './CustomCalendar.css'; // You'll need to create this CSS file
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const Scheduler = () => {
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);
    const { handleLoading } = useLoading();
    

    const eventTypeColors = {
  'strength-training': { bg: '#3498db', text: '#ffffff', border: '#1a5276' },
  'voga-fitness': { bg: '#2ecc71', text: '#ffffff', border: '#27ae60' },
  'zumba-master-class': { bg: '#9b59b6', text: '#ffffff', border: '#8e44ad' },
  'bereavement-leave': { bg: '#e74c3c', text: '#ffffff', border: '#c0392b' },
  'yoga': { bg: '#f1c40f', text: '#333333', border: '#f39c12' },
  'pilates': { bg: '#1abc9c', text: '#ffffff', border: '#16a085' },
  'hiit': { bg: '#e67e22', text: '#ffffff', border: '#d35400' },
  'default': { bg: '#95a5a6', text: '#ffffff', border: '#7f8c8d' }
};

    const eventDidMount = (info) => {
        const { event } = info;
        const { title, start, end, extendedProps } = event;
        const { type, details } = extendedProps;
        
        // Format dates
        const startStr = start ? start.toLocaleDateString() : 'N/A';
        const endStr = end ? end.toLocaleDateString() : 'N/A';
        
        // Create tooltip content
        const tooltipContent = `
            <div class="custom-tooltip">
                <strong>${title || 'No title'}</strong><br/>
                <div><b>Type:</b> ${type || 'N/A'}</div>
                ${details ? `<div><b>Details:</b> ${details}</div>` : ''}
                <div><b>Dates:</b> ${startStr} - ${endStr}</div>
            </div>
        `;
        
        // Initialize tooltip
        tippy(info.el, {
            content: tooltipContent,
            allowHTML: true,
            theme: 'light-border',
            placement: 'top',
            delay: [100, 0],
            interactive: true,
            appendTo: () => document.body,
        });
    };

    const getBookings = async () => {
        try {
            handleLoading(true);
            const res = await BookingApi.getAllBooking();
            const bookingsData = res?.data?.data || [];
            console.log("booking:", res?.data?.data);
            
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
        console.log("eventInfo.event.extendedProps:",eventInfo.event.extendedProps);
        
        return (
            <div className={`custom-event ${eventType.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="text-primary text-lg text-center">{eventInfo.event.title}</div>
                {details && <div className="text-red-600">{details}</div>}
            </div>
        );
    };

    useEffect(() => {
        getBookings();
    }, []);

    return (
        <div className="w-[90%] mx-auto">
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-4xl font-bold text-primary'>Session Calendar</h2>
            </div>
            
            <div className="upcoming-events-section">
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
                eventDidMount={eventDidMount}
                eventDisplay="block"
                dayHeaderClassNames="custom-day-header"
                eventContent={renderEventContent}
                height="auto"
            />
        </div>
    );
};

export default Scheduler;