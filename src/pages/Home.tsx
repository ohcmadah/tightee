import Header from "../components/Header";

import home from "../assets/home.png";

const Home = () => (
  <Header>
    <img width={40} className="mr-4 inline-block" src={home} alt="home" />
    <span className="align-middle">타이티입니다 :)</span>
  </Header>
);

export default Home;
