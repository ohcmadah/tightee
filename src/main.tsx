import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import KakaoLogin, { kakaoLoader } from "./pages/KakaoLogin";
import SignUp from "./pages/SignUp";

import "./styles/index.scss";
import WithAuthentication from "./components/WithAuthentication";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <WithAuthentication>
        <Home />
      </WithAuthentication>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/callback/kakaotalk",
    element: <KakaoLogin />,
    loader: kakaoLoader,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
