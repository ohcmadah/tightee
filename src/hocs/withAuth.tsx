import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "firebase/auth";
import ErrorView from "../components/ErrorView";
import Loading from "../components/Loading";
import { useAuthState } from "../contexts/AuthContext";

type Props = { auth?: User };

const withAuth = (
  Component: React.FC<Props>,
  option: "auth" | "guest" = "auth"
) => {
  return () => {
    const auth = useAuthState();

    switch (auth.state) {
      case "loading":
        return <Loading.Full />;

      case "loaded":
        if (option === "guest") {
          return auth.isAuthentication ? (
            <Navigate to="/" replace />
          ) : (
            <Component />
          );
        } else {
          return auth.isAuthentication ? (
            <Component auth={auth.user} />
          ) : (
            <Navigate to="/login" replace />
          );
        }

      case "error":
        return <ErrorView.Default />;
    }
  };
};

export default withAuth;
