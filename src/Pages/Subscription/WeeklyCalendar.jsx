import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';

const WeeklyCalendar = ({ currentDate, onDateClick, getItemsForDate, colorClass, activeTab }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date(currentDate));
  
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const formatDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const weekDates = getWeekDates(currentWeek);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00', '21:00'
  ];

  const formatTime = (time) => {
    const hour = parseInt(time.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getItemsForTimeSlot = (date, timeSlot) => {
    const dateStr = formatDateString(date);
    const items = getItemsForDate(dateStr);
    
    if (activeTab === 'classes') {
      return items.filter(item => item.slot === timeSlot);
    }
    return items;
  };

  const renderSubscriptionRange = (subscription, date) => {
    const dateStr = formatDateString(date);
    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    const currentDate = new Date(dateStr);
    
    let position = '';
    if (currentDate.getTime() === startDate.getTime()) position += ' rounded-l-lg border-l-2';
    if (currentDate.getTime() === endDate.getTime()) position += ' rounded-r-lg border-r-2';
    if (currentDate > startDate && currentDate < endDate) position += ' border-t-2 border-b-2';
    
    return (
      <div
        key={subscription.id}
        className={`${colorClass} p-2 mb-1 text-xs font-medium border-2 ${position} cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={() => onDateClick(dateStr)}
        title={`${subscription.name} - $${subscription.price}`}
      >
        <div className="truncate font-semibold">{subscription.name}</div>
        <div className="text-xs opacity-75">${subscription.price}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
        <button
          onClick={() => navigateWeek(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={() => navigateWeek(1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        {activeTab === 'classes' ? (
          // Time-slot based view for classes
          <div className="min-w-full">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b bg-gray-50">
              <div className="p-3 text-sm font-medium text-gray-600 border-r">Time</div>
              {weekDates.map((date, index) => (
                <div key={index} className={`p-3 text-center border-r ${isToday(date) ? 'bg-blue-50' : ''}`}>
                  <div className="text-sm font-medium text-gray-600">{dayNames[index]}</div>
                  <div className={`text-lg font-bold ${isToday(date) ? 'text-blue-600' : 'text-gray-800'}`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 border-b hover:bg-gray-50">
                <div className="p-3 text-sm font-medium text-gray-600 border-r bg-gray-50 flex items-center">
                  <Clock size={14} className="mr-2" />
                  {formatTime(timeSlot)}
                </div>
                {weekDates.map((date, index) => {
                  const dateStr = formatDateString(date);
                  const items = getItemsForTimeSlot(date, timeSlot);
                  
                  return (
                    <div
                      key={index}
                      className="p-2 border-r min-h-[80px] cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => onDateClick(dateStr)}
                    >
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`${colorClass} p-2 mb-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                          title={`${item.name} - ${item.trainer} - $${item.price}`}
                        >
                          <div className="font-semibold truncate">{item.name}</div>
                          <div className="flex items-center text-xs opacity-75 mt-1">
                            <User size={10} className="mr-1" />
                            <span className="truncate">{item.trainer}</span>
                          </div>
                          <div className="flex items-center text-xs opacity-75">
                            <MapPin size={10} className="mr-1" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          // Day-based view for subscriptions and packages
          <div className="grid grid-cols-7">
            {weekDates.map((date, index) => {
              const dateStr = formatDateString(date);
              const items = getItemsForDate(dateStr);
              
              return (
                <div
                  key={index}
                  className={`p-3 border-r border-b min-h-[200px] cursor-pointer hover:bg-gray-50 transition-colors ${
                    isToday(date) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onDateClick(dateStr)}
                >
                  <div className="text-center mb-3">
                    <div className="text-sm font-medium text-gray-600">{dayNames[index]}</div>
                    <div className={`text-lg font-bold ${isToday(date) ? 'text-blue-600' : 'text-gray-800'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {activeTab === 'subscriptions' ? (
                      items.map((item) => renderSubscriptionRange(item, date))
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className={`${colorClass} p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                          title={`${item.name} - ${item.numberOfClasses} classes - $${item.price}`}
                        >
                          <div className="font-semibold truncate">{item.name}</div>
                          <div className="text-xs opacity-75">{item.numberOfClasses} classes</div>
                          <div className="text-xs opacity-75">${item.price}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyCalendar;