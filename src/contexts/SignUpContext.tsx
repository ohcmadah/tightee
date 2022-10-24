import { createContext, Dispatch, useContext, useReducer } from "react";
import moment from "moment";
import { setProperty } from "../common/utils";
import { AuthResponse } from "../@types";

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
  gender?: number;
  MBTI?: string;
};

type Error = string;
export type Errors = {
  agreement?: Error;
  profile?: Record<string, Error>;
} | null;

type SignUpState = {
  token: string;
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

const birthdateValidator = (birthdate: ProfileState["birthdate"]): Error => {
  const { year, month, day } = birthdate;
  if (!year || !month || !day) {
    return "생년월일을 모두 입력해 주세요.";
  }

  const normalizedYear = year.padStart(4, "0");
  const normalizedDay = day.padStart(2, "0");

  const date = moment(`${normalizedYear}-${month}-${normalizedDay}`);
  const today = moment();

  if (!date.isValid() || date.isBefore("1900-01-01")) {
    return "생년월일을 정확하게 입력해 주세요.";
  }

  if (date.isAfter(today)) {
    return "미래에서 오셨군요!";
  }

  if (!date.isSameOrBefore(today.subtract(14, "years"))) {
    return "만 14세 이상만 가입이 가능합니다.";
  }

  return "";
};

const profileValidator = (values: SignUpState): Errors => {
  const { profile } = values;

  const emptyErrorByKeyMap: { [key: string]: Error } = {
    nickname: "닉네임이 입력되지 않았어요.",
    region: "지역이 선택되지 않았어요.",
    birthdate: "생년월일을 모두 입력해 주세요.",
    gender: "성별이 선택되지 않았어요.",
  };
  const emptyErrors = Object.entries(profile).reduce((acc, [key, value]) => {
    if (!value) {
      const errorMsg = emptyErrorByKeyMap[key];
      return { ...acc, [key]: errorMsg };
    }
    return acc;
  }, {});

  const birthdateError = birthdateValidator(profile.birthdate);
  const errors = {
    ...emptyErrors,
    birthdate: birthdateError,
  };

  if (Object.keys(errors).length !== 0) {
    return { profile: errors };
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
      const errors = profileValidator(state);
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
      nickname: auth.user.nickname || "",
      region: "",
      birthdate: {
        month: auth.user.birthday?.substring(0, 2),
        day: auth.user.birthday?.substring(2),
      },
      gender: auth.user.gender,
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
