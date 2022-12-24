import React, { createContext, useContext } from "react";
import { Answer } from "../@types";

type MyAnswers = {
  data: Answer[];
  forceUpdate: React.DispatchWithoutAction;
};
const MyAnswersContext = createContext<MyAnswers | undefined>(undefined);

export const MyAnswersContextProvider = ({
  value,
  children,
}: {
  value: MyAnswers;
  children: React.ReactNode;
}) => {
  return (
    <MyAnswersContext.Provider value={{ ...value }}>
      {children}
    </MyAnswersContext.Provider>
  );
};

export const useMyAnswers = () => {
  const myAnswers = useContext(MyAnswersContext);
  if (!myAnswers) throw new Error("MyAnswersContextProvider not found");
  return myAnswers;
};
