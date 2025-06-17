import moment from "moment";

export const getOrderColumns = ({ onEdit, onDelete }) => [
  {
    headerName: "Order ID",
    field: "orderid", // Changed from _id to orderid since that's what you display
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">{params.data.orderid}</div>
    ),
    accessorFn: (row) => row.orderid, // Add this
  },
  {
    headerName: "Customer",
    field: "created_by",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {`${params.data.created_by.first_name} ${params.data.created_by.last_name}`}
      </div>
    ),
    accessorFn: (row) =>
      `${row.created_by.first_name} ${row.created_by.last_name}`, // Add this
  },
  {
    headerName: "Total Price",
    field: "total_delivery_price",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        ${params.data.total_delivery_price.$numberDecimal}
      </div>
    ),
    accessorFn: (row) => row.total_delivery_price.$numberDecimal, // Add this
  },
  {
    headerName: "Payment Type",
    field: "pay_type",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {params.data.pay_type.toLowerCase()}
      </div>
    ),
    accessorFn: (row) => row.pay_type.toLowerCase(), // Add this
  },
  {
    headerName: "Order Date",
    field: "order_date",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {moment(params.data.order_date).format("DD-MM-YYYY HH:mm")}
      </div>
    ),
    accessorFn: (row) => moment(row.order_date).format("DD-MM-YYYY HH:mm"), // Add this
  },
  {
    headerName: "Address",
    field: "defaultAddress",
    minWidth: 120,
    cellRenderer: (params) => (
      <div className="font-medium capitalize">
        {`${params.data?.defaultAddress?.country?.name} ,${params.data?.defaultAddress?.city?.name} `}
      </div>
    ),
    accessorFn: (row) =>
      `${row?.defaultAddress?.country?.name} ${row?.defaultAddress?.city?.name}`, // Add this
  },
];
