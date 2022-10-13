import { useLocation } from "react-router-dom";

import Layout from "../components/Layout";

const Header = () => (
  <header className="mb-7">
    <h1 className="text-xl font-bold">
      우리 사이의 연결고리.
      <br />
      타이티에 오신 것을 환영합니다!
    </h1>
  </header>
);

const Agreement = () => (
  <main>
    <h2>약관동의</h2>
    <section>동의 리스트</section>
  </main>
);

const Footer = () => (
  <footer>
    <span></span>
    <button></button>
    <button></button>
  </footer>
);

const SignUp = () => {
  const location = useLocation();
  const { firebaseToken, user } = location.state;

  console.log(firebaseToken, user);

  return (
    <Layout className="py-5">
      <Header />
      <Agreement />
      <Footer />
    </Layout>
  );
};

export default SignUp;
