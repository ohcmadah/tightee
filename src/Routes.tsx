import {
  Navigate,
  Route,
  Routes as RouteList,
  useParams,
} from "react-router-dom";

import Main from "./pages/Main";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import KakaoLogin from "./pages/KakaoLogin";
import SignUp from "./pages/SignUp";
import QuestionList from "./pages/QuestionList";
import Question from "./pages/Question";
import Profile from "./pages/Profile";
import Answers from "./pages/Answers";
import DeleteAccount from "./pages/DeleteAccount";
import Report from "./pages/Report";
import Ad from "./pages/Ad";

const RedirectQuestion = () => {
  const { questionId } = useParams();
  return <Navigate to={"/questions/" + questionId} replace />;
};

const Routes = () => (
  <RouteList>
    <Route path="/" element={<Main />}>
      <Route index element={<Home />} />
      <Route path="questions" element={<QuestionList />} />
      <Route path="questions/:questionId" element={<Question />} />
      <Route path="question" element={<Navigate to="/questions" replace />} />
      <Route path="question/:questionId" element={<RedirectQuestion />} />
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
  </RouteList>
);

export default Routes;
