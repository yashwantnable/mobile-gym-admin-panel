import React from 'react';
import { colors } from './constants';

const GroomerHeader = ({ groomers }) => {
  return (
    <div
      className="flex sticky top-0  h-[78px]"
      style={{
        backgroundColor: colors.primary,
        color: colors.white,
        minWidth: groomers.length > 4 ? `${groomers.length * 200}px` : '100%',
      }}
    >
      {groomers.map((groomer) => (
        <div
          key={groomer.id}
          className="p-3 text-center border-r flex flex-col justify-center"
          style={{
            flex: groomers.length <= 4 ? '1' : '0 0 200px',
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xl mb-1">{groomer.image}</span>
            <div className="font-medium capitalize">{groomer.first_name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroomerHeader;