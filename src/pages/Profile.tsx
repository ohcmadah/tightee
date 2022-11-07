import { useEffect, useState } from "react";
import moment from "moment";
import useForm from "../hooks/useForm";
import { useAuthState } from "../contexts/AuthContext";
import { profileValidator } from "../common/validators";
import { getUser } from "../common/apis";
import { User } from "../@types";

import Button from "../components/Button";
import Form from "../components/Form";
import Header from "../components/Header";
import Input from "../components/Input";
import RegionSelector from "../components/RegionSelector";
import MBTISelector from "../components/MBTISelector";

import eyesIcon from "../assets/eyes.png";
import Loading from "../components/Loading";

const ProfileForm = ({ user }: { user: User }) => {
  const birthdate = moment(user.birthdate);

  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      nickname: user.nickname,
      region: user.region,
      birthdate: {
        year: birthdate.year().toString(),
        month: birthdate.month().toString(),
        day: birthdate.day().toString(),
      },
      gender: user.gender,
      MBTI: user.MBTI,
    },
    onSubmit: () => {},
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
      <Header>
        <img
          src={eyesIcon}
          alt="eyes"
          className="mr-4 inline-block h-[40px] w-[40px]"
        />
        나의 프로필
      </Header>

      <main>
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
        </Form.Section>
      </main>

      <footer className="mt-8 flex flex-col">
        <Button.Colored color="yellow" onClick={handleSubmit}>
          수정하기
        </Button.Colored>
      </footer>
    </>
  );
};

const Profile = () => {
  const auth = useAuthState();
  const [user, setUser] = useState<User>();

  const authUser = auth.user;

  if (!authUser) {
    return <Loading.Full />;
  }

  useEffect(() => {
    (async () => {
      const doc = await getUser(authUser.uid);
      const user = doc.data() as User;
      setUser(user);
    })();
  }, []);

  return !user ? <Loading.Full /> : <ProfileForm user={user} />;
};

export default Profile;
