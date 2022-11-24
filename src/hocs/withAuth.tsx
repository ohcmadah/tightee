import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "firebase/auth";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { useAuthState } from "../contexts/AuthContext";

const withAuth = (Component: React.FC<{ auth?: User }>) => {
  return () => {
    const auth = useAuthState();

    switch (auth.state) {
      case "loading":
        return <Loading.Full />;

      case "loaded":
        if (auth.isAuthentication) {
          return <Component auth={auth.user} />;
        } else {
          return <Navigate to="/login" replace />;
        }

      case "error":
        return <Error.Default />;
    }
  };
};

export default withAuth;
