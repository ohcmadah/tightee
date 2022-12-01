import { Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

const Report = () => {
  const { answerId } = useParams();
  const navigate = useNavigate();

  if (!answerId) {
    return <Navigate to="/answer" />;
  }

  return (
    <>
      <Header>
        <Header.Back onClick={() => navigate(-1)}>리포트</Header.Back>
      </Header>
    </>
  );
};

export default Report;
