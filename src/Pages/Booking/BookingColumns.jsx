import moment from "moment";
import { FaExchangeAlt, FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";

export const getBookingColumns = ({ onEdit, onDelete, onAssign }) => [
  {
    headerName: "Name",
    field: "customer",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {params.data.customer?.first_name}
      </div>
    ),
  },
  {
    headerName: "Contact No.",
    field: "customer",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {params.data.customer?.phone_number}
      </div>
    ),
  },
  {
    headerName: "Pet Name",
    field: "pet",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">{params.data.pet.petName}</div>
    ),
  },
  {
    headerName: "Groomer Assign",
    field: "groomer",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {params.data.groomer.first_name}
      </div>
    ),
  },
  {
    headerName: "Service Type",
    field: "serviceType",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {params.data.serviceType.name}
      </div>
    ),
  },
  {
    headerName: "Grooming Type",
    field: "subService",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {params.data.subService.name}
      </div>
    ),
  },
  {
    headerName: "Date",
    field: "date",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {moment(params.data.date).format("DD-MM-YYYY")}
      </div>
    ),
  },
  {
    headerName: "Status",
    field: "status",
    minWidth: 120,
    cellRenderer: (params) => {
      const status = params.data.status?.toLowerCase();
      let statusClass = "";

      if (status === "completed") statusClass = "bg-green-100 text-green-800";
      else if (status === "pending")
        statusClass = "bg-yellow-100 text-yellow-800";
      else if (status === "confirmed")
        statusClass = "bg-blue-100 text-blue-800";
      else if (status === "cancelled") statusClass = "bg-red-100 text-red-800";
      else statusClass = "bg-gray-100 text-gray-800";

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {params.data.status}
        </span>
      );
    },
  },
  {
    headerName: "Actions",
    field: "actions",
    minWidth: 200,
    cellRenderer: (params) => {
      return (
        <div className="flex items-center space-x-2 relative">
          {/* Assign Button */}
          <button
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onAssign(params.data);
            }}
          >
            <FaExchangeAlt className="text-sm cursor-pointer" />
          </button>

          {/* Edit Button */}
          <button
            className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600"
            onClick={() => onEdit(params.data)}
          >
            <FaRegEdit className="text-sm cursor-pointer" />
          </button>

          {/* Delete Button */}
          <button
            className="p-2 rounded-md bg-red-100 hover:bg-red-200 text-red-600"
            onClick={() => onDelete(params.data)}
          >
            <MdOutlineDeleteOutline className="text-sm cursor-pointer" />
          </button>
        </div>
      );
    },
  },
];
