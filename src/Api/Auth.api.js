import Api from '../Middleware/axios'

export const AuthApi = {
  register: (payload) => Api.post("user/register", payload),
  roleType: () => Api.get("role/get-all-role"),
  login: (authType, payload) => Api.post(`/auth/login/${authType}`, payload),
  logout: () => Api.post("auth/logout"),
  generateOTP: (payload) => Api.post("user/generate-otp", payload),
  otpVerification: (payload) => Api.post("user/verify-otp", payload),
  ResetPassword: (payload) => Api.post("user/reset-password", payload),
};
