import { Outlet } from "react-router-dom";
import { getTodayQuestions } from "../common/apis";
import withAuth from "../hocs/withAuth";
import { useAuthenticatedState } from "../contexts/AuthContext";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { TodayQuestionsContextProvider } from "../contexts/TodayQuestionContext";

import Layout from "../components/Layout";
import Nav from "../components/Nav";

const Home = () => {
  const auth = useAuthenticatedState();
  const todayQuestion = useAsyncAPI(getTodayQuestions);

  return (
    <Layout className="flex flex-col">
      <TodayQuestionsContextProvider response={todayQuestion}>
        <Outlet />
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
