import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../../config";
import { User } from "../../@types";
import { createUser } from "../../common/apis";
import { SignUpState, useSignUpState } from "../../contexts/SignUpContext";

import Loading from "../../components/Loading";

const convertStateToUser = (state: SignUpState): User | null => {
  const {
    birthdate: { year, month, day },
    gender,
  } = state.profile;

  if (!year || !month || !day || !gender) {
    return null;
  }

  const user: User = {
    id: state.id,
    email: state.email || null,
    nickname: state.profile.nickname,
    region: state.profile.region,
    birthdate: Date.UTC(parseInt(year), parseInt(month), parseInt(day)),
    gender: gender,
    MBTI: state.profile.MBTI || null,
    subscribe: {
      marketing: state.agreement.marketing,
    },
  };

  return user;
};

const Submitting = () => {
  const [isDone, setIsDone] = useState(false);
  const state = useSignUpState();

  useEffect(() => {
    (async () => {
      const user = convertStateToUser(state);
      if (user) {
        try {
          await createUser(user);
          await signInWithCustomToken(auth, state.token);
          setIsDone(true);
        } catch (error) {}
      }
    })();
  }, []);

  return isDone ? <Navigate to="/" replace /> : <Loading.Full />;
};

export default Submitting;
