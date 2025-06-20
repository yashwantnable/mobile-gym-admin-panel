import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png";
import InputField from "../InputField";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import { login } from "../../store/slices/storeSlice";
import { useLoading } from "../loader/LoaderContext";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [isPwdShow, setIsPwdShow] = useState(false);
  const { handleLoading } = useLoading();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    emailOrPhone: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Email or phone is required"),
    password: Yup.string()
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      handleLoading(true);
      try {
        await dispatch(login(values)).unwrap();
        navigate("/");
      } catch (e) {
        console.error("Login error:", e);
        toast.error("Invalid credentials. Please try again.");
      } finally {
        handleLoading(false);
        formik.resetForm();
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Branding */}
      <div className="bg-primary w-full md:w-1/2 lg:w-2/5 min-h-[40vh] md:min-h-screen flex justify-center items-center p-8">
        <div className="max-w-md w-full">
          <img
            src={logo}
            alt="Company Logo"
            className="w-full h-auto max-h-60 object-contain"
          />
          <h1 className="text-white text-2xl md:text-3xl font-bold mt-6 text-center">
            Welcome Back
          </h1>
          <p className="text-white opacity-80 mt-2 text-center">
            Sign in to access your admin dashboard
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Admin Portal
            </h2>
            <p className="text-gray-600 mt-2">
              Please enter your credentials to login
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute left-0 pl-3 top-[2.80rem]  flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <InputField
                  name="emailOrPhone"
                  label="Email"
                  placeholder="Enter email"
                  value={formik.values.emailOrPhone}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
                  isRequired
                  className="w-full px-4 py-2 border rounded-lg outline-none border-[#d1d5db] pl-8"
                />

              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={isPwdShow ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full pl-8 pr-10 py-3 border border-gray-300 rounded-lg outline-none"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setIsPwdShow(!isPwdShow)}
                >
                  {isPwdShow ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div> */}

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary-dark cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-primary cursor-pointer hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium shadow-sm hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {formik.isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Optional: Footer links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Don't have an account?{' '}
              <button
                className="text-primary hover:text-primary-dark font-medium"
                onClick={() => navigate('#')}
              >
                Contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;