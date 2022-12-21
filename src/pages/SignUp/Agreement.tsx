import cn from "classnames";
import { useNavigate } from "react-router-dom";
import {
  useSignUpDispatch,
  useSignUpState,
} from "../../contexts/SignUpContext";
import { URL_PERSONAL_AGREEMENT, URL_TERMS } from "../../common/constants";
import { getFormErrorMessage, setAll } from "../../common/utils";
import { agreementValidator } from "../../common/validators";

import Header from "../../components/Header";
import Input from "../../components/Input";
import Button from "../../components/Button";

import styles from "../../styles/pages/SignUp.module.scss";

const Divider = () => <div className="h-px bg-grayscale-20" />;

const LabelWithLink = ({
  link,
  children,
}: {
  link: string;
  children: React.ReactNode;
}) => (
  <div className="flex w-full justify-between">
    <span>{children}</span>
    <a target="_blank" href={link} className="text-grayscale-20 underline">
      보기
    </a>
  </div>
);

const Agreement = () => {
  const { agreement, errors } = useSignUpState();
  const dispatch = useSignUpDispatch();
  const navigate = useNavigate();

  const { age, personal, terms, marketing } = agreement;

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE",
      payload: {
        key: `agreement.${evt.target.name}`,
        value: evt.target.checked,
      },
    });
  };

  const onClickNext = () => {
    const errors = agreementValidator(agreement);
    dispatch({ type: "NEXT", payload: { errors } });
  };

  const onClickPrev = () => {
    navigate("/");
  };

  const isAllChecked = age && personal && terms && marketing;

  const onCheckAll = () => {
    const newValues = setAll(agreement, !isAllChecked);
    dispatch({
      type: "UPDATE",
      payload: { key: "agreement", value: newValues },
    });
  };

  return (
    <>
      <Header>
        <Header.H2>
          MBTI기반 성향 분석 서비스,
          <br />
          타이티에 오신 것을 환영합니다!
        </Header.H2>
      </Header>

      <main>
        <h2 className="text-xl font-bold">약관동의</h2>
        <section
          className={cn(
            styles.agreementList,
            "mt-4 flex flex-col rounded-md border border-grayscale-20/50 bg-white py-7 px-5"
          )}
        >
          <Input.Checkbox
            className="font-medium"
            checked={isAllChecked}
            onChange={onCheckAll}
          >
            전체 동의
          </Input.Checkbox>

          <Divider />

          <Input.Checkbox name="age" checked={age} onChange={onChange}>
            만 14세 이상입니다.(필수)
          </Input.Checkbox>
          <Input.Checkbox
            name="personal"
            checked={personal}
            onChange={onChange}
          >
            <LabelWithLink link={URL_PERSONAL_AGREEMENT}>
              개인정보처리 동의(필수)
            </LabelWithLink>
          </Input.Checkbox>
          <Input.Checkbox name="terms" checked={terms} onChange={onChange}>
            <LabelWithLink link={URL_TERMS}>이용 약관 동의(필수)</LabelWithLink>
          </Input.Checkbox>
          <Input.Checkbox
            name="marketing"
            checked={marketing}
            onChange={onChange}
          >
            맞춤형 혜택 제공
          </Input.Checkbox>
        </section>
      </main>

      <footer className={cn(styles.footer, "mt-10 flex flex-col")}>
        <div className="h-6 text-center text-base text-system-alert">
          {getFormErrorMessage(errors, "agreement")}
        </div>
        <Button.Colored color="yellow" onClick={onClickNext}>
          다음
        </Button.Colored>
        <Button.Outline onClick={onClickPrev}>이전으로</Button.Outline>
      </footer>
    </>
  );
};

export default Agreement;
