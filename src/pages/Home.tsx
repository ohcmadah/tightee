import Header from "../components/Header";

import homeIcon from "../assets/home.png";

const Home = () => (
  <Header>
    <img width={40} className="mr-4 inline-block" src={homeIcon} alt="home" />
    <span className="align-middle">타이티입니다 :)</span>
  </Header>
);

export default Home;
