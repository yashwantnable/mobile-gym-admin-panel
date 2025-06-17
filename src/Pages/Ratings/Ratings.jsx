import React, { useEffect, useMemo, useState } from "react";
import { RatingApi } from "../../Api/Ratings.api";
import { toast } from "react-toastify";
import { useLoading } from "../../Components/loader/LoaderContext";
import { Table2 } from "../../Components/Table/Table2";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import SubServiceRating from "./SubServiceRating";

const Ratings = () => {
  const [getAllRatings, setAllRatings] = useState();
//   const [open, setOpen] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const { handleLoading } = useLoading();

  const columns = useMemo(
    () => [
        // {
        //     headerName: "S.No",
        //     minWidth: 80,
        //     valueGetter: (params) => params.node.rowIndex + 1,
        //   },    

      {
        headerName: "Groomer Name",
        field: "groomer.first_name",
        minWidth: 160,
      },
      {
        headerName: "Rating",
        field: "rating",
        minWidth: 100,
      },
      // {
      //   headerName: "Base Currency",
      //   field: "isBaseCurrency",
      //   minWidth: 100,
      // },
      {
        headerName: "Review",
        field: "review",
        minWidth: 100,
      },
    //   {
    //     headerName: "Actions",
    //     field: "actions",
    //     minWidth: 150,
    //     cellRenderer: (params) => (
    //       <div className="text-xl flex items-center py-2">
    //         <button
    //           className="rounded cursor-pointer"
    //           onClick={() => {
    //             setOpen(true);
    //             setSelectedRow(params?.data);
    //           }}
    //         >
    //           <FaRegEdit />
    //         </button>
    //         <button
    //           className="px-4 rounded cursor-pointer text-red-500"
    //           onClick={() => {
    //             setOpen(false);
    //             setDeleteModal(params?.data);
    //           }}
    //         >
    //           <MdOutlineDeleteOutline />
    //         </button>
    //       </div>
    //     ),
    //   },
    ],
    []
  );

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
    getAllReviews();
  }, []);
  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4 mt-10">
        <h2 className="text-4xl font-bold text-primary">Groomer Reviews & Ratings</h2>
      </div>
      <Table2
        column={columns}
        internalRowData={getAllRatings}
        searchLabel={"Currency"}
        sheetName={"Currency Master"}
        // setModalOpen={setOpen}
        // isAdd={true}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
};

export default Ratings;
