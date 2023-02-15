import React, { createContext, useContext } from "react";
import { User } from "../@types";
import { getUser } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";

type APIResponse = ReturnType<typeof useAsyncAPI<typeof getUser>>;
type Value =
  | { isLoading: true; data: null; forceUpdate: React.DispatchWithoutAction }
  | {
      isLoading: false;
      data: User | null | Error;
      forceUpdate: React.DispatchWithoutAction;
    };
const UserContext = createContext<Value | undefined>(undefined);

export const UserContextProvider = ({
  response,
  children,
}: {
  response: APIResponse;
  children: React.ReactNode;
}) => {
  return (
    <UserContext.Provider
      value={
        response.state === "loading"
          ? { isLoading: true, data: null, forceUpdate: response.forceUpdate }
          : {
              isLoading: false,
              data:
                response.state === "error"
                  ? new Error(response.data as string)
                  : response.data,
              forceUpdate: response.forceUpdate,
            }
      }
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) throw new Error("UserContextProvider not found");
  return user;
};
