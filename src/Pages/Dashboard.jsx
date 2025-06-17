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
import { DashboardApi } from "../Api/Dashboard.api";
import { MdOutlinePets } from "react-icons/md";
import { useLoading } from "../Components/loader/LoaderContext";

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
  const [dashboardData, setDashboardData] = useState({});
  const [petCountData, setPetCountData] = useState([]);
  // const [monthlyAppointmnetData, setMonthlyAppoinments] = useState([]);
  const [yearlyOrdersData, setYearlyOrdersData] = useState();
  const { handleLoading } = useLoading();

  const [petStats] = useState({
    totalPets: 1243,
    activePets: 892,
    inCare: 187,
    newThisMonth: 164,
  });

  const getDashboardData = async () => {
    handleLoading(true);
    try {
      const res = await DashboardApi.getDashboardData();
      setDashboardData(res?.data?.data);
      console.log("res", res);
    } catch (err) {
      console.log("erorr", err);
    } finally {
      handleLoading(false);
    }
  };
  const getPetCount = async () => {
    handleLoading(true);
    try {
      const res = await DashboardApi.getPetCount();
      setPetCountData(res?.data?.data);
      console.log("res", res);
    } catch (err) {
      console.log("erorr", err);
    } finally {
      handleLoading(false);
    }
  };
  const getMonthlyAppointments = async () => {
    handleLoading(true);
    try {
      const res = await DashboardApi.getMonthlyAppointments();
      setYearlyOrdersData(res?.data?.data?.yearlyOrders);
      console.log("res", res);
    } catch (err) {
      console.log("erorr", err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
    getMonthlyAppointments();
    getPetCount();
  }, []);

  const appointmentMonth = yearlyOrdersData?.map((order) => order?.month);
  const monthlyOrderCount = yearlyOrdersData?.map((order) => order?.orderCount);

  const appointmentsData = {
    labels: appointmentMonth,
    datasets: [
      {
        label: "Order",
        data: monthlyOrderCount,
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
      // {
      //   label: "Completed",
      //   data: [110, 135, 165, 195, 185],
      //   backgroundColor: "rgba(16, 185, 129, 0.8)",
      //   borderColor: "rgba(16, 185, 129, 1)",
      //   borderWidth: 1,
      // },
    ],
  };

  console.log("petcount data", petCountData);

  const petNames = petCountData?.map((pet) => pet?.petTypeName);
  const petCounts = petCountData?.map((pet) => pet.totalPets);
  console.log("pet Names", petNames);

  const petTypesData = {
    labels: petNames,
    datasets: [
      {
        data: petCounts,
        backgroundColor: [
          "rgba(79, 70, 229, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgba(79, 70, 229, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Pets Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Pets</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {dashboardData.totalPets}
              </p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <MdOutlinePets />
            </div>
          </div>
          <p className="text-green-600 text-sm mt-2">
            <span className="font-semibold">+12.5%</span> from last month
          </p>
        </div>

        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {dashboardData.totalUsers}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-sm mt-2">
            <span className="font-semibold">+8.2%</span> from last month
          </p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {dashboardData.totalOrders}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <p className="text-red-600 text-sm mt-2">
            <span className="font-semibold">-3.1%</span> from last month
          </p>
        </div>

        {/* This Month's Orders Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                This Month's Orders
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {dashboardData.totalOrdersThisMonth}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-sm mt-2">
            <span className="font-semibold">+22.7%</span> from last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Appointments Overview
          </h2>
          <div className="h-80">
            <Bar
              data={appointmentsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Monthly Appointments",
                    font: {
                      size: 16,
                    },
                  },
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pet Types Distribution
          </h2>
          <div className="h-80">
            <Pie
              data={petTypesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Pet Types Distribution",
                    font: {
                      size: 16,
                    },
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

      {/* <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">
                  New appointment scheduled
                </p>
                <p className="text-gray-500 text-sm">
                  Dr. Smith with Buddy the Dog - May 15, 10:30 AM
                </p>
              </div>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
