import cn from "classnames";
import {
  AgreementState,
  useSignUpDispatch,
  useSignUpState,
} from "../../contexts/SignUpContext";

import { Header } from "../../components/Header";
import { Checkbox } from "../../components/Input/Checkbox";
import { Footer } from "../../components/Footer";

import styles from "../../styles/pages/SignUp.module.scss";

export const Agreement = () => {
  const { agreement, error } = useSignUpState();
  const dispatch = useSignUpDispatch();

  const { age, personal, terms, marketing } = agreement;

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE",
      key: `agreement.${evt.target.name}`,
      value: evt.target.checked,
    });
  };

  const onSubmit = () => {
    dispatch({ type: "NEXT" });
  };

  const isAllChecked = age && personal && terms && marketing;
  const checkAll = (obj: AgreementState, value: boolean): AgreementState => {
    return Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: value }), {
      ...agreement,
    });
  };

  return (
    <>
      <Header>
        우리 사이의 연결고리.
        <br />
        타이티에 오신 것을 환영합니다!
      </Header>
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
              const newValues = checkAll(agreement, !isAllChecked);
              dispatch({
                type: "UPDATE",
                key: "agreement",
                value: newValues,
              });
            }}
          >
            전체 동의
          </Checkbox>
          <div className="my-4 h-px bg-grayscale-20" />
          <Checkbox
            className="mb-2"
            name="age"
            checked={age}
            onChange={onChange}
          >
            만 14세 이상입니다.(필수)
          </Checkbox>
          <Checkbox
            className="mb-2"
            name="personal"
            checked={personal}
            onChange={onChange}
          >
            개인정보처리 동의(필수)
          </Checkbox>
          <Checkbox
            className="mb-2"
            name="terms"
            checked={terms}
            onChange={onChange}
          >
            이용 약관 동의(필수)
          </Checkbox>
          <Checkbox name="marketing" checked={marketing} onChange={onChange}>
            맞춤형 혜택 제공
          </Checkbox>
        </section>
      </main>
      <Footer>
        <div className="text-danger">{error}</div>
        <button onClick={onSubmit}>다음</button>
      </Footer>
    </>
  );
};
