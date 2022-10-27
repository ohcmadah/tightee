import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import Nav from "../components/Nav";

const Home = () => {
  return (
    <Layout className="flex flex-col py-16">
      <Outlet />
      <Nav />
    </Layout>
  );
};

export default Home;
