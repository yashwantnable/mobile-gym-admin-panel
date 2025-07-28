import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { FaCalendarAlt, FaClock, FaClipboardList, FaCheckCircle, FaBolt, FaPlayCircle } from "react-icons/fa";
import { SubscriptionApi } from "../../Api/Subscription.api";
import { useLoading } from "../../Components/loader/LoaderContext";
import { useSelector, useDispatch } from "react-redux";
// import { Table2 } from "../../Components/Table/Table2";
import { FiEdit } from "react-icons/fi";
import { TrainerApi } from "../../Api/Trainer.api";
import { toast } from "react-toastify";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Helper functions to replace dayjs functionality
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getMonth = (dateString) => {
  return new Date(dateString).getMonth();
};

const isSameDay = (dateString1, dateString2) => {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const subtractDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const today = new Date().toISOString().split('T')[0];

// const dummyClasses = [
//   {
//     _id: "1",
//     date: today,
//     startTime: "09:00",
//     endTime: "10:00",
//     title: "Morning Yoga",
//     location: "Studio A",
//     status: "TODAY",
//   },
//   {
//     _id: "2",
//     date: today,
//     startTime: "17:00",
//     endTime: "18:00",
//     title: "Evening Cardio",
//     location: "Studio B",
//     status: "TODAY",
//   },
//   {
//     _id: "3",
//     date: addDays(today, 2),
//     startTime: "08:00",
//     endTime: "09:00",
//     title: "Pilates",
//     location: "Studio C",
//     status: "UPCOMING",
//   },
//   {
//     _id: "4",
//     date: subtractDays(today, 1),
//     startTime: "11:00",
//     endTime: "12:00",
//     title: "Strength Training",
//     location: "Studio D",
//     status: "COMPLETED",
//   },
//   {
//     _id: "5",
//     date: addDays(today, 10),
//     startTime: "15:00",
//     endTime: "16:00",
//     title: "Zumba",
//     location: "Studio A",
//     status: "UPCOMING",
//   },
//   {
//     _id: "6",
//     date: subtractDays(today, 15),
//     startTime: "07:00",
//     endTime: "08:00",
//     title: "HIIT",
//     location: "Studio B",
//     status: "COMPLETED",
//   },
//   {
//     _id: "7",
//     date: addDays(today, 20),
//     startTime: "18:00",
//     endTime: "19:00",
//     title: "Stretching",
//     location: "Studio C",
//     status: "UPCOMING",
//   },
//   {
//     _id: "8",
//     date: subtractDays(today, 30),
//     startTime: "10:00",
//     endTime: "11:00",
//     title: "Meditation",
//     location: "Studio D",
//     status: "COMPLETED",
//   },
// ];

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const formatTime12Hour = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

const TrainerDashboard = () => {
    const { handleLoading } = useLoading();
    const [open,setOpen]=useState();
    const [selectedRow ,setSelectedRow ]=useState();    
    const [trainerClasses, setTrainerClasses] = useState([]);     
    const [trainerStats, setTrainerStats] = useState([]);     
    const user = useSelector((state) => state?.store?.currentUser);
    const dispatch = useDispatch();
    console.log("user:",user);
    console.log("trainerStats:",trainerStats);
    
const getTrainerStatsDetails=async()=>{
  try{
    handleLoading(true);
    const res= await TrainerApi.getTrainerStats();
    setTrainerStats(res?.data?.data)
    console.log("trainer stats:",res?.data?.data)
  }catch(err){
    // toast.error("error:",err)
    console.error(err);
  }finally{
    handleLoading(false);
  }
}
  
const getClassesDetails = async (trainerId) => {
  try {
    handleLoading(true);
    const res = await SubscriptionApi.SubscriptionByTrainerId(trainerId);
    const rawClasses = res?.data?.data || [];

    const now = new Date();

    const transformed = rawClasses.map((cls) => {
      const dateStr = cls.date?.[0]; // Take first date from array
      const classDate = new Date(`${dateStr}T${cls.startTime}`);
      const classEndDate = new Date(`${dateStr}T${cls.endTime}`);

      let status = "UPCOMING";
      if (isSameDay(dateStr, today)) {
        status = "TODAY";
      }
      if (classEndDate < now) {
        status = "COMPLETED";
      }

      return {
        ...cls,
        date: dateStr, // Flatten date
        status,
      };
    });

    setTrainerClasses(transformed);
  } catch (err) {
    console.error(err);
  } finally {
    handleLoading(false);
  }
};

 const classes = trainerClasses || [];

  const now = new Date();
  const todayString = now.toISOString().split('T')[0];

  // Memoized filtered classes
  const upcoming = useMemo(
    () => classes.filter((c) => {
      const classDateTime = new Date(`${c.date}T${c.startTime}`);
      return classDateTime > now;
    }),
    [classes, now]
  );

  const todays = useMemo(
    () => classes.filter((c) => isSameDay(c.date, todayString)),
    [classes, todayString]
  );

  const completed = useMemo(
    () => classes.filter((c) => {
      const classDateTime = new Date(`${c.date}T${c.endTime}`);
      return classDateTime < now;
    }),
    [classes, now]
  );

  // Monthly counts for bar chart
  const monthlyCounts = useMemo(() => {
    const counts = Array(12).fill(0);
    classes.forEach((c) => {
      const month = getMonth(c.date);
      counts[month] += 1;
    });
    return counts;
  }, [classes]);

  // Status counts for pie chart
  const statusCounts = useMemo(() => {
    return classes.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});
  }, [classes]);

  // Color palette for charts
  const statusPalette = {
    COMPLETED: "rgba(79,70,229,0.8)",
    UPCOMING: "rgba(59,130,246,0.8)",
    TODAY: "rgba(16,185,129,0.8)",
  };

  // Chart data configurations
  const barData = {
    labels: months,
    datasets: [
      {
        label: "Sessions",
        data: monthlyCounts,
        backgroundColor: "rgba(16,185,129,0.8)",
        borderColor: "rgba(16,185,129,1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map((k) => statusPalette[k]),
        borderColor: Object.keys(statusCounts).map((k) => 
          statusPalette[k].replace("0.8", "1")
        ),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false } 
    },
    scales: { 
      y: { beginAtZero: true } 
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: "right" } 
    }
  };

  // Reusable components
  const SummaryCard = ({ icon: Icon, label, count, color }) => (
    <div className="flex items-center gap-4 bg-white shadow p-4 rounded-2xl">
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-3xl font-bold">{count}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const colorMap = {
      COMPLETED: "bg-indigo-100 text-indigo-700",
      UPCOMING: "bg-blue-100 text-blue-700",
      TODAY: "bg-emerald-100 text-emerald-700",
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colorMap[status]}`}>
        {status}
      </span>
    );
  };
const columns = useMemo(
    () => [
      {
        headerName: 'Class Name',
        field: 'name',
        cellRenderer: (params) => params?.data?.name || 'N/A',
      },
      {
        headerName: 'Category',
        field: 'category',
        cellRenderer: (params) => params?.data?.categoryId?.cName || 'N/A',
      },
      {
        headerName: 'Session Type',
        field: 'sessionType',
        cellRenderer: (params) => params?.data?.sessionType?.sessionName || 'N/A',
      },
      {
        headerName: 'Trainer',
        field: 'trainer',
        cellRenderer: (params) => {
          const trainer = params?.data?.trainer;
          return trainer ? `${trainer.first_name || ''} ${trainer.last_name || ''}`.trim() || 'N/A' : 'N/A';
        },
      },
      {
        headerName: 'Date',
        field: 'date',
        cellRenderer: (params) => {
          const dates = params?.data?.date;
          if (!dates?.length) return 'N/A';
          return new Date(dates[0]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        },
      },
      {
        headerName: 'Time',
        field: 'time',
        cellRenderer: (params) => {
          const start = params?.data?.startTime;
          const end = params?.data?.endTime;
          if (!start || !end) return 'N/A';
          return `${formatTime12Hour(start)} - ${formatTime12Hour(end)}`;
        },
      },
      {
        headerName: 'Price (AED)',
        field: 'price',
        cellRenderer: (params) => `AED ${params?.data?.price ?? 'N/A'}`,
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: (params) => {
          const isExpired = params?.data?.isExpired;
          return isExpired ? 'Expired' : 'Active';
        },
      },
      {
        headerName: 'Actions',
        field: 'actions',
        minWidth: 150,
        cellRenderer: (params) => (
          <div className='flex items-center space-x-3 mt-2'>
            <button
              className='text-primary transition-colors cursor-pointer'
              onClick={() => {
                setOpen('class');
                setSelectedRow(params?.data);
              }}
            >
              <FiEdit size={18} />
            </button>
            {/* <button
              className='text-red-600 hover:text-red-800 transition-colors cursor-pointer'
              onClick={() => setDeleteModal(params?.data)}
            >
              <MdOutlineDeleteOutline size={20} />
            </button> */}
          </div>
        ),
      },
    ],
    [setOpen, setSelectedRow]
  );
  useEffect(()=>{
    getClassesDetails(user?._id,false)
    getTrainerStatsDetails()
  },[])

  return (
  <div className="space-y-8 p-4 md:p-6">
    {/* Top Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        icon={FaClipboardList} 
        label="Total Classes" 
        count={trainerStats?.totalClasses || 0} 
        color="bg-indigo-600" 
      />
      <SummaryCard 
        icon={FaCalendarAlt} 
        label="Upcoming" 
        count={trainerStats?.totalUpcoming || 0} 
        color="bg-blue-600" 
      />
      <SummaryCard 
        icon={FaClock} 
        label="Today" 
        count={trainerStats?.totalToday || 0} 
        color="bg-emerald-600" 
      />
    </div>

    {/* Optional: Add more detailed cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        icon={FaCheckCircle} 
        label="Completed" 
        count={trainerStats?.totalExpired || 0} 
        color="bg-red-600" 
      />
      <SummaryCard 
        icon={FaPlayCircle} 
        label="Active / Non-expired" 
        count={trainerStats?.totalNonExpired || 0} 
        color="bg-green-600" 
      />
      <SummaryCard 
        icon={FaBolt} 
        label="Single Classes" 
        count={trainerStats?.totalSingleClasses || 0} 
        color="bg-yellow-500" 
      />
    </div>
    
    {/* Bar and Pie Chart Sections */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Session Stats</h3>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Session Status Distribution</h3>
        <div className="h-80">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  </div>
);

};

export default TrainerDashboard;