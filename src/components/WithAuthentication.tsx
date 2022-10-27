import { Navigate } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";

const WithAuthentication = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuthState();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default WithAuthentication;
