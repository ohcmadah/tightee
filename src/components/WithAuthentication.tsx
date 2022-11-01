import { Navigate } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import Loading from "./Loading";

const WithAuthentication = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuthState();

  if (isLoading) {
    return <Loading.Full />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default WithAuthentication;
