import React from 'react';

const PriceDisplay = ({ label, value, note = '' }) => {
    return (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-lg font-bold text-gray-900">${value}</span>
            </div>
            {note && <div className="text-xs text-gray-500 mt-1">{note}</div>}
        </div>
    );
};

export default PriceDisplay;