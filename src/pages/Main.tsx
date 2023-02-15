import { Outlet } from "react-router-dom";
import { getMyAnswers, getTodayQuestions, getUser } from "../common/apis";
import withAuth from "../hocs/withAuth";
import { useAuthenticatedState } from "../contexts/AuthContext";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { TodayQuestionsContextProvider } from "../contexts/TodayQuestionContext";
import { UserContextProvider } from "../contexts/UserContext";
import { MyAnswersContextProvider } from "../contexts/MyAnswersContext";

import Layout from "../components/Layout";
import Nav from "../components/Nav";

const Home = () => {
  const auth = useAuthenticatedState();
  const user = useAsyncAPI(getUser, auth.user.uid);
  const myAnswers = useAsyncAPI(getMyAnswers, auth.user.uid);
  const todayQuestion = useAsyncAPI(getTodayQuestions);

  return (
    <Layout className="flex flex-col">
      <TodayQuestionsContextProvider response={todayQuestion}>
        <UserContextProvider response={user}>
          <MyAnswersContextProvider response={myAnswers}>
            <Outlet />
          </MyAnswersContextProvider>
        </UserContextProvider>
      </TodayQuestionsContextProvider>
    </Layout>
  );
};

const Main = () => (
  <>
    <Home />
    <Nav />
  </>
);

export default withAuth(Main);
