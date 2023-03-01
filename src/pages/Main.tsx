import { Outlet } from "react-router-dom";
import { getMyAnswers, getTodayQuestions } from "../common/apis";
import withAuth from "../hocs/withAuth";
import { useAuthenticatedState } from "../contexts/AuthContext";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { TodayQuestionsContextProvider } from "../contexts/TodayQuestionContext";
import { MyAnswersContextProvider } from "../contexts/MyAnswersContext";

import Layout from "../components/Layout";
import Nav from "../components/Nav";

const Home = () => {
  const auth = useAuthenticatedState();
  const myAnswers = useAsyncAPI(getMyAnswers, auth.user.uid);
  const todayQuestion = useAsyncAPI(getTodayQuestions);

  return (
    <Layout className="flex flex-col">
      <TodayQuestionsContextProvider response={todayQuestion}>
        <MyAnswersContextProvider response={myAnswers}>
          <Outlet />
        </MyAnswersContextProvider>
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
