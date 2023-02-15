import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateData } from "firebase/firestore";
import useForm from "../hooks/useForm";
import { profileValidator } from "../common/validators";
import { updateUser } from "../common/apis";
import { User } from "../@types";
import Loading from "../components/Loading";
import {
  URL_CONTACT,
  URL_CS,
  URL_MBTI_TEST,
  URL_PERSONAL_AGREEMENT,
  URL_TERMS,
} from "../common/constants";
import { auth as firebaseAuth } from "../config";
import {
  convertBirthdateToUTC,
  convertUTCToBirthdate,
  getFormErrorMessage,
} from "../common/utils";
import { ProfileValues } from "../contexts/SignUpContext";
import { useUser } from "../contexts/UserContext";

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
import Skeleton from "../components/Skeleton";

const Settings = ({
  onLogout,
}: {
  onLogout: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const navigate = useNavigate();

  return (
    <>
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
          className="inline-block rounded-full border border-secondary-question bg-white py-2 px-6 font-bold text-secondary-question hover:bg-secondary-question hover:text-white"
          href={URL_CONTACT}
        >
          <Icon src="/images/answer.png" alt="contact" />
          자유롭게 1:1 문의하기
        </ExternalLink>
      </section>
    </>
  );
};

const Subscribe = ({
  id,
  subscribe,
  onUpdateUser,
}: {
  id: User["id"];
  subscribe: boolean;
  onUpdateUser: (id: string, data: UpdateData<User>) => any;
}) => {
  const toggleSubscribe = () => {
    onUpdateUser(id, { subscribe: { marketing: !subscribe } });
  };

  return (
    <section className="my-28">
      <Form.Label className="mb-2">맞춤형 혜택</Form.Label>
      <div className="flex items-center justify-between text-base">
        이벤트 등 다양한 혜택을 제공받을 수 있어요
        <Input.Switch checked={subscribe} onChange={toggleSubscribe} />
      </div>
    </section>
  );
};

const ProfileForm = ({
  user,
  onUpdateUser,
}: {
  user: User;
  onUpdateUser: (id: string, data: UpdateData<User>) => any;
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
        onUpdateUser(user.id, newProfile);
      },
      validator: (values) => profileValidator(values),
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

const RectLoader = () => (
  <Skeleton.Container viewBox="0 0 340 45">
    <rect x="0" y="0" rx="8" ry="8" width="340" height="45" />
  </Skeleton.Container>
);

const EditProfileLoader = () => {
  const labels = ["닉네임", "지역", "생년월일", "성별", "MBTI"];
  return (
    <main>
      {[0, 1, 2, 3, 4].map((i) => (
        <Form.Section required={i !== 4} label={labels[i]}>
          <RectLoader />
          {i === 4 && (
            <ExternalLink href={URL_MBTI_TEST} className="mt-3">
              {"MBTI 검사 바로가기 >"}
            </ExternalLink>
          )}
        </Form.Section>
      ))}
      <Button.Colored className="w-full" color="yellow" disabled>
        수정하기
      </Button.Colored>
      <section className="my-28">
        <Form.Label className="mb-2">맞춤형 혜택</Form.Label>
        <div className="flex items-center justify-between text-base">
          이벤트 등 다양한 혜택을 제공받을 수 있어요
        </div>
      </section>
    </main>
  );
};

const EditProfile = ({
  setIsLoading,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isLoading, data: user, forceUpdate } = useUser();

  const onUpdateUser = async (id: string, data: UpdateData<User>) => {
    setIsLoading(true);
    try {
      await updateUser(id, data);
    } catch (error) {}
    setIsLoading(false);
    forceUpdate();
  };

  if (isLoading) {
    return <EditProfileLoader />;
  }

  if (user instanceof Error || !user) {
    return (
      <ErrorView.Default>
        <article>유저 정보를 불러올 수 없습니다.</article>
      </ErrorView.Default>
    );
  }

  return (
    <>
      <ProfileForm user={user} onUpdateUser={onUpdateUser} />
      <Subscribe
        id={user.id}
        subscribe={user.subscribe.marketing}
        onUpdateUser={onUpdateUser}
      />
    </>
  );
};

const Profile = () => {
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

  return (
    <>
      <Header>
        <Header.H1>
          <Header.Icon iconSrc="/images/eyes.png" alt="eyes">
            나의 프로필
          </Header.Icon>
        </Header.H1>
      </Header>
      <EditProfile setIsLoading={setIsLoading} />
      <Settings onLogout={onLogout} />
      {isLoading && (
        <ModalPortal>
          <Loading.Modal />
        </ModalPortal>
      )}
    </>
  );
};

export default Profile;
