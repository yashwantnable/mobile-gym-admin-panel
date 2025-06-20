import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table2 } from "../../Components/Table/Table2";
import trainersWithReviews from "./TrainersReview";
import { SlArrowLeft } from "react-icons/sl";

const TrainerReviewPage = () => {
  const { _id } = useParams();
  
  const navigate = useNavigate();
  const trainer = trainersWithReviews.find((t) => t.id === parseInt(_id));
  

  const columns = [
    { headerName: "Rating", field: "rating", minW_idth: 100 },
    { headerName: "Review", field: "review", minW_idth: 250 },
    { headerName: "Sessions", field: "sessions", minW_idth: 100 },
    {
      headerName: "Specializations",
      field: "specializations",
      minW_idth: 200,
      valueGetter: (params) => params.data.specializations.join(", "),
    },
  ];

  if (!trainer) return <div className="p-6">Trainer not found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-primary mb-4 flex items-center gap-2">
        <SlArrowLeft size={18} onClick={() => navigate(`/ratings/trainers`)} className="cursor-pointer"/>
        {trainer.name}'s Reviews & Ratings
      </h2>
      <Table2
        column={columns}
        internalRowData={trainer.reviews}
        sheetName={`${trainer.name}-reviews`}
        // isBack={true}
      />
    </div>
  );
};

export default TrainerReviewPage;
