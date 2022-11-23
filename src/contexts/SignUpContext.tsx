import { createContext, Dispatch, useContext, useReducer } from "react";
import { setProperty } from "../common/utils";
import { Auth, FormError } from "../@types";
import { agreementValidator, profileValidator } from "../common/validators";

export type AgreementValues = {
  age: boolean;
  personal: boolean;
  terms: boolean;
  marketing: boolean;
};

export type ProfileValues = {
  nickname: string;
  region: string;
  birthdate: { year?: string; month?: string; day?: string };
  gender?: string;
  MBTI?: string;
};

export type SignUpState = {
  token: string;
  id: string;
  email?: string;
  step: "AGREEMENT" | "PROFILE" | "SUBMITTING";
  errors: FormError;
  agreement: AgreementValues;
  profile: ProfileValues;
};

const SignUpStateContext = createContext<SignUpState | undefined>(undefined);

type Action =
  | { type: "UPDATE"; payload: { key: string; value: any } }
  | { type: "NEXT" }
  | { type: "PREV" };

type SignUpDispatch = Dispatch<Action>;
const SignUpDispatchContext = createContext<SignUpDispatch | undefined>(
  undefined
);

const isValid = (errors: object) => Object.keys(errors).length === 0;

const signUpReducer = (state: SignUpState, action: Action): SignUpState => {
  switch (action.type) {
    case "UPDATE":
      return setProperty<SignUpState>(
        state,
        action.payload.key,
        action.payload.value
      );

    case "NEXT":
      if (state.step === "AGREEMENT") {
        const errors = agreementValidator(state.agreement);
        return {
          ...state,
          errors,
          step: isValid(errors) ? "PROFILE" : "AGREEMENT",
        };
      } else if (state.step === "PROFILE") {
        const errors = profileValidator(state.profile);
        return {
          ...state,
          errors: { profile: errors },
          step: isValid(errors) ? "SUBMITTING" : "PROFILE",
        };
      }
      return state;

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
  auth,
  children,
}: {
  auth: Auth;
  children: React.ReactNode;
}) => {
  const { kakaoUser, firebaseToken } = auth;
  const month = kakaoUser.birthday?.substring(0, 2);
  const [signUpState, dispatch] = useReducer(signUpReducer, {
    id: kakaoUser.id,
    email: kakaoUser.email,
    token: firebaseToken,
    step: "AGREEMENT",
    errors: {},
    agreement: {
      age: false,
      personal: false,
      terms: false,
      marketing: false,
    },
    profile: {
      nickname: kakaoUser.nickname || "",
      region: "",
      birthdate: {
        month: month?.startsWith("0") ? month.substring(1) : month,
        day: kakaoUser.birthday?.substring(2),
      },
      gender: kakaoUser.gender,
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
