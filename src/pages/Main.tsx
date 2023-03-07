import { Outlet } from "react-router-dom";
import withAuth from "../hocs/withAuth";

import Layout from "../components/Layout";
import Nav from "../components/Nav";

const Home = () => (
  <Layout className="flex flex-col">
    <Outlet />
  </Layout>
);

const Main = () => (
  <>
    <Home />
    <Nav />
  </>
);

export default withAuth(Main);
