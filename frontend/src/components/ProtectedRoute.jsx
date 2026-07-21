import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Read login info from localStorage
  const user = localStorage.getItem("loggedInUser");

  // If user not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → render the child component
  return children;
}
