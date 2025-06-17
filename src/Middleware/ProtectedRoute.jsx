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
const ProtectedRoute = ({ children }) => {
    return children;
};

export default ProtectedRoute;

export const PublicRoute = ({ children }) => {
    return children;
};
