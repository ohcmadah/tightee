import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuthState } from "../contexts/AuthContext";

const Home = () => {
  const auth = useAuthState();
  console.log(auth);

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header>타이티입니다!</Header>
    </div>
  );
};

export default Home;
