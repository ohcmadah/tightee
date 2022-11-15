import { useState, useEffect } from "react";

const useAsyncAPI = <T,>(
  api: (...args: any[]) => Promise<T>,
  ...args: any[]
) => {
  type useAsyncAPIState = {
    data: T | null;
    isLoading: boolean;
    error: unknown | null;
  };

  const [state, setState] = useState<useAsyncAPIState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await api(...args);
        setState((prevValue) => ({ ...prevValue, data, isLoading: false }));
      } catch (error) {
        setState((prevValue) => ({ ...prevValue, error, isLoading: false }));
      }
    })();
  }, []);

  return state;
};

export default useAsyncAPI;
