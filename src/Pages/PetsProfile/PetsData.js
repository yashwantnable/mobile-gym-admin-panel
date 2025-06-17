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
