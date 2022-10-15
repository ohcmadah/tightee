import { useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";

import Layout from "../components/Layout";
import { Checkbox } from "../ui/Input/Checkbox";

import styles from "../styles/pages/SignUp.module.scss";

const Header = () => (
  <header className="mb-7">
    <h1 className="text-2xl font-bold">
      우리 사이의 연결고리.
      <br />
      타이티에 오신 것을 환영합니다!
    </h1>
  </header>
);

const Agreement = () => {
  const [checked, setChecked] = useState(false);

  return (
    <main>
      <h2 className="text-xl font-medium">약관동의</h2>
      <section
        className={cn(
          styles.agreementList,
          "mt-4 flex flex-col rounded-md border border-grayscale-20/50 py-7 px-5"
        )}
      >
        <Checkbox
          className="text-base font-medium"
          checked={checked}
          onChange={(evt) => setChecked(evt.target.checked)}
        >
          전체 동의
        </Checkbox>
        <div className="my-4 h-px bg-grayscale-20" />
      </section>
    </main>
  );
};

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
    <Layout className="py-16">
      <Header />
      <Agreement />
      <Footer />
    </Layout>
  );
};

export default SignUp;
