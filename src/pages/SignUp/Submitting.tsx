import { useEffect, useState } from "react";
import { User } from "../../@types";
import { createUser } from "../../common/apis";
import { SignUpState, useSignUpState } from "../../contexts/SignUpContext";

import Spinner from "../../components/Spinner";
import { Navigate } from "react-router-dom";

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
          setIsDone(true);
        } catch (error) {}
      }
    })();
  }, []);

  return isDone ? (
    <Navigate to="/" replace />
  ) : (
    <div className="h-full w-full">
      <Spinner.Big />
    </div>
  );
};

export default Submitting;
