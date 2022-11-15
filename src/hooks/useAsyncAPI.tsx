import { useState, useEffect } from "react";
import useForceUpdate from "./useForceUpdate";

type useAsyncAPIState<T> =
  | {
      state: "loading";
      data: null;
    }
  | {
      state: "loaded";
      data: T;
    }
  | {
      state: "error";
      data: unknown;
    };

const useAsyncAPI = <T,>(
  api: (...args: any[]) => Promise<T>,
  ...args: any[]
) => {
  const [state, setState] = useState<useAsyncAPIState<T>>({
    state: "loading",
    data: null,
  });
  const { updated, forceUpdate } = useForceUpdate();

  useEffect(() => {
    (async () => {
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
