import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../../config";
import { User } from "../../@types";
import { createUser } from "../../api/user";
import { SignUpState, useSignUpState } from "../../contexts/SignUpContext";
import { convertBirthdateToUTC } from "../../common/utils";

import Loading from "../../components/Loading";
import ErrorView from "../../components/ErrorView";

const convertStateToUser = (state: SignUpState): User | null => {
  const { profile } = state;
  const birthdate = convertBirthdateToUTC(profile.birthdate);

  if (!profile.gender || !birthdate) {
    return null;
  }

  const user = {
    id: state.id,
    email: state.email || null,
    nickname: profile.nickname,
    region: profile.region,
    birthdate: birthdate,
    gender: profile.gender,
    MBTI: profile.MBTI || null,
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
  const { status, data } = useQuery({
    queryKey: ["signUp", signUpState.id],
    queryFn: () => register(signUpState),
  });

  switch (status) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default>{`${data}`}</ErrorView.Default>;

    case "success":
      return <Navigate to={signUpState.nextUrl} replace />;
  }
};

export default Submitting;
