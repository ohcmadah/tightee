import React from "react";
import cn from "classnames";
import {
  useSignUpDispatch,
  useSignUpState,
} from "../../contexts/SignUpContext";
import * as constants from "../../common/constants";

import Header from "../../components/Header";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";

import styles from "../../styles/pages/SignUp.module.scss";
import maleImage from "../../assets/male.png";
import femaleImage from "../../assets/female.png";
import lightImage from "../../assets/light.png";
import RegionSelector from "../../components/RegionSelector";
import MBTISelector from "../../components/MBTISelector";

const GenderButton = ({
  gender,
  children,
}: {
  gender: string;
  children: React.ReactNode;
}) => {
  const { profile } = useSignUpState();
  const dispatch = useSignUpDispatch();

  return (
    <Button.Outline
      className={cn(
        "flex w-1/2 items-center justify-center text-grayscale-100",
        {
          "bg-system-dimyellow": profile.gender === gender,
        }
      )}
      onClick={() => {
        dispatch({
          type: "UPDATE",
          key: "profile.gender",
          value: gender,
        });
      }}
    >
      <img
        src={gender === constants.GENDER_MALE ? maleImage : femaleImage}
        alt={gender === constants.GENDER_MALE ? "male" : "female"}
        className="mr-4 w-6"
      />
      {children}
    </Button.Outline>
  );
};

type SectionProps = {
  required?: boolean;
  label: string;
  error?: string;
  children: React.ReactNode;
};

const Section = ({ required, label, error, children }: SectionProps) => (
  <section className={"mb-4 flex flex-col last:mb-0"}>
    <Form.Label required={required} className="mb-2">
      {label}
    </Form.Label>
    {children}
    <Form.Error className="mt-1.5">{error}</Form.Error>
  </section>
);

const Profile = () => {
  const { profile, errors } = useSignUpState();
  const dispatch = useSignUpDispatch();

  const updateValue = (key: string, value: any) => {
    dispatch({
      type: "UPDATE",
      key: `profile.${key}`,
      value,
    });
  };

  const onSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    updateValue(evt.target.name, evt.target.value);
  };

  const onClickSubmit = () => {
    dispatch({ type: "SUBMIT" });
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
        <Section required label="닉네임" error={errors?.profile?.nickname}>
          <Input.Basic
            type="text"
            name="nickname"
            value={profile.nickname}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              updateValue(evt.target.name, evt.target.value);
            }}
            placeholder="닉네임을 입력해 주세요."
          />
        </Section>
        <Section required label="지역" error={errors?.profile?.region}>
          <RegionSelector value={profile.region} onChange={onSelect} />
        </Section>
        <Section required label="생년월일" error={errors?.profile?.birthdate}>
          <Form.BirthdateInput
            values={profile.birthdate}
            onChange={(name, value) => updateValue(`birthdate.${name}`, value)}
          />
        </Section>
        <Section required label="성별" error={errors?.profile?.gender}>
          <div className="flex gap-x-3">
            <GenderButton gender={constants.GENDER_MALE}>남자</GenderButton>
            <GenderButton gender={constants.GENDER_FEMALE}>여자</GenderButton>
          </div>
        </Section>
        <Section label="MBTI">
          <MBTISelector value={profile.MBTI} onChange={onSelect} />
          <div className="mt-2.5 flex items-center rounded-xl bg-system-dimyellow py-3 px-3.5 text-sm text-grayscale-80">
            <img src={lightImage} alt="tip" className="mr-3 w-6" />
            지금 몰라도 나중에 입력할 수 있어요!
          </div>
        </Section>
      </main>

      <footer className={cn(styles.footer, "mt-8 flex flex-col")}>
        <Button.Colored color="yellow" onClick={onClickSubmit}>
          시작하기
        </Button.Colored>
        <Button.Outline onClick={onClickPrev}>이전으로</Button.Outline>
      </footer>
    </>
  );
};

export default Profile;
