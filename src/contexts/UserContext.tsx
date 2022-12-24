import React, { createContext, useContext } from "react";
import { User } from "../@types";

type Value = {
  data: User;
  forceUpdate: React.DispatchWithoutAction;
};
const UserContext = createContext<Value | undefined>(undefined);

export const UserContextProvider = ({
  value,
  children,
}: {
  value: Value;
  children: React.ReactNode;
}) => {
  return (
    <UserContext.Provider value={{ ...value }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) throw new Error("UserContextProvider not found");
  return user;
};
