import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";

import WithAuthentication from "./components/WithAuthentication";
import Main from "./pages/Main";
import Home from "./pages/Main/Home";
import Login from "./pages/Login";
import KakaoLogin from "./pages/KakaoLogin";
import SignUp from "./pages/SignUp";
import Question from "./pages/Question";

import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AuthContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            <WithAuthentication>
              <Main />
            </WithAuthentication>
          }
        >
          <Route index element={<Home />} />
          <Route path="question" element={<Question />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/callback/kakaotalk" element={<KakaoLogin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </AuthContextProvider>
  </BrowserRouter>
);
