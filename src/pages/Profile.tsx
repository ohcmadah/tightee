import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateData } from "firebase/firestore";
import useForm from "../hooks/useForm";
import { useAuthenticatedState } from "../contexts/AuthContext";
import { profileValidator } from "../common/validators";
import { getNicknames, getUser, updateUser } from "../common/apis";
import { User as AuthUser } from "firebase/auth";
import { User } from "../@types";
import Loading from "../components/Loading";
import {
  URL_CONTACT,
  URL_CS,
  URL_MBTI_TEST,
  URL_PERSONAL_AGREEMENT,
  URL_TERMS,
} from "../common/constants";
import { auth, auth as firebaseAuth } from "../config";
import {
  convertBirthdateToUTC,
  convertUTCToBirthdate,
  getFormErrorMessage,
} from "../common/utils";
import { ProfileValues } from "../contexts/SignUpContext";
import useAsyncAPI from "../hooks/useAsyncAPI";

import Button from "../components/Button";
import Form from "../components/Form";
import Header from "../components/Header";
import Input from "../components/Input";
import RegionSelector from "../components/RegionSelector";
import MBTISelector from "../components/MBTISelector";
import ModalPortal from "../components/ModalPortal";
import ExternalLink from "../components/ExternalLink";
import ErrorView from "../components/ErrorView";
import Icon from "../components/Icon";

import eyesIcon from "../assets/eyes.png";
import answerIcon from "../assets/answer.png";

const Settings = ({
  subscribe,
  onUpdateUser,
  onLogout,
}: {
  subscribe: boolean;
  onUpdateUser: (data: UpdateData<User>) => any;
  onLogout: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const navigate = useNavigate();

  const toggleSubscribe = () => {
    onUpdateUser({ subscribe: { marketing: !subscribe } });
  };

  return (
    <>
      <section className="my-28">
        <Form.Label className="mb-2">맞춤형 혜택</Form.Label>
        <div className="flex items-center justify-between text-base">
          이벤트 등 다양한 혜택을 제공받을 수 있어요
          <Input.Switch checked={subscribe} onChange={toggleSubscribe} />
        </div>
      </section>

      <section className="mb-6 flex items-center">
        <Button.Outline className="mr-6 min-w-[50%]" onClick={onLogout}>
          로그아웃
        </Button.Outline>
        <span className="text-base">다음에 또 만나요!</span>
      </section>

      <section className="mb-12 flex items-center">
        <Button.Outline
          className="mr-6 min-w-[50%]"
          onClick={() => navigate("/delete-account")}
        >
          회원탈퇴
        </Button.Outline>
        <span className="text-base">
          지금까지 쌓은 소중한 기록들이 모두 사라져요 :(
        </span>
      </section>

      <section className="flex justify-around">
        <ExternalLink className="font-bold" href={URL_CS}>
          고객센터
        </ExternalLink>
        <ExternalLink className="font-bold" href={URL_PERSONAL_AGREEMENT}>
          개인정보 처리방침
        </ExternalLink>
        <ExternalLink className="font-bold" href={URL_TERMS}>
          서비스 이용 약관
        </ExternalLink>
      </section>

      <section className="mx-auto mt-8">
        <ExternalLink
          className="inline-block rounded-full border border-secondary-question py-2 px-6 font-bold text-secondary-question hover:bg-secondary-question hover:text-white"
          href={URL_CONTACT}
        >
          <Icon src={answerIcon} alt="contact" />
          자유롭게 1:1 문의하기
        </ExternalLink>
      </section>
    </>
  );
};

const ProfileForm = ({
  user,
  onUpdateUser,
  existentNicknameSet,
}: {
  user: User;
  onUpdateUser: (data: UpdateData<User>) => any;
  existentNicknameSet: Set<string>;
}) => {
  const initialValues = useMemo(
    () => ({
      nickname: user.nickname,
      region: user.region,
      birthdate: convertUTCToBirthdate(user.birthdate),
      gender: user.gender,
      MBTI: user.MBTI || undefined,
    }),
    [user]
  );

  const { values, errors, handleChange, handleSubmit } = useForm<ProfileValues>(
    {
      initialValues,
      onSubmit: (values) => {
        const newProfile = {
          ...values,
          birthdate: convertBirthdateToUTC(values.birthdate),
          MBTI: values.MBTI || null,
        };
        onUpdateUser(newProfile);
      },
      validator: (values) => profileValidator(values, existentNicknameSet),
    }
  );

  const onSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(evt.target.name, evt.target.value);
  };

  return (
    <>
      <Form.Section
        required
        label="닉네임"
        error={getFormErrorMessage(errors, "nickname")}
      >
        <Input.Basic
          type="text"
          value={values.nickname}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            handleChange("nickname", evt.target.value);
          }}
          placeholder="닉네임을 입력해 주세요."
        />
      </Form.Section>
      <Form.Section
        required
        label="지역"
        error={getFormErrorMessage(errors, "region")}
      >
        <RegionSelector value={values.region} onChange={onSelect} />
      </Form.Section>
      <Form.Section
        required
        label="생년월일"
        error={getFormErrorMessage(errors, "birthdate")}
      >
        <Form.BirthdateInput
          values={values.birthdate}
          onChange={(name, value) => handleChange(`birthdate.${name}`, value)}
        />
      </Form.Section>
      <Form.Section
        required
        label="성별"
        error={getFormErrorMessage(errors, "gender")}
      >
        <Button.GenderToggle
          value={values.gender}
          onChange={(gender) => handleChange("gender", gender)}
        />
      </Form.Section>
      <Form.Section label="MBTI">
        <MBTISelector value={values.MBTI || undefined} onChange={onSelect} />
        <ExternalLink href={URL_MBTI_TEST} className="mt-3">
          {"MBTI 검사 바로가기 >"}
        </ExternalLink>
      </Form.Section>

      <Button.Colored
        className="w-full"
        color="yellow"
        disabled={JSON.stringify(initialValues) === JSON.stringify(values)}
        onClick={handleSubmit}
      >
        수정하기
      </Button.Colored>
    </>
  );
};

const ActualProfile = ({
  init,
  user,
  token,
  existentNicknameSet,
}: {
  init: Function;
  user: User;
  token: string;
  existentNicknameSet: Set<string>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      setIsLoading(true);
      await firebaseAuth.signOut();
      setIsLoading(false);
      navigate("/");
    } catch (error) {}
  };

  const onUpdateUser = async (data: UpdateData<User>) => {
    setIsLoading(true);
    try {
      await updateUser(user.id, token, data);
    } catch (error) {}
    setIsLoading(false);
    init();
  };

  return (
    <>
      <Header>
        <Header.H1>
          <Header.Icon iconSrc={eyesIcon} alt="eyes">
            나의 프로필
          </Header.Icon>
        </Header.H1>
      </Header>
      <ProfileForm
        user={user}
        onUpdateUser={onUpdateUser}
        existentNicknameSet={existentNicknameSet}
      />
      <Settings
        subscribe={user.subscribe.marketing}
        onUpdateUser={onUpdateUser}
        onLogout={onLogout}
      />
      {isLoading && (
        <ModalPortal>
          <Loading.Modal />
        </ModalPortal>
      )}
    </>
  );
};

const getProfileData = async (authUser: AuthUser) => {
  const token = await authUser.getIdToken();
  const user = await getUser(authUser.uid, token);
  if (!user) {
    await auth.signOut();
    throw new Error("다시 로그인해 주세요.");
  }
  const nicknames = (await getNicknames()).filter(
    (nickame) => nickame !== user.nickname
  );

  return { user, token, nicknames };
};

const Profile = () => {
  const auth = useAuthenticatedState();
  const { state, data, forceUpdate } = useAsyncAPI(getProfileData, auth.user);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default />;

    case "loaded":
      return (
        <ActualProfile
          init={forceUpdate}
          user={data.user}
          token={data.token}
          existentNicknameSet={new Set(data.nicknames)}
        />
      );
  }
};

export default Profile;
