import { useState, useEffect } from "react";
import useForceUpdate from "./useForceUpdate";

type useAsyncAPIState<T> =
  | { state: "loading"; data: null }
  | { state: "loaded"; data: T }
  | { state: "error"; data: unknown };

type API = (...args: any[]) => Promise<any>;

const useAsyncAPI = <F extends API>(api: F, ...args: Parameters<F>) => {
  const [state, setState] = useState<useAsyncAPIState<Awaited<ReturnType<F>>>>({
    state: "loading",
    data: null,
  });
  const { updated, forceUpdate } = useForceUpdate();

  useEffect(() => {
    (async () => {
      setState({ state: "loading", data: null });
      try {
        const data = await api(...args);
        setState(() => ({ state: "loaded", data }));
      } catch (error) {
        setState(() => ({ state: "error", data: error }));
      }
    })();
  }, [updated]);

  return { ...state, forceUpdate };
};

export default useAsyncAPI;
