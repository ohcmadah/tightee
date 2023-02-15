import React, { createContext, useContext } from "react";
import { Question } from "../@types";
import { getTodayQuestions } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";

type APIResponse = ReturnType<typeof useAsyncAPI<typeof getTodayQuestions>>;
type TodayQuestions =
  | {
      isLoading: false;
      data: Question[] | null | Error;
      forceUpdate: React.DispatchWithoutAction;
    }
  | { isLoading: true; data: null; forceUpdate: React.DispatchWithoutAction };
const TodayQuestionsContext = createContext<TodayQuestions | undefined>(
  undefined
);

export const TodayQuestionsContextProvider = ({
  response,
  children,
}: {
  response: APIResponse;
  children: React.ReactNode;
}) => {
  return (
    <TodayQuestionsContext.Provider
      value={
        response.state === "loading"
          ? { isLoading: true, data: null, forceUpdate: response.forceUpdate }
          : response.state === "error"
          ? {
              isLoading: false,
              data: new Error(response.data as string),
              forceUpdate: response.forceUpdate,
            }
          : {
              isLoading: false,
              data: response.data.status === 204 ? null : response.data.data,
              forceUpdate: response.forceUpdate,
            }
      }
    >
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
