import { Navigate, useLocation } from "react-router-dom";
import {
  SignUpContextProvider,
  useSignUpState,
} from "../../contexts/SignUpContext";

import Layout from "../../components/Layout";
import { Agreement } from "./Agreement";
import { Profile } from "./Profile";

const Main = () => {
  const { step } = useSignUpState();
  switch (step) {
    case "AGREEMENT":
      return <Agreement />;

    case "PROFILE":
      return <Profile />;

    case "SUBMITTING":
      return <div></div>;

    default:
      return <div></div>;
  }
};

const SignUp = () => {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/" />;
  }

  const { firebaseToken, user } = state;

  return (
    <SignUpContextProvider>
      <Layout className="py-16">
        <Main />
      </Layout>
    </SignUpContextProvider>
  );
};

export default SignUp;
