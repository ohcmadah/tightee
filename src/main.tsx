import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useGoogleTagManager from "./hooks/useGoogleTagManager";
import useMetaPixcel from "./hooks/useMetaPixel";

import Routes from "./Routes";

import "./styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  useGoogleAnalytics();
  useGoogleTagManager();
  useMetaPixcel();

  return <Routes />;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AuthContextProvider>
      <Main />
    </AuthContextProvider>
  </BrowserRouter>
);
