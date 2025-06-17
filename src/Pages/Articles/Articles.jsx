import React, { useEffect, useState } from "react";
import SidebarField from "../../Components/SideBarField";
import InputField from "../../Components/InputField";
import Button from "../../Components/Button";
import { useFormik } from "formik";
import { FaTimes, FaUpload } from "react-icons/fa";
import { ArticleApi } from "../../Api/ArticleApis";
import { toFormData } from "../formHandling";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Articles = () => {
  const [addModal, setAddModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [allArticles, setAllArticles] = useState(null);

  const getAllArticles = async () => {
    try {
      const res = await ArticleApi.getAllArticles();
      console.log("All Articles:", res?.data?.data);
      setAllArticles(res?.data?.data);
    } catch (err) {
      toast.error(err);
    }
  };

  const formik = useFormik({
    // Changed from function to direct object
    initialValues: {
      title: selectedArticle?.title || "",
      description: selectedArticle?.description || "",
      image: selectedArticle?.image || null,
    },
    onSubmit: async (values) => {
      const formData = toFormData(values);
      console.log("formData", formData);
      try {
        const res = await ArticleApi.createArticle(formData);
        toast.success("Article created Successfully");
        // getAllBoooking();
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        formik.resetForm();
        setAddModal(false);
        setImagePreview(null);
        getAllArticles();
        setSelectedArticle(null);
      }
    },
  });

  useEffect(() => {
    getAllArticles();
  }, []);

  const handleImageUpload = (isServiceType, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (isServiceType) {
        serviceTypeFormik.setFieldValue("image", file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        formik.setFieldValue("image", file);
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      alert("Please upload a valid image");
    }
  };

  return (
    <>
      <div className="p-5 ">
        <div className="flex justify-between mb-5">
          <h2 className="text-primary text-3xl font-semibold">Articles</h2>
          <button
            className="bg-primary rounded-full text-white px-4 py-2  top-30 right-10"
            onClick={() => setAddModal(true)}
          >
            Add New
          </button>
        </div>

        <ArticleCard articles={allArticles} />
      </div>
      {addModal && (
        <SidebarField
          title="New Article"
          handleClose={() => {
            setAddModal(false);
            formik.resetForm();
            setSelectedRow(null);
          }}
          button1={
            <Button
              onClick={formik.handleSubmit}
              text={selectedArticle?._id ? "Update" : "Save"}
              type="submit"
            />
          }
          button2={
            <Button
              variant="outline"
              onClick={() => formik.resetForm()}
              text="Clear"
            />
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="my-4">
              <InputField
                name="title"
                label="title"
                type="text"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && formik.errors.title}
                isRequired
              />
            </div>

            <div className="border p-4 rounded-lg ">
              <h3 className="text-xl font-semibold mb-4">Upload Image</h3>
              <div className="relative w-full h-48 border-dashed border-2 rounded-lg overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer text-primary">
                    <FaUpload className="mr-2" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(false, e)}
                      className="absolute inset-0 opacity-0"
                    />
                  </label>
                )}
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => handleCancelImage(false)}
                  className="mt-2 text-red-600 flex items-center gap-1"
                >
                  <FaTimes /> Cancel
                </button>
              )}
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-600">{formik.errors.image}</p>
              )}
            </div>

            <div className="my-4">
              <InputField
                name="description"
                label="Description"
                type="textarea"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && formik.errors.description}
                isRequired
              />
            </div>
          </form>
        </SidebarField>
      )}
    </>
  );
};

export default Articles;

const ArticleCard = ({ articles }) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles &&
        articles.map((article) => (
          <div
            key={article._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Article Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="p-6">
              {/* Article Title */}
              <h2 className="text-xl font-bold mb-2 capitalize">
                {article.title}
              </h2>

              {/* Article Date */}
              <p className="text-gray-500 text-sm mb-4">
                {format(new Date(article.createdAt), "MMMM dd, yyyy")}
              </p>

              {/* Article Description (truncated) */}
              <p className="text-gray-700 mb-4 line-clamp-3">
                {article.description}
              </p>

              {/* Read More Button */}
              <button
                className="mt-4 text-sm font-semibold text-blue-900 hover:underline"
                onClick={() => navigate(`tips/${article?._id}`)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};
