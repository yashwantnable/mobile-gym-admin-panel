import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import trainersWithReviews from "./TrainersReview";
import { Table2 } from "../../Components/Table/Table2";
import { RatingApi } from "../../Api/Ratings.api";
import { toast } from "react-toastify";



const TrainersList = () => {
  const navigate = useNavigate();
  const [trainerReviews,setTrainerReviews]=useState(null)

const columns = [
  {
    headerName: "Photo",
    field: "trainer.profile_image",
    minWidth: 100,
    cellRenderer: (params) => (
      <img
        src={params.data?.trainer?.profile_image}
        alt="Trainer"
        className="w-14 h-14 rounded-full object-cover"
      />
    ),
  },
  {
    headerName: "Name",
    field: "trainer.first_name",
    minWidth: 150,
    valueGetter: (params) => params.data?.trainer?.first_name || "N/A",
  },
  {
    headerName: "Rating",
    field: "rating",
    minWidth: 100,
    cellRenderer: (params) => (
      <div className="flex items-center text-yellow-500">
        <FaStar className="mr-1" />
        {params.value}
      </div>
    ),
  },
  {
    headerName: "Review",
    field: "review",
    minWidth: 250,
  },
  {
    headerName: "Action",
    field: "action",
    minWidth: 150,
    cellRenderer: (params) => (
      <button
        onClick={() =>
          navigate(`/ratings/trainer/${params.data.trainer?._id}`)
        }
        className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary-dark transition"
      >
        View Reviews
      </button>
    ),
  },
];


const getAllTrainerReviews=async()=>{
  try{
    const res=await RatingApi.getAllTrainerRatings();
    setTrainerReviews(res?.data?.data)
    console.log("trainer revires:",res?.data?.data);
    
  }catch(err){
    toast.error("error:",err)
  }

}

   const trainersWithRating = trainersWithReviews.map((trainer) => ({
    ...trainer,
    rating:
      trainer.reviews.reduce((sum, r) => sum + r.rating, 0) /
      trainer.reviews.length,
  }));

  useEffect(()=>{
    getAllTrainerReviews();
  },[])
  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-primary mb-6">Our Trainers</h2>
      <div className="">
       <Table2
        column={columns}
        internalRowData={trainerReviews}
        onRowClicked={(trainer) => navigate(`/ratings/trainer/${trainer.id}`)}
        sheetName="Trainer List"
        searchLabel="Trainer"
        
      />
      </div>
    </div>
  );
};

export default TrainersList;
