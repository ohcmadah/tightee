import { createContext, Dispatch, useContext, useReducer } from "react";
import { setProperty } from "../common/utils";

export type AgreementState = {
  age: boolean;
  personal: boolean;
  terms: boolean;
  marketing: boolean;
};

type Error = string | null;

type SignUpState = {
  step: "AGREEMENT" | "PROFILE" | "SUBMITTING";
  error: Error;
  agreement: AgreementState;
};

const SignUpStateContext = createContext<SignUpState | undefined>(undefined);

type Action = { type: "UPDATE"; key: string; value: any } | { type: "NEXT" };

type SignUpDispatch = Dispatch<Action>;
const SignUpDispatchContext = createContext<SignUpDispatch | undefined>(
  undefined
);

const agreementValidator = (values: AgreementState): Error => {
  const { age, personal, terms } = values;
  if (!age || !personal || !terms) {
    return "서비스 이용을 위해 필수 약관에 동의해 주세요!";
  }
  return null;
};

const signUpReducer = (state: SignUpState, action: Action): SignUpState => {
  switch (action.type) {
    case "UPDATE":
      return setProperty<SignUpState>(state, action.key, action.value);

    case "NEXT":
      const { step, agreement } = state;
      if (step === "AGREEMENT") {
        const error = agreementValidator(agreement);
        return error ? { ...state, error } : { ...state, step: "PROFILE" };
      } else {
        return { ...state, step: "SUBMITTING" };
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
    error: null,
    agreement: {
      age: false,
      personal: false,
      terms: false,
      marketing: false,
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
