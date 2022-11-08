import { createContext, Dispatch, useContext, useReducer } from "react";
import { setProperty } from "../common/utils";
import { AuthResponse } from "../@types";
import { profileValidator } from "../common/validators";

export type AgreementState = {
  age: boolean;
  personal: boolean;
  terms: boolean;
  marketing: boolean;
};

export type ProfileState = {
  nickname: string;
  region: string;
  birthdate: { year?: string; month?: string; day?: string };
  gender?: string;
  MBTI?: string;
};

type Error = string;
export type Errors = {
  agreement?: Error;
  profile?: Record<string, Error>;
} | null;

export type SignUpState = {
  token: string;
  id: string;
  email?: string;
  step: "AGREEMENT" | "PROFILE" | "SUBMITTING";
  errors: Errors;
  agreement: AgreementState;
  profile: ProfileState;
};

const SignUpStateContext = createContext<SignUpState | undefined>(undefined);

type Action =
  | { type: "UPDATE"; key: string; value: any }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SUBMIT" };

type SignUpDispatch = Dispatch<Action>;
const SignUpDispatchContext = createContext<SignUpDispatch | undefined>(
  undefined
);

const agreementValidator = (values: SignUpState): Errors => {
  const {
    agreement: { age, personal, terms },
  } = values;
  if (!age || !personal || !terms) {
    return { agreement: "서비스 이용을 위해 필수 약관에 동의해 주세요!" };
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
        return state;
      }

    case "PREV":
      if (state.step === "PROFILE") {
        return { ...state, step: "AGREEMENT" };
      } else {
        return state;
      }

    case "SUBMIT":
      const errors = profileValidator(state.profile);
      return { ...state, errors, step: errors ? state.step : "SUBMITTING" };

    default:
      throw new Error("Unhandled action");
  }
};

export const SignUpContextProvider = ({
  auth,
  children,
}: {
  auth: AuthResponse["data"];
  children: React.ReactNode;
}) => {
  const [signUpState, dispatch] = useReducer(signUpReducer, {
    id: auth.kakaoUser.id,
    email: auth.kakaoUser.email,
    token: auth.firebaseToken,
    step: "AGREEMENT",
    errors: null,
    agreement: {
      age: false,
      personal: false,
      terms: false,
      marketing: false,
    },
    profile: {
      nickname: auth.kakaoUser.nickname || "",
      region: "",
      birthdate: {
        month: auth.kakaoUser.birthday?.substring(0, 2),
        day: auth.kakaoUser.birthday?.substring(2),
      },
      gender: auth.kakaoUser.gender,
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
