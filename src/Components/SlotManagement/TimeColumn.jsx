import React, { useState } from "react";
import { FiClock } from "react-icons/fi";
import { colors } from "./constants";
import { MdAutoDelete } from "react-icons/md";
import DeleteModal from "../DeleteModal";
import { SlotApi } from "../../Api/Slot.api";

const TimeColumn = ({ timeSlots }) => {
  const [openDeleteSlot, setOpenDeleteSlot] = useState(false);
  const [id, setId] = useState("");

  const handleDelete = async () => {
    try {
      await SlotApi.deleteTimeSlot(id);
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("timeSlots", timeSlots);

  return (
    <>
      <div className="absolute left-0 top-0 bottom-0 w-[150px] cursor-pointer  flex flex-col">
        <div
          className="p-3 border-b font-medium flex items-center justify-center pr-3 h-[78px]"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
          }}
        >
          <FiClock className="mr-2" />
          <span>Time</span>
        </div>

        <div
          className="flex-grow overflow-y-auto"
          style={{ backgroundColor: colors.gray }}
        >
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="h-28 border-b flex group items-center justify-end pr-3 text-xs"
              style={{ color: colors.primary }}
              onClick={() => {
                setOpenDeleteSlot(true);
                setId(slot.id);
              }}
            >
              <MdAutoDelete className="text-xl hidden group-hover:inline-block" />
              {slot.time} - {slot.endTime}
            </div>
          ))}
        </div>
        <DeleteModal
          deleteModal={openDeleteSlot}
          setDeleteModal={setOpenDeleteSlot}
          handleDelete={handleDelete}
          title="Delete Time slot"
        />
      </div>
    </>
  );
};

export default TimeColumn;
