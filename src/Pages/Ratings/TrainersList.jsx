import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import trainersWithReviews from "./TrainersReview";
import { Table2 } from "../../Components/Table/Table2";



const TrainersList = () => {
  const navigate = useNavigate();

  const columns = [
  {
    headerName: "Photo",
    field: "image",
    minWidth: 100,
    cellRenderer: (params) => (
      <img
        src={params.value}
        alt="Trainer"
        className="w-14 h-14 rounded-full object-cover"
      />
    ),
  },
  {
    headerName: "Name",
    field: "name",
    minWidth: 150,
  },
  {
    headerName: "Age",
    field: "age",
    minWidth: 80,
  },
  {
    headerName: "Location",
    field: "location",
    minWidth: 150,
  },
  {
    headerName: "Rating",
    field: "rating",
    minWidth: 100,
    valueGetter: (params) => {
      const reviews = params.data.reviews;
      const avg =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      return avg.toFixed(1);
    },
    cellRenderer: (params) => (
      <div className="flex items-center text-yellow-500">
        <FaStar className="mr-1" />
        {params.value}
      </div>
    ),
  },
  {
    headerName: "Action",
    field: "action",
    minWidth: 150,
    cellRenderer: (params) => (
      <button
        onClick={() =>
          navigate(`/ratings/trainer/${params.data.id}`)
        }
        className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary-dark transition"
      >
        View Reviews
      </button>
    ),
  },
];


   const trainersWithRating = trainersWithReviews.map((trainer) => ({
    ...trainer,
    rating:
      trainer.reviews.reduce((sum, r) => sum + r.rating, 0) /
      trainer.reviews.length,
  }));
  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-primary mb-6">Our Trainers</h2>
      <div className="">
       <Table2
        column={columns}
        internalRowData={trainersWithRating}
        onRowClicked={(trainer) => navigate(`/ratings/trainer/${trainer.id}`)}
        sheetName="Trainer List"
        searchLabel="Trainer"
        
      />
      </div>
    </div>
  );
};

export default TrainersList;
