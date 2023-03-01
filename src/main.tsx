import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContextProvider } from "./contexts/AuthContext";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useGoogleTagManager from "./hooks/useGoogleTagManager";
import useMetaPixcel from "./hooks/useMetaPixel";

import Routes from "./Routes";

import "./styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const Main = () => {
  useGoogleAnalytics();
  useGoogleTagManager();
  useMetaPixcel();

  return <Routes />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthContextProvider>
        <Main />
      </AuthContextProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
