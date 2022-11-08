import React, { useEffect, useMemo, useState } from "react";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { UpdateData } from "firebase/firestore";
import useForm from "../hooks/useForm";
import { useAuthState } from "../contexts/AuthContext";
import { profileValidator } from "../common/validators";
import { getUser, updateUser } from "../common/apis";
import { User } from "../@types";
import Loading from "../components/Loading";
import {
  URL_CS,
  URL_MBTI_TEST,
  URL_PERSONAL_AGREEMENT,
  URL_TERMS,
} from "../common/constants";
import { auth as firebaseAuth } from "../config";
import { ProfileState } from "../contexts/SignUpContext";
import { convertBirthdateToUTC, convertUTCToBirthdate } from "../common/utils";

import Button from "../components/Button";
import Form from "../components/Form";
import Header from "../components/Header";
import Input from "../components/Input";
import RegionSelector from "../components/RegionSelector";
import MBTISelector from "../components/MBTISelector";
import ModalPortal from "../components/ModalPortal";

import eyesIcon from "../assets/eyes.png";

const ExternalLink = ({
  className,
  href,
  children,
}: {
  className: string;
  href: string;
  children: React.ReactNode;
}) => (
  <a
    className={cn("text-base text-grayscale-20", className)}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);

const Settings = ({
  subscribe,
  onUpdateUser,
  onLogout,
}: {
  subscribe: boolean;
  onUpdateUser: (data: UpdateData<User>) => any;
  onLogout: React.MouseEventHandler<HTMLButtonElement>;
}) => {
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
        <Button.Outline className="mr-8 min-w-[200px]" onClick={onLogout}>
          로그아웃
        </Button.Outline>
        <span className="text-base">다음에 또 만나요!</span>
      </section>

      <section className="mb-6 flex items-center">
        <Button.Outline className="mr-8 min-w-[200px]">회원탈퇴</Button.Outline>
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
    </>
  );
};

const ProfileForm = ({
  user,
  onUpdateUser,
}: {
  user: User;
  onUpdateUser: (data: UpdateData<User>) => any;
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

  const { values, errors, handleChange, handleSubmit } = useForm<ProfileState>({
    initialValues,
    onSubmit: (values) => {
      const newProfile = {
        ...values,
        birthdate: convertBirthdateToUTC(values.birthdate),
      };
      onUpdateUser(newProfile);
    },
    validator: (values) => {
      const errors = profileValidator(values);
      return errors ? errors : {};
    },
  });

  const onSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(evt.target.name, evt.target.value);
  };

  return (
    <>
      <Form.Section required label="닉네임" error={errors?.nickname}>
        <Input.Basic
          type="text"
          value={values.nickname}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            handleChange("nickname", evt.target.value);
          }}
          placeholder="닉네임을 입력해 주세요."
        />
      </Form.Section>
      <Form.Section required label="지역" error={errors?.region}>
        <RegionSelector value={values.region} onChange={onSelect} />
      </Form.Section>
      <Form.Section required label="생년월일" error={errors?.birthdate}>
        <Form.BirthdateInput
          values={values.birthdate}
          onChange={(name, value) => handleChange(`birthdate.${name}`, value)}
        />
      </Form.Section>
      <Form.Section required label="성별" error={errors?.gender}>
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

const ActualProfile = ({ init, user }: { init: Function; user: User }) => {
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
      await updateUser(user.id, data);
    } catch (error) {}
    setIsLoading(false);
    init();
  };

  return (
    <>
      <Header>
        <img
          src={eyesIcon}
          alt="eyes"
          className="mr-4 inline-block h-[40px] w-[40px]"
        />
        나의 프로필
      </Header>
      <ProfileForm user={user} onUpdateUser={onUpdateUser} />
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

const ProfileWrapper = ({ uid }: { uid: string }) => {
  const [user, setUser] = useState<User>();

  const init = async () => {
    try {
      const doc = await getUser(uid);
      const user = doc.data() as User;
      setUser(user);
    } catch (error) {}
  };

  useEffect(() => {
    init();
  }, []);

  return user ? (
    <ActualProfile init={init} user={user} />
  ) : (
    <ModalPortal>
      <Loading.Modal />
    </ModalPortal>
  );
};

const Profile = () => {
  const auth = useAuthState();
  return auth.user ? <ProfileWrapper uid={auth.user.uid} /> : <Loading.Full />;
};

export default Profile;
