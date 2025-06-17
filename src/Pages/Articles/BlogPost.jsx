import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputField from '../../Components/InputField';
import { useParams } from 'react-router-dom';
import { ArticleApi } from '../../Api/ArticleApis';


const BlogPost = () => {
    const { id } = useParams();
    console.log("orderId:",id);
    
    const [showComments, setShowComments] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [singleArticle, setSingleArticle] = useState(null);
    const [comments, setcomments] = useState([]);

    const getSingleArticle=async()=>{
        const res=await ArticleApi.getSingleArticle(id);
        setSingleArticle(res?.data?.data)
    }
    useEffect(()=>{
        getSingleArticle();
    },[id])

    console.log("singleArticle:",singleArticle);
    
  // Formik configuration
  const formik = useFormik({
    initialValues: {
      comment: '',
      name: '',
      email: '',
      website: '',
      saveInfo: false
    },
    validationSchema: Yup.object({
      comment: Yup.string().required('Comment is required'),
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      website: Yup.string().url('Must be a valid URL')
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      // Here you would typically send the data to your backend
      formik.resetForm();
      setShowForm(false);
    },
  });
  return (
     <>
     <div className="max-w-3xl mx-auto px-4 py-8">
      
      <p className="text-gray-500 text-sm mb-8 flex justify-center">{singleArticle?.createdAt}</p>
      
      <h1 className="text-5xl py-5 font-bold mb-6 flex justify-center capitalize">{singleArticle?.title}</h1>

      <img src={singleArticle?.image} alt="" 
      className='w-[50vw] rounded-2xl mx-auto'/>
      
      
      
     
      <div className="space-y-4 py-6 text-gray-600 text-lg font-sans leading-relaxed">
        {singleArticle?.description}
      </div>
      
      {/* Tags */}
    </div>
      <h2 className="text-xl font-bold mb-6 flex justify-center">Tags</h2>
      <div className="mt-12 border-t border-gray-200 pt-8 bg-gray-50 w-[50vw] mx-auto px-10">
      
      <div className="mb-8 ">
        <h3 className="text-lg font-medium mb-4 flex justify-center border-b border-gray-300 py-10">What do you think?</h3>
        
        <div className="flex items-center justify-center mb-6 ">
          <button 
            onClick={() => {
              setShowComments(!showComments);
              setShowForm(false);
            }}
            className={`px-4 py-2 rounded ${showComments ? ' text-primary' : ' text-gray-600'}`}
          >
            Show comments
          </button>
          <span className='text-gray-600'>/</span>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              setShowComments(false);
            }}
            className={`font-sans px-4 py-2 rounded ${showForm ? ' text-primary' : ' text-gray-600'}`}
          >
            Leave a comment
          </button>
        </div>

        {/* Comments List */}
        {showComments && (
          <div className="mb-8">
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.name}</span>
                      <span className="text-gray-500 text-sm">{comment.date}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments available yet.</p>
            )}
          </div>
        )}

        {/* Comment Form */}
        {showForm && (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <h4 className="text-lg font-medium text-gray-500">Leave a Reply</h4>
            <p className="text-sm text-gray-500">
              Your email address will not be published. Required fields are marked *
            </p>

            {/* Comment Field */}
            <div>
                <InputField
                  label="comment"
                  name="comment"
                  type="textarea"
                  placeholder="enter a comment"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.comment && formik.errors.comment}
                  isRequired
                />
            </div>

            {/* Name Field */}
            <div>
             <InputField
                  label="name"
                  name="name"
                  type="text"
                  placeholder="enter a name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                  isRequired
                />
            </div>

            {/* Email Field */}
            <div>
              <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              isRequired/>
            </div>

            {/* Website Field */}
            <div>
              <InputField
              label="Website"
              name="website"
              type="url"
              placeholder="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.website && formik.errors.website}
              />
            </div>

            {/* Save Info Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveInfo"
                name="saveInfo"
                className="mr-2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.saveInfo}
              />
              <label htmlFor="saveInfo" className="text-sm text-gray-500">
                Save my name, email, and website in this browser for the next time I comment.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary text-lg text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors"
            >
              Post Comment
            </button>
          </form>
        )}
      </div>
    </div>
    </>
   
  );
};

export default BlogPost;