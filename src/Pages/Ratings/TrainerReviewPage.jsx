import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table2 } from "../../Components/Table/Table2";
// import trainersWithReviews from "./TrainersReview";
import { SlArrowLeft } from "react-icons/sl";
import {TrainerApi} from "../../Api/Trainer.api.js"
import { toast } from "react-toastify";
import { useLoading } from "../../Components/loader/LoaderContext.jsx";
import moment from "moment/moment.js";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


const TrainerReviewPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { handleLoading } = useLoading();
  const [trainerReviews,setTrainerReviews]=useState([])
  const [trainer,setTrainer]=useState([])
  console.log("_id:",_id)
 const getTrainerDetailsById=async(_id)=>{
  try{
  handleLoading(true)
  console.log("_id:",_id)
  const res= await TrainerApi.getSingleTrainer(_id);
  setTrainer(res?.data?.data)
  console.log("setTrainer:",res?.data?.data);
  
  }catch(err){
    toast.error("eror:",err)
  }finally{
    handleLoading(false)
  }
 }
 const getTrainerReviewById=async(_id)=>{
  try{
  handleLoading(true)
  const res= await TrainerApi.trainerReviewbyId(_id);
  setTrainerReviews(res?.data?.data)
  console.log("triner review by id:",res?.data?.data);
  
  }catch(err){
    toast.error("eror:",err)
  }finally{
    handleLoading(false)
  }
 }


 const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-300" />);
    }
  }

  return <div className="flex items-center space-x-1">{stars}</div>;
};

 const columns = [
  {
    headerName: "Review",
    field: "review",
    minWidth: 250,
  },
{
    headerName: "Rating",
    field: "rating",
    minWidth: 150,
    cellRenderer: (params) => renderStars(params.data.rating),
  },
  
  {
  headerName: "User",
  field: "user",
  minWidth: 200,
  cellRenderer: (params) => {
    const user = params.data.user;
    if (!user) return "N/A";

    return (
      <div className="flex items-center space-x-2">
        <img
          src={user.profile_image}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span>{`${user.first_name || ""} ${user.last_name || ""}`.trim()}</span>
      </div>
    );
  },
},
  {
    headerName: "Review Date",
    field: "createdAt",
    minWidth: 150,
    cellRenderer: (params) => moment(params.data.createdAt).format("DD MMM YYYY"),
  },
];

  if (!trainerReviews) return <div className="p-6">Trainer not found.</div>;
useEffect(()=>{
  getTrainerDetailsById(_id);
  getTrainerReviewById(_id);
},[])
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-primary mb-4 flex items-center gap-2">
        <SlArrowLeft size={18} onClick={() => navigate(`/ratings/trainers`)} className="cursor-pointer"/>
        {trainer?.first_name}'s Reviews & Ratings
      </h2>
      <Table2
        column={columns}
        internalRowData={trainerReviews}
        sheetName={`${trainer?.first_name}-reviews`}
        // isBack={true}
      />
    </div>
  );
};

export default TrainerReviewPage;
