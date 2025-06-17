import React from "react";
import { FiFlag, FiX } from "react-icons/fi";

const HolidayModal = ({ holidayProps }) => {
  const {
    showHolidayModal,
    setShowHolidayModal,
    setHolidayReason,
    markHoliday,
    formik,
  } = holidayProps;
  return (
    <div>
      {showHolidayModal && (
        <div className="fixed inset-0 bg-gray-800/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Mark as Holiday
              </h2>
              <button
                onClick={() => setShowHolidayModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to mark this date as a holiday? No
                appointments will be available on this day.
              </p>

              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Holiday Reason <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="E.g., Christmas Day"
                  className="border rounded-lg px-3 py-2 w-full bg-white"
                  onChange={(e) => {
                    setHolidayReason(e.target.value);
                    console.log(e.target.value);
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowHolidayModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    formik.setFieldValue("isHoliday", true);
                    formik.setFieldValue("specificDate", true);
                    formik.setFieldValue("bookingDate", new Date());
                    markHoliday();
                    setShowHolidayModal(false);
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FiFlag /> Confirm Holiday
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayModal;
