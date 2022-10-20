import {
  useSignUpDispatch,
  useSignUpState,
  Error as ErrorType,
} from "../../contexts/SignUpContext";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ColoredButton, OutlineButton } from "../../components/Button";

import styles from "../../styles/pages/SignUp.module.scss";
import { Error, Label } from "../../components/Form";
import { BasicInput } from "../../components/Input";

type SectionProps = {
  required?: boolean;
  label: string;
  error: ErrorType;
  children: React.ReactNode;
};
const Section = ({ required, label, error, children }: SectionProps) => (
  <section className="flex flex-col">
    <Label required={required} className="mb-2">
      {label}
    </Label>
    {children}
    <Error className="mt-1.5">{error}</Error>
  </section>
);

export const Profile = () => {
  const { profile, error } = useSignUpState();
  const dispatch = useSignUpDispatch();

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE",
      key: `profile.${evt.target.name}`,
      value: evt.target.value,
    });
  };

  const onClickNext = () => {
    dispatch({ type: "NEXT" });
  };

  const onClickPrev = () => {
    dispatch({ type: "PREV" });
  };

  return (
    <>
      <Header>
        맞춤 분석을 위해
        <br />
        간단한 정보를 알려주세요.
      </Header>

      <main>
        <Section required label="닉네임" error={error}>
          <BasicInput
            type="text"
            name="nickname"
            value={profile.nickname}
            onChange={onChange}
            placeholder="닉네임을 입력해 주세요."
          />
        </Section>
      </main>

      <Footer className={[styles.footer, "flex flex-col"]}>
        <ColoredButton color="yellow" onClick={onClickNext}>
          다음
        </ColoredButton>
        <OutlineButton onClick={onClickPrev}>이전으로</OutlineButton>
      </Footer>
    </>
  );
};
