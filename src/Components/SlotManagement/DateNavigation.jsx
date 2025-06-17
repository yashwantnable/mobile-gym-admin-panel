import React from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

const DateNavigation = ({ currentDate, onDateChange, onNavigate }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onNavigate(-1)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <FiChevronLeft size={20} />
      </button>

      <div className="flex items-center border rounded-md overflow-hidden">
        <FiCalendar className="ml-3" />
        <input
          type="date"
          value={format(currentDate, 'yyyy-MM-dd')}
          onChange={(e) => onDateChange(e.target.value)}
          className="py-2 px-3 focus:outline-none"
        />
      </div>

      <button
        onClick={() => onNavigate(1)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default DateNavigation;