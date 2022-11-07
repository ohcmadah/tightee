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
import lightImage from "../../assets/light.png";
import RegionSelector from "../../components/RegionSelector";
import MBTISelector from "../../components/MBTISelector";

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
        <Form.Section required label="닉네임" error={errors?.profile?.nickname}>
          <Input.Basic
            type="text"
            name="nickname"
            value={profile.nickname}
            onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
              updateValue(evt.target.name, evt.target.value);
            }}
            placeholder="닉네임을 입력해 주세요."
          />
        </Form.Section>
        <Form.Section required label="지역" error={errors?.profile?.region}>
          <RegionSelector value={profile.region} onChange={onSelect} />
        </Form.Section>
        <Form.Section
          required
          label="생년월일"
          error={errors?.profile?.birthdate}
        >
          <Form.BirthdateInput
            values={profile.birthdate}
            onChange={(name, value) => updateValue(`birthdate.${name}`, value)}
          />
        </Form.Section>
        <Form.Section required label="성별" error={errors?.profile?.gender}>
          <Button.GenderToggle
            value={profile.gender}
            onChange={(gender) => updateValue("gender", gender)}
          />
        </Form.Section>
        <Form.Section label="MBTI">
          <MBTISelector value={profile.MBTI} onChange={onSelect} />
          <div className="mt-2.5 flex items-center rounded-xl bg-system-dimyellow py-3 px-3.5 text-sm text-grayscale-80">
            <img src={lightImage} alt="tip" className="mr-3 w-6" />
            지금 몰라도 나중에 입력할 수 있어요!
          </div>
        </Form.Section>
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
