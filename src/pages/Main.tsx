import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import Nav from "../components/Nav";

const Footer = () => (
  <footer>
    <div className="h-nav" />
    <Nav />
  </footer>
);

const Home = () => {
  return (
    <>
      <Layout className="flex flex-col py-16">
        <Outlet />
      </Layout>
      <Footer />
    </>
  );
};

export default Home;
