const trainersWithReviews = [
  {
    id: 1,
    name: "John",
    age: 30,
    location: "Dubai",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    reviews: [
      {
        id: 101,
        rating: 4.8,
        review: "John is very knowledgeable and motivating. Highly recommended!",
        sessions: 120,
        specializations: ["Weight Loss", "Strength Training"],
      },
      {
        id: 102,
        rating: 4.7,
        review: "Helped me recover post-injury with care.",
        sessions: 90,
        specializations: ["Rehab", "Mobility"],
      },
    ],
  },
  {
    id: 2,
    name: "Priya",
    age: 28,
    location: "Mumbai",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    reviews: [
      {
        id: 201,
        rating: 4.5,
        review: "Great sessions and very attentive to individual needs.",
        sessions: 95,
        specializations: ["Yoga", "Cardio"],
      },
      {
        id: 202,
        rating: 4.6,
        review: "Her yoga classes are calming and energetic at the same time!",
        sessions: 88,
        specializations: ["Yoga"],
      },
    ],
  },
  {
    id: 3,
    name: "Ahmed",
    age: 35,
    location: "Cairo",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
    reviews: [
      {
        id: 301,
        rating: 5.0,
        review: "Excellent trainer! Helped me reach my goals quickly.",
        sessions: 150,
        specializations: ["Bodybuilding", "CrossFit"],
      },
      {
        id: 302,
        rating: 4.9,
        review: "Pushes me to the limit in a good way. Intense sessions!",
        sessions: 130,
        specializations: ["HIIT", "CrossFit"],
      },
    ],
  },
  {
    id: 4,
    name: "Sara",
    age: 29,
    location: "Abu Dhabi",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
    reviews: [
      {
        id: 401,
        rating: 4.2,
        review: "Good experience overall. Could improve on punctuality.",
        sessions: 80,
        specializations: ["Zumba", "Pilates"],
      },
      {
        id: 402,
        rating: 4.4,
        review: "Fun and energetic classes. Loved Zumba with her!",
        sessions: 100,
        specializations: ["Zumba"],
      },
    ],
  },
];

export default trainersWithReviews;
