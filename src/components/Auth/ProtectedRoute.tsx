import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/Context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // roles allowed to access this route
  adminOnly?: boolean;     // shortcut for admin-only
}

const ProtectedRoute = ({ children, allowedRoles, adminOnly }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext);

  // Login check
  if (!user) return <Navigate to="/login" replace />;

  // Admin only shortcut
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed roles check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;