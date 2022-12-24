import React, { createContext, useContext } from "react";
import { Question } from "../@types";

type TodayQuestion = {
  data: Question | null;
  forceUpdate: React.DispatchWithoutAction;
};
const TodayQuestionContext = createContext<TodayQuestion | undefined>(
  undefined
);

export const TodayQuestionContextProvider = ({
  value,
  children,
}: {
  value: TodayQuestion;
  children: React.ReactNode;
}) => {
  return (
    <TodayQuestionContext.Provider value={{ ...value }}>
      {children}
    </TodayQuestionContext.Provider>
  );
};

export const useTodayQuestion = () => {
  const todayQuestion = useContext(TodayQuestionContext);
  if (!todayQuestion) throw new Error("TodayQuestionContextProvider not found");
  return todayQuestion;
};
