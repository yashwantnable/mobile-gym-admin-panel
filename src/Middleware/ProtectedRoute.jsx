// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//     const { isAuthenticated } = useSelector((state) => state.store);

//     return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

// export const PublicRoute = ({ children }) => {
//     const { isAuthenticated } = useSelector((state) => state.store);

//     return isAuthenticated ? <Navigate to="/" replace /> : children;
// };


// This version just always renders the children, no matter what
// const ProtectedRoute = ({ children }) => {
//     return children;
// };

// export default ProtectedRoute;

// export const PublicRoute = ({ children }) => {
//     return children;
// };


import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Protects a route from unauthorized or unauthorized-role access.
 * @param {ReactNode} children - The protected content.
 * @param {string[]} allowedRoles - Optional list of roles allowed on this route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated } = useSelector((state) => state.store);
  const role = useSelector((state) => state.store?.role?.name);
  console.log("role:",role);
  
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // or a 403 page
  }

  return children;
};

export default ProtectedRoute;

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.store);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};
