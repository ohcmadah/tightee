import { createContext, Dispatch, useContext, useReducer } from "react";
import { setProperty } from "../common/utils";

export type AgreementState = {
  age: boolean;
  personal: boolean;
  terms: boolean;
  marketing: boolean;
};

export type ProfileState = {
  nickname: string;
  region: string;
  birthdate: Date;
  gender: number;
  MBTI?: string;
};

type Error = string;
export type Errors = {
  agreement?: Error;
  profile?: Record<string, Error>;
} | null;

type SignUpState = {
  step: "AGREEMENT" | "PROFILE" | "SUBMITTING";
  errors: Errors;
  agreement: AgreementState;
  profile: ProfileState;
};

const SignUpStateContext = createContext<SignUpState | undefined>(undefined);

type Action =
  | { type: "UPDATE"; key: string; value: any }
  | { type: "NEXT" }
  | { type: "PREV" };

type SignUpDispatch = Dispatch<Action>;
const SignUpDispatchContext = createContext<SignUpDispatch | undefined>(
  undefined
);

const agreementValidator = (values: SignUpState): Errors => {
  const {
    agreement: { age, personal, terms },
    profile,
  } = values;
  if (!age || !personal || !terms) {
    return { agreement: "서비스 이용을 위해 필수 약관에 동의해 주세요!" };
  }

  return null;
};

const profileValidator = (values: SignUpState): Errors => {
  const { profile } = values;

  const errorByKeyMap: { [key: string]: Error } = {
    nickname: "닉네임이 입력되지 않았어요.",
    region: "지역이 선택되지 않았어요.",
    birthdate: "생년월일을 정확하게 입력해주세요.",
    gender: "성별이 선택되지 않았어요.",
  };
  const profileErrors = Object.entries(profile).reduce((acc, [key, value]) => {
    if (!value) {
      const errorMsg = errorByKeyMap[key];
      return { ...acc, [key]: errorMsg };
    }
    return acc;
  }, {});
  if (Object.keys(profileErrors).length !== 0) {
    return { profile: profileErrors };
  }

  return null;
};

const signUpReducer = (state: SignUpState, action: Action): SignUpState => {
  switch (action.type) {
    case "UPDATE":
      return setProperty<SignUpState>(state, action.key, action.value);

    case "NEXT":
      if (state.step === "AGREEMENT") {
        const errors = agreementValidator(state);
        return { ...state, errors, step: errors ? state.step : "PROFILE" };
      } else {
        const errors = profileValidator(state);
        return { ...state, errors, step: errors ? state.step : "SUBMITTING" };
      }

    case "PREV":
      if (state.step === "PROFILE") {
        return { ...state, step: "AGREEMENT" };
      } else {
        return state;
      }

    default:
      throw new Error("Unhandled action");
  }
};

export const SignUpContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [signUpState, dispatch] = useReducer(signUpReducer, {
    step: "AGREEMENT",
    errors: null,
    agreement: {
      age: false,
      personal: false,
      terms: false,
      marketing: false,
    },
    profile: {
      nickname: "",
      region: "",
      birthdate: new Date(),
      gender: 0,
    },
  });
  return (
    <SignUpDispatchContext.Provider value={dispatch}>
      <SignUpStateContext.Provider value={signUpState}>
        {children}
      </SignUpStateContext.Provider>
    </SignUpDispatchContext.Provider>
  );
};

export const useSignUpState = () => {
  const state = useContext(SignUpStateContext);
  if (!state) throw new Error("SignUpProvider not found");
  return state;
};

export const useSignUpDispatch = () => {
  const dispatch = useContext(SignUpDispatchContext);
  if (!dispatch) throw new Error("SignUpProvider not found");
  return dispatch;
};
