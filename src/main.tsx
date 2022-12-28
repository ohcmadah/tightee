import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useGoogleTagManager from "./hooks/useGoogleTagManager";
import useMetaPixcel from "./hooks/useMetaPixel";

import Main from "./pages/Main";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import KakaoLogin from "./pages/KakaoLogin";
import SignUp from "./pages/SignUp";
import Question from "./pages/Question";
import Profile from "./pages/Profile";
import Answers from "./pages/Answers";
import DeleteAccount from "./pages/DeleteAccount";
import Report from "./pages/Report";
import Ad from "./pages/Ad";

import "./styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  useGoogleAnalytics();
  useGoogleTagManager();
  useMetaPixcel();

  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="question" element={<Question />} />
        <Route path="question/:questionId" element={<Question />} />
        <Route path="profile" element={<Profile />} />
        <Route path="delete-account" element={<DeleteAccount />} />
        <Route path="answer" element={<Answers />} />
        <Route path="answer/:answerId/report" element={<Report />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/Welcome" element={<Welcome />} />
      <Route path="/callback/kakaotalk" element={<KakaoLogin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/:answerId/public" element={<Report isPublic />} />
      <Route path="/result" element={<Ad />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </BrowserRouter>
);
