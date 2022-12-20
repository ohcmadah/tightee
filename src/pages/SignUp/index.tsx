import { Navigate, useLocation } from "react-router-dom";
import {
  SignUpContextProvider,
  useSignUpState,
} from "../../contexts/SignUpContext";

import Layout from "../../components/Layout";
import Agreement from "./Agreement";
import Profile from "./Profile";
import Submitting from "./Submitting";

const Main = () => {
  const { step } = useSignUpState();
  switch (step) {
    case "AGREEMENT":
      return <Agreement />;

    case "PROFILE":
      return <Profile />;

    case "SUBMITTING":
      return <Submitting />;
  }
};

const SignUp = () => {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/" />;
  }

  return (
    <SignUpContextProvider
      data={{ auth: state.auth, questionId: state.questionId }}
    >
      <Layout>
        <Main />
      </Layout>
    </SignUpContextProvider>
  );
};

export default SignUp;
