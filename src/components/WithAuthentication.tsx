import { Navigate } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";

import Error from "./Error";
import Loading from "./Loading";

const WithAuthentication = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthState();

  switch (auth.state) {
    case "loading":
      return <Loading.Full />;

    case "loaded":
      if (auth.isAuthentication) {
        return <>{children}</>;
      } else {
        return <Navigate to="/login" replace />;
      }

    case "error":
      return <Error.Default />;
  }
};

export default WithAuthentication;
