import React, { useEffect, useMemo, useState } from "react";
import { RatingApi } from "../../Api/Ratings.api";
import { toast } from "react-toastify";
import { useLoading } from "../../Components/loader/LoaderContext";
import { Table2 } from "../../Components/Table/Table2";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import SubServiceRating from "./SubscriptionRating";
import TrainersList from "./TrainersList";

const Ratings = () => {
  const [getAllRatings, setAllRatings] = useState();
//   const [open, setOpen] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const { handleLoading } = useLoading();

const columns = useMemo(
  () => [
    {
      headerName: "Trainer Name",
      field: "trainer.first_name",
      minWidth: 160,
    },
    {
      headerName: "Rating",
      field: "rating",
      minWidth: 100,
    },
    {
      headerName: "Review",
      field: "review",
      minWidth: 250,
    },
    {
      headerName: "Sessions",
      field: "sessions",
      minWidth: 100,
    },
    {
      headerName: "Specializations",
      field: "specializations",
      minWidth: 200,
      valueGetter: (params) => params.data.specializations.join(", "),
    },
  ],
  []
);
const dummyTrainerReviews = [
  {
    id: 1,
    trainer: {
      first_name: "John",
    },
    rating: 4.8,
    review: "John is very knowledgeable and motivating. Highly recommended!",
    sessions: 120,
    specializations: ["Weight Loss", "Strength Training"],
  },
  {
    id: 2,
    trainer: {
      first_name: "Priya",
    },
    rating: 4.5,
    review: "Great sessions and very attentive to individual needs.",
    sessions: 95,
    specializations: ["Yoga", "Cardio"],
  },
  {
    id: 3,
    trainer: {
      first_name: "Ahmed",
    },
    rating: 5.0,
    review: "Excellent trainer! Helped me reach my goals quickly.",
    sessions: 150,
    specializations: ["Bodybuilding", "CrossFit"],
  },
  {
    id: 4,
    trainer: {
      first_name: "Sara",
    },
    rating: 4.2,
    review: "Good experience overall. Could improve on punctuality.",
    sessions: 80,
    specializations: ["Zumba", "Pilates"],
  },
];


  const getAllReviews = async () => {
    handleLoading(true);
    try {
      const res = await RatingApi.getAllGroomerRatings();
      setAllRatings(res.data.data || []);
      console.log(res.data.data);
    } catch (err) {
      console.error("Error fetching currencies:", err);
      toast.error("Failed to fetch currencies");
    }
    finally{
        handleLoading(false);
    }
  };

  useEffect(() => {
    // getAllReviews();
  }, []);
  return (
    <div className="p-5">
      <TrainersList/>
    </div>
  );
};

export default Ratings;
