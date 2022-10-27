import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useReducer, useRef } from "react";

interface State<T> {
  data?: T;
  error?: Error;
}

type Cache<T> = { [url: string]: T };

type Action<T> =
  | { type: "LOADING" }
  | { type: "FETCHED"; payload: T }
  | { type: "ERROR"; payload: Error };

const useFetch = <T,>(url?: string, options?: AxiosRequestConfig): State<T> => {
  const cache = useRef<Cache<T>>({});
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "LOADING":
        return { ...initialState };

      case "FETCHED":
        return { ...initialState, data: action.payload };

      case "ERROR":
        return { ...initialState, error: action.payload };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!url) {
      return;
    }

    cancelRequest.current = false;

    (async () => {
      dispatch({ type: "LOADING" });

      if (cache.current[url]) {
        dispatch({ type: "FETCHED", payload: cache.current[url] });
        return;
      }

      try {
        const res = await axios(url, options);
        if (res.status !== 200) {
          throw new Error(res.statusText);
        }

        const data = res.data as T;
        cache.current[url] = data;

        if (cancelRequest.current) {
          return;
        }

        dispatch({ type: "FETCHED", payload: data });
      } catch (error) {
        if (cancelRequest.current) {
          return;
        }

        dispatch({ type: "ERROR", payload: error as Error });
      }
    })();

    return () => {
      cancelRequest.current = true;
    };
  }, [url]);

  return state;
};

export default useFetch;
