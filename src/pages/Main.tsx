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
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";

const Home = () => {
  const auth = useAuthenticatedState();
  const user = useAsyncAPI(getUser, auth.user.uid);
  const myAnswers = useAsyncAPI(getMyAnswers, auth.user.uid);
  const todayQuestion = useAsyncAPI(getTodayQuestions);

  if (
    user.state === "loading" ||
    myAnswers.state === "loading" ||
    todayQuestion.state === "loading"
  ) {
    return <Loading.Full />;
  }

  if (
    user.state === "error" ||
    myAnswers.state === "error" ||
    todayQuestion.state === "error"
  ) {
    return (
      <Layout>
        <ErrorView.Default />
      </Layout>
    );
  }

  if (!user.data) {
    return (
      <Layout>
        <ErrorView.Default>
          <div>유저 정보를 불러올 수 없습니다.</div>
        </ErrorView.Default>
      </Layout>
    );
  }

  return (
    <Layout className="flex flex-col">
      <TodayQuestionsContextProvider
        value={{
          data:
            todayQuestion.data.status === 204 ? null : todayQuestion.data.data,
          forceUpdate: todayQuestion.forceUpdate,
        }}
      >
        <UserContextProvider
          value={{ data: user.data, forceUpdate: user.forceUpdate }}
        >
          <MyAnswersContextProvider
            value={{ data: myAnswers.data, forceUpdate: myAnswers.forceUpdate }}
          >
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
