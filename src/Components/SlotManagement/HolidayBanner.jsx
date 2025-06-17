import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { colors } from './constants';

const HolidayBanner = ({ holiday }) => {
  if (!holiday || !holiday.isClosed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      className="mb-4 p-3 rounded-md flex items-start gap-3 overflow-hidden"
      style={{
        backgroundColor: colors.secondaryLight,
        borderLeft: `4px solid ${colors.error}`,
      }}
    >
      <div className="mt-0.5">
        <FiInfo size={20} style={{ color: colors.error }} />
      </div>
      <div>
        <h3 className="font-bold" style={{ color: colors.primary }}>
          {holiday.name}
        </h3>
        <p style={{ color: colors.primary }}>
          We are closed today. No appointments available.
        </p>
      </div>
    </motion.div>
  );
};

export default HolidayBanner;