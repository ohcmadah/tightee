import { useLocation } from "react-router-dom";
import {
  SignUpContextProvider,
  useSignUpState,
} from "../../contexts/SignUpContext";

import Layout from "../../components/Layout";
import { Agreement } from "./Agreement";

const Main = () => {
  const { step } = useSignUpState();
  switch (step) {
    case "AGREEMENT":
      return <Agreement />;

    case "PROFILE":
      return <div></div>;

    case "SUBMITTING":
      return <div></div>;

    default:
      return <div></div>;
  }
};

const SignUp = () => {
  const location = useLocation();
  const { firebaseToken, user } = location.state;

  return (
    <SignUpContextProvider>
      <Layout className="py-16">
        <Main />
      </Layout>
    </SignUpContextProvider>
  );
};

export default SignUp;
