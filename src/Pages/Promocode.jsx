import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineDeleteOutline,
  MdOutlineContentCopy,
  MdDiscount,
  MdEventAvailable,
  MdEventBusy,
  MdAttachMoney,
  MdPercent,
  MdAutorenew,
} from "react-icons/md";
import { FaRegEdit, FaPlus } from "react-icons/fa";
import SidebarField from "../Components/SideBarField";
import Button from "../Components/Button";
import InputField from "../Components/InputField";
import DeleteModal from "../Components/DeleteModal";
import { useLoading } from "../Components/loader/LoaderContext";
import { PromoCodeApi } from "../Api/Promocode.api";
import { toast } from "react-toastify";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  hover: { scale: 1.02 },
};

const PromoCodeManagement = () => {
   const dummyPromoCodes = [
  {
    id: 1,
    code: "SUMMER2025",
    discountType: "percentage",
    discountValue: { $numberDecimal: "15" },
    minOrderAmount: { $numberDecimal: "50" },
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    maxUses: { $numberDecimal: "100" },
    description: "15% off all summer items",
    isActive: true,
  },
  {
    id: 2,
    code: "WELCOME50",
    discountType: "fixed",
    discountValue: { $numberDecimal: "50" },
    minOrderAmount: { $numberDecimal: "200" },
    startDate: "2025-06-15",
    endDate: "2025-07-15",
    maxUses: { $numberDecimal: "50" },
    description: "₹50 off for first-time users",
    isActive: true,
  },
  {
    id: 3,
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: { $numberDecimal: "0" },
    minOrderAmount: { $numberDecimal: "100" },
    startDate: "2025-05-01",
    endDate: "2025-12-31",
    maxUses: { $numberDecimal: "500" },
    description: "Free shipping on orders over ₹100",
    isActive: false,
  },
  {
    id: 4,
    code: "FLASH25",
    discountType: "percentage",
    discountValue: { $numberDecimal: "25" },
    minOrderAmount: { $numberDecimal: "150" },
    startDate: "2025-06-18",
    endDate: "2025-06-20",
    maxUses: { $numberDecimal: "25" },
    description: "Flash sale – 25% off",
    isActive: true,
  },
];

  const { handleLoading } = useLoading();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoCodes, setPromoCodes] = useState();
  const [generatedCode, setGeneratedCode] = useState("");

  const formatDate = (isoString) => isoString?.split("T")[0];

 


  const fetchPromoCodes = async () => {
    handleLoading(true);
    try {
      const res = await PromoCodeApi.getAllPromoCodes();
      setPromoCodes(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching promo codes:", err);
    }
    handleLoading(false);
  };

  console.log("promocodes", promoCodes);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const validationSchema = Yup.object({
    code: Yup.string()
      .required("Promo code is required")
      .min(4, "Promo code must be at least 4 characters")
      .max(20, "Promo code cannot exceed 20 characters"),
    discountType: Yup.string()
      .oneOf(["Percentage", "Fixed_Amount"], "Invalid discount type")
      .required("Discount type is required"),
    discountValue: Yup.number()
      .required("Discount value is required")
      .positive("Discount must be positive")
      .when("discountType", {
        is: "Percentage",
        then: Yup.number().max(100, "Percentage cannot exceed 100%"),
      }),
    minOrderAmount: Yup.number()
      .min(0, "Minimum order cannot be negative")
      .required("Minimum order is required"),

    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date cannot be in the past"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
    maxUses: Yup.number()
      .min(1, "Must allow at least 1 use")
      .required("Max uses is required"),
    description: Yup.string().required("description is required"),
  });
  console.log("selectedPromo update:", selectedPromo);

  const formik = useFormik({
    initialValues: {
      code: selectedPromo?.code || generatedCode,
      discountType: selectedPromo?.discountType || "",
      discountValue: selectedPromo?.discountValue?.$numberDecimal || "",
      minOrderAmount: selectedPromo?.minOrderAmount?.$numberDecimal || "",
      startDate: selectedPromo?.startDate || "",
      // startDate: selectedPromo?.startDate || new Date().toISOString().split('T')[0],
      endDate: selectedPromo?.endDate || "",
      // endDate: selectedPromo?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxUses: selectedPromo?.maxUses?.$numberDecimal || "",
      description: selectedPromo?.description || "",
      isActive: selectedPromo?.isActive ?? true,
    },
    // validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      handleLoading(true);
      try {
        const payload = {
          ...values,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
        };

        let res;

        if (selectedPromo) {
          res = await PromoCodeApi.updatePromoCode(selectedPromo._id, payload);
        } else {
          res = await PromoCodeApi.createPromoCode(payload);
        }
        console.log(res.data?.data);
        setPromoCodes(res.data?.data);

        fetchPromoCodes();
        setOpenSidebar(false);
      } catch (err) {
        console.error("Error saving promo code:", err);
      }
      handleLoading(false);
      setSelectedPromo();
      setPromoCodes();
    },
  });

  const handleDelete = async () => {
    if (!deleteModal) return;
    handleLoading(true);
    try {
      await PromoCodeApi.deletePromoCode(deleteModal._id);
      fetchPromoCodes();
      setDeleteModal(false);
    } catch (err) {
      console.error("Error deleting promo code:", err);
    }
    handleLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied successfully");
  };

  const generateRandomPromoCode = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const numPositions = [
      Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 5 + 5),
    ].slice(0, 2);

    for (let i = 0; i < 10; i++) {
      if (numPositions.includes(i)) {
        result += "0123456789"[Math.floor(Math.random() * 10)];
      } else {
        const randomChar = chars[Math.floor(Math.random() * 52)];
        result += randomChar;
      }
    }

    return result;
  };

  useEffect(() => {
    setGeneratedCode(generateRandomPromoCode());
  }, []);

  const handleGenerateNewCode = () => {
    setGeneratedCode(generateRandomPromoCode());
    formik.setFieldValue("code", generateRandomPromoCode());
  };

  const getStatusBadge = (isActive, startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isActive) return "Inactive";
    if (now < start) return "Upcoming";
    if (now > end) return "Expired";
    return "Active";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Promo Codes</h1>
        <Button
          text="Add Promo Code"
          icon={<FaPlus className="mr-2" />}
          onClick={() => {
            setSelectedPromo(null);
            setOpenSidebar(true);
          }}
          className="px-6 py-3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {promoCodes?.map((promo) => (
            <motion.div
              key={promo._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <MdDiscount className="text-indigo-600 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {promo.code}
                      </h3>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatusBadge(promo.isActive, promo.startDate, promo.endDate))}`}
                      >
                        {getStatusBadge(
                          promo.isActive,
                          promo.startDate,
                          promo.endDate
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(promo.code)}
                      className="text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors"
                      title="Copy code"
                    >
                      <MdOutlineContentCopy size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPromo(promo);
                        setOpenSidebar(true);
                      }}
                      className="text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <FaRegEdit size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteModal(promo)}
                      className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <MdOutlineDeleteOutline size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {promo.discountType === "Percentage" ? (
                      <MdPercent className="text-green-500 mr-1" size={20} />
                    ) : (
                      <MdAttachMoney
                        className="text-green-500 mr-1"
                        size={20}
                      />
                    )}
                    <span className="font-bold text-gray-800">
                      {promo.discountValue?.$numberDecimal}
                      {promo.discountType === "Percentage" ? "%" : ""} off
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Min. order: ${promo.minOrderAmount?.$numberDecimal}
                  </div>
                </div>

                {promo.discountType === "Percentage" && (
                  <div className="text-sm text-gray-500 mb-4">
                    Min discount: ${promo.maxDiscountAmount?.$numberDecimal}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <MdEventAvailable className="mr-1" size={16} />
                    <span>
                      {new Date(promo.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MdEventBusy className="mr-1" size={16} />
                    <span>{new Date(promo.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Uses: </span>
                    <span className="text-gray-500">
                      {parseInt(promo.maxUses?.$numberDecimal)}
                    </span>
                  </div>
                  {promo.isActive && (
                    <button
                      onClick={() => copyToClipboard(promo.code)}
                      className="text-sm cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Copy Code
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {promoCodes?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="bg-indigo-100 p-6 rounded-full mb-4">
            <MdDiscount className="text-indigo-600 text-4xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No promo codes yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first promo code to attract more customers
          </p>
          <Button
            text="Create Promo Code"
            icon={<FaPlus className="mr-2" />}
            onClick={() => setOpenSidebar(true)}
          />
        </motion.div>
      )}

      {openSidebar && (
        <SidebarField
          title={selectedPromo ? "Edit Promo Code" : "Create New Promo Code"}
          handleClose={() => {
            setOpenSidebar(false);
            setSelectedPromo(null);
          }}

           button1={
            <Button
              variant="outline"
              onClick={() => formik.resetForm()}
              text="Reset"
              className="w-full"
            />
          }
          button2={
            <Button
              text={selectedPromo ? "Update" : "Create"}
              onClick={formik.handleSubmit}
              type="submit"
              className="w-full"
            />
          }
         
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="relative">
              <InputField
                name="code"
                label="Promo Code"
                placeholder="e.g. SUMMER20"
                value={formik.values.code}
                onChange={formik.handleChange}
                error={formik.touched.code && formik.errors.code}
                isRequired
              />
              {!selectedPromo && (
                <button
                  type="button"
                  onClick={handleGenerateNewCode}
                  className="absolute right-3 top-0 cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors"
                  title="Generate new code"
                >
                  <MdAutorenew size={20} />
                </button>
              )}
              {!selectedPromo && (
                <p className="text-xs text-gray-500 mt-1">
                  We've generated a code for you. Feel free to edit it or
                  generate a new one.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="discountType"
                label="Discount Type"
                type="select"
                options={[{ label: "Percentage", value: "Percentage" }]}
                value={formik.values.discountType}
                onChange={formik.handleChange}
                error={
                  formik.touched.discountType && formik.errors.discountType
                }
                isRequired
              />

              <InputField
                name="discountValue"
                label={
                  formik.values.discountType === "Percentage"
                    ? "Discount Percentage"
                    : "Discount Amount"
                }
                type="number"
                placeholder={
                  formik.values.discountType === "Percentage"
                    ? "set discount percentage"
                    : "set fixed discount amount"
                }
                value={formik.values.discountValue}
                onChange={formik.handleChange}
                error={
                  formik.touched.discountValue && formik.errors.discountValue
                }
                isRequired
                icon={
                  formik.values.discountType === "Percentage" ? (
                    <MdPercent />
                  ) : (
                    <MdAttachMoney />
                  )
                }
              />
            </div>

            {/* {formik.values.discountType === "Percentage" && (
              <InputField
                name="maxDiscountAmount"
                label="Maximum Discount Amount"
                type="number"
                placeholder="set Maximum Discount Amount"
                value={formik.values.maxDiscountAmount}
                onChange={formik.handleChange}
                error={
                  formik.touched.maxDiscountAmount &&
                  formik.errors.maxDiscountAmount
                }
                isRequired
                icon={<MdAttachMoney />}
              />
            )} */}

            <InputField
              name="minOrderAmount"
              label="Minimum Order Amount"
              type="number"
              placeholder="set Minimum Order Amount"
              value={formik.values.minOrderAmount}
              onChange={formik.handleChange}
              error={
                formik.touched.minOrderAmount && formik.errors.minOrderAmount
              }
              isRequired
              icon={<MdAttachMoney />}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="startDate"
                label="Start Date"
                type="date"
                value={formatDate(formik.values.startDate)}
                onChange={formik.handleChange}
                error={formik.touched.startDate && formik.errors.startDate}
                isRequired
              />

              <InputField
                name="endDate"
                label="End Date"
                type="date"
                value={formatDate(formik.values.endDate)}
                onChange={formik.handleChange}
                error={formik.touched.endDate && formik.errors.endDate}
                isRequired
              />
            </div>

            <InputField
              name="maxUses"
              label="Maximum Uses"
              type="number"
              placeholder="set maximum uses of PROMO CODE"
              value={formik.values.maxUses}
              onChange={formik.handleChange}
              error={formik.touched.maxUses && formik.errors.maxUses}
              isRequired
            />
            {/* 
                    <InputField
                        name="isActive"
                        label="isActive"
                        type="isActive"
                        checked={formik.values.isActive}
                        onChange={formik.handleChange}
                        error={formik.touched.isActive && formik.errors.isActive}
                        options={[
                            { label: 'Active', value: true },
                            { label: 'Inactive', value: false },
                        ]}
                    /> */}
            <InputField
              name="description"
              label="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && formik.errors.description}
            />
          </form>
        </SidebarField>
      )}

      {deleteModal && (
        <DeleteModal
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
          title="Delete Promo Code"
          message={`Are you sure you want to delete the promo code "${deleteModal.code}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default PromoCodeManagement;
