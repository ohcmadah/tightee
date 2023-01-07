import React, { createContext, useContext } from "react";
import { Question } from "../@types";

type TodayQuestions = {
  data: Question[] | null;
  forceUpdate: React.DispatchWithoutAction;
};
const TodayQuestionsContext = createContext<TodayQuestions | undefined>(
  undefined
);

export const TodayQuestionsContextProvider = ({
  value,
  children,
}: {
  value: TodayQuestions;
  children: React.ReactNode;
}) => {
  return (
    <TodayQuestionsContext.Provider value={{ ...value }}>
      {children}
    </TodayQuestionsContext.Provider>
  );
};

export const useTodayQuestions = () => {
  const todayQuestions = useContext(TodayQuestionsContext);
  if (!todayQuestions)
    throw new Error("TodayQuestionsContextProvider not found");
  return todayQuestions;
};
