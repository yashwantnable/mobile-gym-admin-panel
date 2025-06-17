import React from "react";
import { ServiceApi } from "../../Api/Service.api";
import { toast } from "react-toastify";
import { useLoading } from "../../Components/loader/LoaderContext";

const ServiceCard = ({ service, icon, icon2, onEdit, handleServiceType }) => {
    const { handleLoading } = useLoading()

    const handleDelete = async () => {
        handleLoading(true)
        try {
            await ServiceApi.deleteServiceType(service?._id);
            toast.success("Service type deleted successfully")
            handleServiceType()
        }
        catch (err) {
            console.log(err)
        }
        handleLoading(false)
    }
    return (
        <div className="bg-white shadow-lg rounded-2xl lg:w-80 w-full p-6 flex flex-col relative items-center text-center hover:shadow-xl transition-shadow border border-gray-200">
            <div className="flex absolute left-3 top-3 gap-2 ">
                <i className="w-full text-xl cursor-pointer" onClick={onEdit}> {icon} </i>
                <i className="w-full text-xl cursor-pointer text-red-500" onClick={handleDelete} > {icon2} </i>
            </div>
            <div className="p-6 rounded-xl ">
                <img
                    src={service.image}
                    alt={service.name}
                    className="w-40 h-24 object-contain"
                />
            </div>
            <h3 className="text-2xl capitalize font-extrabold text-gray-800 mt-4">{service.name}</h3>
        </div>
    );
};

export default ServiceCard;