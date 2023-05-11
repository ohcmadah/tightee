import React, { useState } from "react";
import cn from "classnames";
import {
  useSignUpDispatch,
  useSignUpState,
} from "../../contexts/SignUpContext";
import { getFormErrorMessage, isValidForm } from "../../common/utils";
import { profileValidator } from "../../common/validators";
import { getNicknames } from "../../api/user";

import Header from "../../components/Header";
import Button from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";
import RegionSelector from "../../components/RegionSelector";
import MBTISelector from "../../components/MBTISelector";
import Loading from "../../components/Loading";
import ModalPortal from "../../components/ModalPortal";
import Img from "../../components/Img";

import styles from "../../styles/pages/SignUp.module.scss";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { profile, errors } = useSignUpState();
  const dispatch = useSignUpDispatch();

  const updateValue = (key: string, value: any) => {
    dispatch({
      type: "UPDATE",
      payload: { key: `profile.${key}`, value },
    });
  };

  const onSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    updateValue(evt.target.name, evt.target.value);
  };

  const onClickSubmit = async () => {
    try {
      setIsLoading(true);
      const nicknames = await getNicknames();
      setIsLoading(false);
      const errors = profileValidator(profile, new Set(nicknames));
      dispatch({
        type: "NEXT",
        payload: { errors: isValidForm(errors) ? {} : { profile: errors } },
      });
    } catch (error) {}
  };

  const onClickPrev = () => {
    dispatch({ type: "PREV" });
  };

  return (
    <>
      <Header>
        <Header.H2>
          맞춤 분석을 위해
          <br />
          간단한 정보를 알려주세요.
        </Header.H2>
      </Header>

      <main>
        <Form.Section
          required
          label="닉네임"
          error={getFormErrorMessage(errors, "profile.nickname")}
        >
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
        <Form.Section
          required
          label="지역"
          error={getFormErrorMessage(errors, "profile.region")}
        >
          <RegionSelector value={profile.region} onChange={onSelect} />
        </Form.Section>
        <Form.Section
          required
          label="생년월일"
          error={getFormErrorMessage(errors, "profile.birthdate")}
        >
          <Form.BirthdateInput
            values={profile.birthdate}
            onChange={(name, value) => updateValue(`birthdate.${name}`, value)}
          />
        </Form.Section>
        <Form.Section
          required
          label="성별"
          error={getFormErrorMessage(errors, "profile.gender")}
        >
          <Button.GenderToggle
            value={profile.gender}
            onChange={(gender) => updateValue("gender", gender)}
          />
        </Form.Section>
        <Form.Section label="MBTI">
          <MBTISelector value={profile.MBTI} onChange={onSelect} />
          <div className="mt-2.5 flex items-center rounded-xl bg-system-dimyellow py-3 px-3.5 text-sm text-grayscale-80">
            <Img lazy src="/images/light.png" alt="tip" className="mr-3 w-6" />
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

      <ModalPortal>{isLoading && <Loading.Modal />}</ModalPortal>
    </>
  );
};

export default Profile;
