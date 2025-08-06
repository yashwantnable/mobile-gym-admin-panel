import { useEffect, useState } from "react";
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
import { FaDumbbell, FaUserFriends, FaUsers, FaDollarSign } from "react-icons/fa";
import { useLoading } from "../Components/loader/LoaderContext";
import { DashboardApi } from "../Api/Dashboard.api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const { handleLoading } = useLoading();

  const [dashboardData, setDashboardData] = useState();
  const [classCount, setClassCount] = useState();

  const getAlldashboardData=async()=>{
    try{
      handleLoading(true)
      const res= await DashboardApi.getDashboardData();
      setDashboardData(res?.data?.data);
      
    }catch(err){
      console.error("error:",err)
    }finally{
      handleLoading(false)
    }
  }


  const [monthlySessionStats, setMonthlySessionStats] = useState([
    { month: "Jan", count: 220 },
    { month: "Feb", count: 260 },
    { month: "Mar", count: 310 },
    { month: "Apr", count: 280 },
    { month: "May", count: 340 },
    { month: "Jun", count: 390 },
  ]);

  const [trainerDistribution, setTrainerDistribution] = useState([
    { type: "Yoga", count: 12 },
    { type: "Strength", count: 18 },
    { type: "Zumba", count: 9 },
    { type: "Cardio", count: 6 },
  ]);

  const sessionLabels = monthlySessionStats.map((item) => item.month);
  const sessionCounts = monthlySessionStats.map((item) => item.count);

  const sessionBarData = {
    labels: sessionLabels,
    datasets: [
      {
        label: "Sessions",
        data: sessionCounts,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  const trainerPieData = {
    labels: trainerDistribution.map((t) => t.type),
    datasets: [
      {
        data: trainerDistribution.map((t) => t.count),
        backgroundColor: [
          "rgba(79, 70, 229, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(79, 70, 229, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(()=>{
    getAlldashboardData()
  },[])
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Subscriptions */}
        <Card title="Total Subsccriptions" value={dashboardData?.totalSubscriptions} icon={<FaDumbbell />} color="bg-indigo-100 text-indigo-600" />

        <Card title="Total Classes" value={dashboardData?.totalClasses} icon={<FaDumbbell />} color="bg-indigo-100 text-indigo-600" />

        <Card title="Total Programs" value={dashboardData?.totalPackages} icon={<FaUserFriends />} color="bg-pink-100 text-pink-600" />

        {/* Total Trainers */}
        <Card title="Total Trainers" value={dashboardData?.totalTrainer} icon={<FaUserFriends />} color="bg-green-100 text-green-600" />

        <Card title="Active Class" value={dashboardData?.totalActiveClasses} icon={<FaDumbbell />} color="bg-purple-100 text-purple-600" />
        {/* Total Customers */}
        <Card title="Total Customers" value={dashboardData?.totalCustomers} icon={<FaUsers />} color="bg-blue-100 text-blue-600" />

        {/* Total Revenue */}
        <Card title="Total Revenue" value={dashboardData?.totalRevenue} icon={<FaDollarSign />} color="bg-yellow-100 text-yellow-600" />

        {/* Active Sessions */}
        {/* <Card title="Active Sessions" value={dashboardData?.totalClasses} icon={<FaDumbbell />} color="bg-purple-100 text-purple-600" /> */}
        {/* Active Sessions 3months/6months/1year*/}
        <Card title="Total Members" value={dashboardData?.totalClasses} icon={<FaDumbbell />} color="bg-purple-100 text-purple-600" />

        {/* Active Trainers */}
        
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sessions Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Session Stats
          </h2>
          <div className="h-80">
            <Bar
              data={sessionBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Monthly Sessions",
                    font: { size: 16 },
                  },
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Trainer Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Trainer’s Classes
          </h2>
          <div className="h-80">
            <Pie
              data={trainerPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Trainer Distribution",
                    font: { size: 16 },
                  },
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    </div>
  </div>
);

export default Dashboard;
