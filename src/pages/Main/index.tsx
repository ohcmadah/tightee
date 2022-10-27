import { Link, Outlet } from "react-router-dom";
import Layout from "../../components/Layout";

const Home = () => {
  return (
    <Layout className="flex flex-col py-16">
      <Outlet />
      <Link to="/question">asfsd</Link>
    </Layout>
  );
};

export default Home;
