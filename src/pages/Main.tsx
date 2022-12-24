import { Outlet } from "react-router-dom";
import { getMyAnswers, getTodayQuestion, getUser } from "../common/apis";
import withAuth from "../hocs/withAuth";
import { useAuthenticatedState } from "../contexts/AuthContext";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { TodayQuestionContextProvider } from "../contexts/TodayQuestionContext";
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
  const todayQuestion = useAsyncAPI(getTodayQuestion);

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
    return <ErrorView.Default />;
  }

  if (!user.data) {
    return (
      <ErrorView.Default>
        <div>유저 정보를 불러올 수 없습니다.</div>
      </ErrorView.Default>
    );
  }

  return (
    <Layout className="flex flex-col">
      <TodayQuestionContextProvider
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
      </TodayQuestionContextProvider>
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
