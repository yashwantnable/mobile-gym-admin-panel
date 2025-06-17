// In src/dummydata/index.js
export const customers = [
    {
        id: "cust-1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, Anytown, USA"
    },
    {
        id: "cust-2",
        name: "Emily Johnson",
        email: "emily.j@example.com",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Ave, Somewhere, USA"
    },
    {
        id: "cust-3",
        name: "Michael Brown",
        email: "michael.b@example.com",
        phone: "+1 (555) 456-7890",
        address: "789 Pine Rd, Nowhere, USA"
    }
];

export const pets = [
    {
        id: "pet-1",
        customerId: "cust-1",
        name: "Max",
        type: "Dog",
        breed: "Golden Retriever",
        age: 3,
        weight: 25,
        specialNotes: "Allergic to chicken"
    },
    {
        id: "pet-2",
        customerId: "cust-1",
        name: "Bella",
        type: "Dog",
        breed: "French Bulldog",
        age: 2,
        weight: 12,
        specialNotes: "Nervous around other dogs"
    },
    {
        id: "pet-3",
        customerId: "cust-2",
        name: "Charlie",
        type: "Dog",
        breed: "Labrador",
        age: 5,
        weight: 30,
        specialNotes: "Loves belly rubs"
    },
    {
        id: "pet-4",
        customerId: "cust-3",
        name: "Lucy",
        type: "Cat",
        breed: "Siamese",
        age: 4,
        weight: 8,
        specialNotes: "Doesn't like baths"
    }
];

export const services = [
    {
        id: "serv-1",
        name: "Basic Grooming",
        description: "Bath, brush, nail trim, ear cleaning",
        price: 50,
        duration: 60,
        petType: "Dog"
    },
    {
        id: "serv-2",
        name: "Full Grooming",
        description: "Basic grooming plus haircut and styling",
        price: 80,
        duration: 90,
        petType: "Dog"
    },
    {
        id: "serv-3",
        name: "Royal Grooming",
        description: "Full grooming plus teeth brushing and paw treatment",
        price: 120,
        duration: 120,
        petType: "Dog"
    },
    {
        id: "serv-4",
        name: "Cat Grooming",
        description: "Bath, brush, nail trim for cats",
        price: 60,
        duration: 45,
        petType: "Cat"
    }
];

export const groomers = [
    {
        id: "groom-1",
        name: "Sarah Johnson",
        specialty: "Dog styling",
        experience: "5 years",
        availableDays: ["Monday", "Wednesday", "Friday"]
    },
    {
        id: "groom-2",
        name: "David Wilson",
        specialty: "Large breeds",
        experience: "8 years",
        availableDays: ["Tuesday", "Thursday", "Saturday"]
    },
    {
        id: "groom-3",
        name: "Lisa Chen",
        specialty: "Cats and small dogs",
        experience: "3 years",
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
];

export const timeSlots = [
    { id: "slot-1", time: "09:00 AM" },
    { id: "slot-2", time: "10:30 AM" },
    { id: "slot-3", time: "12:00 PM" },
    { id: "slot-4", time: "02:00 PM" },
    { id: "slot-5", time: "03:30 PM" },
    { id: "slot-6", time: "05:00 PM" }
];

export const bookingRowData = [
    {
        id: "book-1",
        customerId: "cust-1",
        customerName: "John Smith",
        petIds: ["pet-1"],
        petNames: ["Max"],
        serviceId: "serv-2",
        serviceName: "Full Grooming",
        date: "2023-06-15",
        timeSlotId: "slot-2",
        timeSlot: "10:30 AM",
        groomerId: "groom-1",
        groomerName: "Sarah Johnson",
        price: 80,
        status: "Completed",
        notes: "Max was very well-behaved"
    },
    {
        id: "book-2",
        customerId: "cust-2",
        customerName: "Emily Johnson",
        petIds: ["pet-3"],
        petNames: ["Charlie"],
        serviceId: "serv-1",
        serviceName: "Basic Grooming",
        date: "2023-06-16",
        timeSlotId: "slot-4",
        timeSlot: "02:00 PM",
        groomerId: "groom-2",
        groomerName: "David Wilson",
        price: 50,
        status: "Confirmed",
        notes: "Needs special shampoo"
    },
    {
        id: "book-3",
        customerId: "cust-3",
        customerName: "Michael Brown",
        petIds: ["pet-4"],
        petNames: ["Lucy"],
        serviceId: "serv-4",
        serviceName: "Cat Grooming",
        date: "2023-06-17",
        timeSlotId: "slot-1",
        timeSlot: "09:00 AM",
        groomerId: "groom-3",
        groomerName: "Lisa Chen",
        price: 60,
        status: "Pending",
        notes: "Very nervous - handle with care"
    },
    {
        id: "book-4",
        customerId: "cust-1",
        customerName: "John Smith",
        petIds: ["pet-1", "pet-2"],
        petNames: ["Max", "Bella"],
        serviceId: "serv-3",
        serviceName: "Royal Grooming",
        date: "2023-06-18",
        timeSlotId: "slot-3",
        timeSlot: "12:00 PM",
        groomerId: "groom-1",
        groomerName: "Sarah Johnson",
        price: 120,
        status: "In Progress",
        notes: "Both dogs need flea treatment"
    }
];