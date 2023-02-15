import React, { createContext, useContext } from "react";
import { Answer } from "../@types";
import { getMyAnswers } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";

type APIReponse = ReturnType<typeof useAsyncAPI<typeof getMyAnswers>>;
type MyAnswers =
  | {
      isLoading: true;
      data: null;
      forceUpdate: React.DispatchWithoutAction;
    }
  | {
      isLoading: false;
      data: Answer[] | Error;
      forceUpdate: React.DispatchWithoutAction;
    };
const MyAnswersContext = createContext<MyAnswers | undefined>(undefined);

export const MyAnswersContextProvider = ({
  response,
  children,
}: {
  response: APIReponse;
  children: React.ReactNode;
}) => {
  const { forceUpdate } = response;
  return (
    <MyAnswersContext.Provider
      value={
        response.state === "loading"
          ? { isLoading: true, data: null, forceUpdate }
          : {
              isLoading: false,
              data: response.state === "error" ? new Error() : response.data,
              forceUpdate,
            }
      }
    >
      {children}
    </MyAnswersContext.Provider>
  );
};

export const useMyAnswers = () => {
  const myAnswers = useContext(MyAnswersContext);
  if (!myAnswers) throw new Error("MyAnswersContextProvider not found");
  return myAnswers;
};
