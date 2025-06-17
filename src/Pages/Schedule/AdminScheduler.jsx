import { useState, useEffect } from "react";

import SlotManagement from "./SlotManagement";
import SchedulerDashboard from "./SchedulerDashboard";
// import { GroomerApi } from "../../Api/Groomer.api";
import { FiCalendar } from "react-icons/fi";
// import { useSchedulerApi } from "../../hooks/useSchedulerApi";

const AdminScheduler = () => {
  const [date, setDate] = useState(new Date());
  const [groomers, setGroomers] = useState([]);

  const fetchGroomers = async () => {
    try {
      const res = await GroomerApi.getAllGroomers();
      setGroomers(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching groomers:", error);
    }
  };
  useEffect(() => {
    // fetchGroomers();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center  gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiCalendar className="mr-2" />
            Scheduler
          </h1>
          <p className="text-gray-600 mt-1">
            {date.toLocaleDateString("en-AE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>
      <SlotManagement groomers={groomers}/>
      <SchedulerDashboard groomers={groomers} />
    </div>
  );
};

export default AdminScheduler;
