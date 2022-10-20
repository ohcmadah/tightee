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
import { URL_PERSONAL_AGREEMENT, URL_TERMS } from "../../common/constants";
import { ColoredButton, OutlineButton } from "../../components/Button";
import { useNavigate } from "react-router-dom";

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

export const Agreement = () => {
  const { agreement, error } = useSignUpState();
  const dispatch = useSignUpDispatch();
  const navigate = useNavigate();

  const { age, personal, terms, marketing } = agreement;

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE",
      key: `agreement.${evt.target.name}`,
      value: evt.target.checked,
    });
  };

  const onClickNext = () => {
    dispatch({ type: "NEXT" });
  };

  const onClickPrev = () => {
    navigate("/");
  };

  const isAllChecked = age && personal && terms && marketing;
  const checkAll = (obj: AgreementState, value: boolean): AgreementState => {
    return Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: value }), {
      ...agreement,
    });
  };
  const onCheckAll = () => {
    const newValues = checkAll(agreement, !isAllChecked);
    dispatch({
      type: "UPDATE",
      key: "agreement",
      value: newValues,
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
        <h2 className="text-2xl font-bold">약관동의</h2>
        <section
          className={cn(
            styles.agreementList,
            "mt-4 flex flex-col rounded-md border border-grayscale-20/50 py-7 px-5"
          )}
        >
          <Checkbox
            className="font-medium"
            checked={isAllChecked}
            onChange={onCheckAll}
          >
            전체 동의
          </Checkbox>

          <Divider />

          <Checkbox name="age" checked={age} onChange={onChange}>
            만 14세 이상입니다.(필수)
          </Checkbox>
          <Checkbox name="personal" checked={personal} onChange={onChange}>
            <LabelWithLink link={URL_PERSONAL_AGREEMENT}>
              개인정보처리 동의(필수)
            </LabelWithLink>
          </Checkbox>
          <Checkbox name="terms" checked={terms} onChange={onChange}>
            <LabelWithLink link={URL_TERMS}>이용 약관 동의(필수)</LabelWithLink>
          </Checkbox>
          <Checkbox name="marketing" checked={marketing} onChange={onChange}>
            맞춤형 혜택 제공
          </Checkbox>
        </section>
      </main>

      <Footer className={[styles.footer, "flex flex-col"]}>
        <div className="h-6 text-center text-base text-system-alert">
          {error}
        </div>
        <ColoredButton color="yellow" onClick={onClickNext}>
          다음
        </ColoredButton>
        <OutlineButton onClick={onClickPrev}>이전으로</OutlineButton>
      </Footer>
    </>
  );
};