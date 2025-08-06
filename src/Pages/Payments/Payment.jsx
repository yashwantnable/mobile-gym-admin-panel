import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { FaSearch, FaMoneyBillWave, FaUserTie, FaUsers, FaPlus } from "react-icons/fa";
import { VscCloudDownload } from "react-icons/vsc";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Payment = () => {
    // Role toggle (true = admin, false = groomer)
    const [isAdmin, setIsAdmin] = useState(true);

    const [paymentData, setPaymentData] = useState([
        // Customer payments
        {
            id: 1,
            type: 'customer',
            transactionId: "TXN123456",
            petName: "Buddy",
            ownerName: "John Doe",
            date: "2023-05-15",
            amount: 120.50,
            paymentMethod: "Credit Card",
            status: "Completed",
            invoice: "INV-001",
            groomerId: "GRM001",
            groomerName: "Alex Johnson"
        },
        {
            id: 2,
            type: 'customer',
            transactionId: "TXN789012",
            petName: "Whiskers",
            ownerName: "Sarah Smith",
            date: "2023-05-16",
            amount: 85.00,
            paymentMethod: "PayPal",
            status: "Pending",
            invoice: "INV-002",
            groomerId: "GRM002",
            groomerName: "Maria Garcia"
        },
        // Groomer payments
        {
            id: 3,
            type: 'groomer',
            transactionId: "PAY789012",
            groomerId: "GRM001",
            groomerName: "Alex Johnson",
            date: "2023-05-30",
            amount: 96.40,
            status: "Paid",
            paymentMethod: "Bank Transfer",
            period: "May 2023"
        },
        {
            id: 4,
            type: 'groomer',
            transactionId: "PAY345678",
            groomerId: "GRM002",
            groomerName: "Maria Garcia",
            date: "2023-05-30",
            amount: 68.00,
            status: "Pending",
            paymentMethod: "Bank Transfer",
            period: "May 2023"
        },
    ]);

    const filteredData = useMemo(() => {
        if (isAdmin) return paymentData;

        const groomerId = "GRM001";
        return paymentData.filter(
            payment =>
                (payment.type === 'groomer' && payment.groomerId === groomerId) ||
                (payment.type === 'customer' && payment.groomerId === groomerId)
        );
    }, [paymentData, isAdmin]);

    const adminColumnDefs = useMemo(() => [
        {
            headerName: "Type",
            field: "type",
            cellRenderer: (params) => (
                <span className={`px-2 py-1 rounded-full text-xs ${params.value === 'customer'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                    }`}>
                    {params.value === 'customer' ? 'Customer' : 'Groomer'}
                </span>
            )
        },
        {
            headerName: "Transaction ID",
            field: "transactionId"
        },
        {
            headerName: "Name",
            valueGetter: (params) =>
                params.data.type === 'customer'
                    ? params.data.ownerName
                    : params.data.groomerName,
        },
        {
            headerName: "Pet/Groomer ID",
            valueGetter: (params) =>
                params.data.type === 'customer'
                    ? params.data.petName
                    : params.data.groomerId,
        },
        {
            headerName: "Date",
            field: "date"
        },
        {
            headerName: "Amount",
            field: "amount",
            valueFormatter: params => `$${params.value.toFixed(2)}`
        },
        {
            headerName: "Status",
            field: "status",
            cellStyle: params => {
                if (params.value === 'Completed' || params.value === 'Paid')
                    return { color: 'green' };
                if (params.value === 'Pending') return { color: 'orange' };
                if (params.value === 'Failed') return { color: 'red' };
                return null;
            }
        },
        {
            headerName: "Details",
            cellRenderer: (params) => (
                <button
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                    onClick={() => console.log("View details:", params.data)}
                >
                    View
                </button>
            )
        }
    ], []);


    const groomerColumnDefs = useMemo(() => [
        {
            headerName: "Type",
            field: "type",
            cellRenderer: (params) => (
                <span className={`px-2 py-1 rounded-full text-xs ${params.value === 'customer'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                    }`}>
                    {params.value === 'customer' ? 'Customer Payment' : 'My Payment'}
                </span>
            )
        },
        {
            headerName: "ID",
            field: "transactionId"
        },
        {
            headerName: "Date",
            field: "date"
        },
        {
            headerName: "Amount",
            field: "amount",
            valueFormatter: params => `$${params.value.toFixed(2)}`
        },
        {
            headerName: "Status",
            field: "status",
            cellStyle: params => {
                if (params.value === 'Completed' || params.value === 'Paid')
                    return { color: 'green' };
                if (params.value === 'Pending') return { color: 'orange' };
                if (params.value === 'Failed') return { color: 'red' };
                return null;
            }
        },
        {
            headerName: "Details",
            cellRenderer: (params) => (
                <button
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                    onClick={() => console.log("View details:", params.data)}
                >
                    View
                </button>
            )
        }
    ], []);

    const financialMetrics = useMemo(() => {
        const customerPayments = paymentData.filter(p => p.type === 'customer');
        const groomerPayments = paymentData.filter(p => p.type === 'groomer');

        const totalRevenue = customerPayments.reduce((sum, p) => sum + p.amount, 0);
        const completedPayments = customerPayments.filter(p => p.status === 'Completed').length;
        const pendingPayments = customerPayments.filter(p => p.status === 'Pending').length;
        const failedPayments = customerPayments.filter(p => p.status === 'Failed').length;

        const groomerId = "GRM001";
        const groomerEarnings = groomerPayments
            .filter(p => p.groomerId === groomerId)
            .reduce((sum, p) => sum + p.amount, 0);

        const groomerPending = groomerPayments
            .filter(p => p.groomerId === groomerId && p.status === 'Pending')
            .reduce((sum, p) => sum + p.amount, 0);

        const groomerCompleted = groomerPayments
            .filter(p => p.groomerId === groomerId && p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            totalRevenue,
            completedPayments,
            pendingPayments,
            failedPayments,
            groomerEarnings,
            groomerPending,
            groomerCompleted
        };
    }, [paymentData]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payments");
        XLSX.writeFile(wb, "payments.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [isAdmin ? adminColumnDefs : groomerColumnDefs].map(col => col.headerName),
            body: filteredData.map(row => [isAdmin ? adminColumnDefs : groomerColumnDefs].map(col => {
                if (col.valueFormatter) {
                    const params = { value: row[col.field] };
                    return col.valueFormatter(params);
                }
                return row[col.field];
            })),
        });
        doc.save("payments.pdf");
    };

    // Search functionality
    const [searchText, setSearchText] = useState("");
    const gridRef = useRef();

    const onSearchChange = (e) => {
        setSearchText(e.target.value);
        gridRef.current.api.setQuickFilter(e.target.value);
    };

    // Default column definitions
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 150,
            filter: true,
            resizable: true,
            sortable: true
        };
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {isAdmin ? 'Payment Management' : 'My Payments'}
                </h1>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsAdmin(!isAdmin)}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                    >
                        {isAdmin ? 'View as Groomer' : 'View as Admin'}
                    </button>

                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                            {isAdmin ? 'AD' : 'GR'}
                        </div>
                        <span className="text-gray-700">{isAdmin ? 'Admin' : 'Groomer'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {isAdmin ? (
                    <>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        ${financialMetrics.totalRevenue.toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                    <FaMoneyBillWave className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-green-600 text-sm mt-2">
                                <span className="font-semibold">+18.5%</span> from last month
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Completed</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        {financialMetrics.completedPayments}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <FaUsers className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-green-600 text-sm mt-2">
                                <span className="font-semibold">+12.2%</span> from last month
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        {financialMetrics.pendingPayments}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <FiRefreshCw className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-red-600 text-sm mt-2">
                                <span className="font-semibold">+5.1%</span> from last month
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Failed</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        {financialMetrics.failedPayments}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-red-100 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-red-600 text-sm mt-2">
                                <span className="font-semibold">+2.7%</span> from last month
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Groomer View Cards */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Earnings</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        ${financialMetrics.groomerEarnings.toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                    <FaMoneyBillWave className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-green-600 text-sm mt-2">
                                <span className="font-semibold">+15.2%</span> from last month
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Paid</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        ${financialMetrics.groomerCompleted.toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <FaUserTie className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-green-600 text-sm mt-2">
                                Last payment: May 30
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Pending</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        ${financialMetrics.groomerPending.toFixed(2)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <FiRefreshCw className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">
                                Next payout: June 30
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Customers</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">
                                        {filteredData.filter(p => p.type === 'customer').length}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <FaUsers className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-green-600 text-sm mt-2">
                                <span className="font-semibold">+8.2%</span> from last month
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search payments..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchText}
                                onChange={onSearchChange}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <FiFilter />
                            <span>Filters</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <VscCloudDownload />
                            <span>Export Excel</span>
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            <VscCloudDownload />
                            <span>Export PDF</span>
                        </button>
                        {/* {isAdmin && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                                <FaPlus />
                                <span>Add Payment</span>
                            </button>
                        )} */}
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="ag-theme-quartz" style={{ height: '600px', width: '100%' }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={filteredData}
                        columnDefs={isAdmin ? adminColumnDefs : groomerColumnDefs}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        paginationPageSize={10}
                        suppressCellFocus={true}
                        domLayout='autoHeight'
                    />
                </div>
            </div>
        </div>
    );
};

export default Payment;