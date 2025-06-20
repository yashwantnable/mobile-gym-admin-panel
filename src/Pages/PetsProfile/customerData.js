import { useMemo } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";



export const dummyCustomerList = [
  {
    _id: "cust_001",
    name: "Alice Johnson",
    age: 28,
    location: "New York, USA",
    contact_no: "+1 555-1234",
    subscriptions: "Gold Membership",
    fitness_goal: "Weight Loss",
  },
  {
    _id: "cust_002",
    name: "David Kim",
    age: 35,
    location: "Seoul, South Korea",
    contact_no: "+82 10-2345-6789",
    subscriptions: "Platinum Membership",
    fitness_goal: "Muscle Gain",
  },
  {
    _id: "cust_003",
    name: "Sara Patel",
    age: 31,
    location: "Mumbai, India",
    contact_no: "+91 98765-43210",
    subscriptions: "Basic Plan",
    fitness_goal: "Flexibility",
  },
  {
    _id: "cust_004",
    name: "Lucas Fernández",
    age: 24,
    location: "Madrid, Spain",
    contact_no: "+34 612-345-678",
    subscriptions: "Monthly Pass",
    fitness_goal: "Endurance",
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
        headerName: "Client Name",
        field: "clientName",
    },
    {
        headerName: "Email Address",
        field: "emailAddress",
    },
    {
        headerName: "Contact Number",
        field: "contactNumber",
    },
    {
        headerName: "Address",
        field: "address",
    },
    {
        headerName: "Pets",
        field: "pets",
        cellRenderer: (params) => {
            return params.data.pets.map(pet => pet.petName).join(", ") || "N/A";
        },
    }
];

export const rowData = [
    {
        sno: 1,
        clientName: "John Doe",
        emailAddress: "john.doe@example.com",
        contactNumber: "123-456-7890",
        address: "123 Pet Street, Cityville",
        pets: [
            {
                petName: "Buddy",
                species: "Dog",
                breed: "Golden Retriever",
                gender: "Male",
                weight: 25,
                dob: "2020-05-10",
                microchipNumber: "A12345",
                dietaryRequirements: "Grain-free diet",
                warnings: "None",
            },
            {
                petName: "Max",
                species: "Dog",
                breed: "Labrador",
                gender: "Male",
                weight: 30,
                dob: "2018-08-15",
                microchipNumber: "C98765",
                dietaryRequirements: "High protein diet",
                warnings: "Sensitive stomach",
            }
        ]
    },
    {
        sno: 2,
        clientName: "Jane Smith",
        emailAddress: "jane.smith@example.com",
        contactNumber: "987-654-3210",
        address: "456 Animal Ave, Petland",
        pets: [
            {
                petName: "Whiskers",
                species: "Cat",
                breed: "Siamese",
                gender: "Female",
                weight: 4,
                dob: "2019-11-22",
                microchipNumber: "B67890",
                dietaryRequirements: "No seafood",
                warnings: "Allergic to certain medications",
            }
        ]
    }
];
