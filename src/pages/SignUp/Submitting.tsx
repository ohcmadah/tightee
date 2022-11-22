import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../config";
import { User } from "../../@types";
import { createUser } from "../../common/apis";
import { SignUpState, useSignUpState } from "../../contexts/SignUpContext";
import { convertBirthdateToUTC } from "../../common/utils";
import useAsyncAPI from "../../hooks/useAsyncAPI";

import Loading from "../../components/Loading";
import Error from "../../components/Error";

const convertStateToUser = (state: SignUpState): User | null => {
  const { gender } = state.profile;
  const birthdate = convertBirthdateToUTC(state.profile.birthdate);

  if (!gender || !birthdate) {
    return null;
  }

  const user: User = {
    id: state.id,
    email: state.email || null,
    nickname: state.profile.nickname,
    region: state.profile.region,
    birthdate: birthdate,
    gender: gender,
    MBTI: state.profile.MBTI || null,
    subscribe: {
      marketing: state.agreement.marketing,
    },
  };

  return user;
};

const register = async (state: SignUpState) => {
  const user = convertStateToUser(state);
  if (user) {
    await createUser(user);
    await signInWithCustomToken(auth, state.token);
  }
};

const Submitting = () => {
  const signUpState = useSignUpState();
  const { state } = useAsyncAPI(register, signUpState);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      return <Navigate to="/" replace />;
  }
};

export default Submitting;
