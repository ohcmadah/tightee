import { useReducer } from "react";

const useForceUpdate = () => {
  const [updated, forceUpdate] = useReducer((state) => !state, false);
  return { updated, forceUpdate };
};

export default useForceUpdate;
