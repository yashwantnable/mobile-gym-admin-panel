/*
    Table configuration

    <Table
        column={columns}
        // getTableFunction={[]}
        internalRowData={rowData}
        searchLabel={"Tasks"}
        totalCount={true}
        isExport={true}
        sheetName={"Task"}
    />

*/

import { FaRegEdit } from "react-icons/fa";
import service1 from "./Assets/service1.jpg"
import service2 from "./Assets/service2.png"
import service3 from "./Assets/service3.jpg"

export const mockServices = [
    {
        id: 1,
        name: 'In House Grooming',
        // description: 'Grooming is done at your home by an expert groomer.',
        image: service1,
    },
    {
        id: 2,
        name: 'Pick & Drop Grooming',
        // description: 'Relaxing spa and massage services for pets.',
        image: service2,
    },
    {
        id: 3,
        name: 'Van Grooming',
        // description: 'Professional hair trimming for a neat look.',
        image: service3,
    },
];

export const columns = [
    {
        headerName: "S.No.",
        field: "sno",
        minWidth: 100,
        cellRenderer: (params) => {
            return params.node.rowIndex + 1;
        },
    },
    {
        headerName: "Task Name",
        field: "taskName",
    },
    {
        headerName: "Project",
        field: "projectName",
        cellRenderer: (params) => {
            return params?.data?.projectName?.name || "N/A";
        },
    },
    {
        headerName: "Description",
        field: "taskDescription",
    },
    {
        headerName: "Priority",
        field: "taskPriority",
    },
    {
        headerName: "Time Spent",
        field: "estimatedHours",
    },

];

export const rowData = [
    {
        sno: 1,
        taskName: "Dummy Task 1",
        projectName: { name: "Project A" },
        taskDescription: "This is a dummy description.",
        taskPriority: "High",
        estimatedHours: "5h",
    },
    {
        sno: 2,
        taskName: "Dummy Task 2",
        projectName: { name: "Project B" },
        taskDescription: "Another dummy task.",
        taskPriority: "Medium",
        estimatedHours: "3h",
    },
    {
        sno: 3,
        taskName: "Dummy Task 3",
        projectName: { name: "Project C" },
        taskDescription: "Yet another dummy task.",
        taskPriority: "Low",
        estimatedHours: "2h",
    },
];



export const dummyPromoCodes = [
    {
        _id: '1',
        code: 'SUMMER25',
        discountType: 'percentage',
        discountValue: 25,
        minOrderAmount: 100,
        maxDiscountAmount: 200,
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        maxUses: 500,
        usedCount: 127,
        isActive: true
    },
    {
        _id: '2',
        code: 'PETLOVE50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 200,
        maxDiscountAmount: 0,
        startDate: '2025-04-15',
        endDate: '2025-04-30',
        maxUses: 100,
        usedCount: 89,
        isActive: true
    },
    {
        _id: '3',
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 50,
        maxDiscountAmount: 30,
        startDate: '2023-09-01',
        endDate: '2023-09-30',
        maxUses: 200,
        usedCount: 0,
        isActive: false
    },
    {
        _id: '4',
        code: 'FREEGROOM',
        discountType: 'fixed',
        discountValue: 30,
        minOrderAmount: 150,
        maxDiscountAmount: 0,
        startDate: '2023-05-01',
        endDate: '2023-05-31',
        maxUses: 150,
        usedCount: 150,
        isActive: true
    },
    {
        _id: '5',
        code: 'VIP20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 300,
        maxDiscountAmount: 100,
        startDate: '2023-08-01',
        endDate: '2023-12-31',
        maxUses: 300,
        usedCount: 42,
        isActive: true
    },
];


export const bookingRowData = [
    {
        sno: 1,
        customerName: "Jack",
        email: "jack@example.com",
        contactNo: "9876543210",
        petName: "Bruno",
        petType: "Dog",
        breed: "Labrador",
        weight: "30kg",
        age: "4 years",
        groomerAssign: "Jhonny",
        serviceType: "In House",
        groomingType: "Basic",
        date: "22-03-2025",
        status: "Pending",
        address: "P.O Box 1223 Dubai",
    },
    {
        sno: 2,
        customerName: "John",
        email: "john@example.com",
        contactNo: "3575806743",
        petName: "Bread",
        petType: "Cat",
        breed: "Persian",
        weight: "5kg",
        age: "2 years",
        groomerAssign: "Oggy",
        serviceType: "Van",
        groomingType: "Royal",
        date: "23-03-2025",
        status: "Done",
        address: "P.O Box 1223 Dubai",
    },
    {
        sno: 3,
        customerName: "Jackky",
        email: "jackky@example.com",
        contactNo: "7963795567",
        petName: "Taffu",
        petType: "Dog",
        breed: "Beagle",
        weight: "12kg",
        age: "3 years",
        groomerAssign: "Olivia",
        serviceType: "Pick & Drop",
        groomingType: "Basic",
        date: "22-03-2025",
        status: "Cancelled",
        address: "P.O Box 1223 Dubai",
    },
    {
        sno: 4,
        customerName: "Joi",
        email: "joi@example.com",
        contactNo: "36478954736",
        petName: "Clove",
        petType: "Cat",
        breed: "Siamese",
        weight: "4kg",
        age: "1.5 years",
        groomerAssign: "Bob",
        serviceType: "In House",
        groomingType: "Full",
        date: "24-03-2025",
        status: "Pending",
        address: "P.O Box 1223 Dubai",
    },
];


export const currencyRowData = [
    {
        "currency_code": "USD",
        "currency_name": "US Dollar",
        "currency_symbol": "$",
    },
    {
        "currency_code": "EUR",
        "currency_name": "Euro",
        "currency_symbol": "€",
    },
    {
        "currency_code": "JPY",
        "currency_name": "Japanese Yen",
        "currency_symbol": "¥",
    },
    {
        "currency_code": "INR",
        "currency_name": "Indian Rupee",
        "currency_symbol": "₹",
    },
    {
        "currency_code": "GBP",
        "currency_name": "British Pound",
        "currency_symbol": "£",
    },
   
 
]


export const taxRowData = [
    {
        _id: "1",
        tax_code: "GST",
        tax_name: "Goods and Services Tax",
        tax_rate: 18,
        tax_type: "PERCENTAGE",
        description: "Standard GST rate",
        status: true,
    },
    {
        _id: "2",
        tax_code: "PET_FEE",
        tax_name: "Pet Service Fee",
        tax_rate: 5,
        tax_type: "FIXED",
        description: "Fixed fee for pet services",
        status: true,
    },
    // Add more sample data as needed
];






