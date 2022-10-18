import { useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import useForm, { Validator } from "../../hooks/useForm";

import Layout from "../../components/Layout";
import { Checkbox } from "../../ui/Input/Checkbox";

import { User } from "../../@types";
import styles from "../styles/pages/SignUp.module.scss";

const STEP_AGREEMENT = "AGREEMENT";
const STEP_PROFILE = "PROFILE";

const Header = () => (
  <header className="mb-7">
    <h1 className="text-2xl font-bold">
      우리 사이의 연결고리.
      <br />
      타이티에 오신 것을 환영합니다!
    </h1>
  </header>
);

type AgreementValues = {
  age: boolean;
  personal: boolean;
  terms: boolean;
  marketing: boolean;
};

const agreementValidator: Validator<AgreementValues> = (values) => {
  const { age, personal, terms } = values;
  if (!age || !personal || !terms) {
    return { required: "서비스 이용을 위해 필수 약관에 동의해 주세요!" };
  }
  return {};
};

const Agreement = ({ onAgree }: { onAgree: Function }) => {
  const config = {
    initialValues: {
      age: false,
      personal: false,
      terms: false,
      marketing: false,
    },
    onSubmit: onAgree,
    validator: agreementValidator,
  };

  const { values, errors, handleChange, initAll } = useForm(config);
  const { age, personal, terms, marketing } = values;

  const isAllChecked = age && personal && terms && marketing;
  const checkAll = (obj: AgreementValues, value: boolean): AgreementValues => {
    return Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: value }), {
      ...config.initialValues,
    });
  };

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
          checked={isAllChecked}
          onChange={() => {
            const newValues = checkAll(values, !isAllChecked);
            initAll(newValues);
          }}
        >
          전체 동의
        </Checkbox>
        <div className="my-4 h-px bg-grayscale-20" />
        <Checkbox
          className="mb-2"
          checked={age}
          onChange={(evt) => {
            handleChange("age", evt.target.checked);
          }}
        >
          만 14세 이상입니다.(필수)
        </Checkbox>
        <Checkbox
          className="mb-2"
          checked={personal}
          onChange={(evt) => {
            handleChange("personal", evt.target.checked);
          }}
        >
          개인정보처리 동의(필수)
        </Checkbox>
        <Checkbox
          className="mb-2"
          checked={terms}
          onChange={(evt) => {
            handleChange("terms", evt.target.checked);
          }}
        >
          이용 약관 동의(필수)
        </Checkbox>
        <Checkbox
          checked={marketing}
          onChange={(evt) => {
            handleChange("marketing", evt.target.checked);
          }}
        >
          맞춤형 혜택 제공
        </Checkbox>
      </section>
      <div className="text-danger">{Object.values(errors)[0]}</div>
      <button onClick={() => {}}>다음</button>
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
  const [step, setStep] = useState<string>(STEP_AGREEMENT);
  const [newUser, setNewUser] = useState<object | null>(null);

  const onAgree = (values: AgreementValues) => {
    setStep(STEP_PROFILE);
    setNewUser((prevValue) => ({
      ...prevValue,
      subscribe: { marketing: values.marketing },
    }));
  };

  console.log(firebaseToken, user);

  return (
    <Layout className="py-16">
      <Header />
      {step === STEP_AGREEMENT ? <Agreement onAgree={onAgree} /> : <div></div>}
      <Footer />
    </Layout>
  );
};

export default SignUp;
