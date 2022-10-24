import React from "react";
import cn from "classnames";
import {
  useSignUpDispatch,
  useSignUpState,
} from "../../contexts/SignUpContext";
import * as constants from "../../common/constants";
import { range } from "../../common/utils";

import Header from "../../components/Header";
import { ColoredButton, OutlineButton } from "../../components/Button";
import Form from "../../components/Form";
import Input from "../../components/Input";

import styles from "../../styles/pages/SignUp.module.scss";
import maleImage from "../../assets/male.png";
import femaleImage from "../../assets/female.png";
import lightImage from "../../assets/light.png";

const REGIONS = [
  { code: constants.REGION_SEOUL, value: "서울특별시" },
  { code: constants.REGION_BUSAN, value: "부산광역시" },
  { code: constants.REGION_DAEGU, value: "대구광역시" },
  { code: constants.REGION_INCHEON, value: "인천광역시" },
  { code: constants.REGION_GWANGJU, value: "광주광역시" },
  { code: constants.REGION_DAEJEON, value: "대전광역시" },
  { code: constants.REGION_ULSAN, value: "울산광역시" },
  { code: constants.REGION_SEJONG, value: "세종특별자치시" },
  { code: constants.REGION_GYEONGGIDO, value: "경기도" },
  { code: constants.REGION_GANGWONDO, value: "강원도" },
  { code: constants.REGION_CHUNGCHEONGBUKDO, value: "충청북도" },
  { code: constants.REGION_CHUNGCHEONGNAMDO, value: "충청남도" },
  { code: constants.REGION_JEOLLABUKDO, value: "전라북도" },
  { code: constants.REGION_JEOLLANAMDO, value: "전라남도" },
  { code: constants.REGION_GYEONGSANGBUKDO, value: "경상북도" },
  { code: constants.REGION_GYEONGSANGNAMDO, value: "경상남도" },
  { code: constants.REGION_JEJUDO, value: "제주특별자치도" },
];

const MBTIS = [
  "ISTJ",
  "ISTP",
  "ISFJ",
  "ISFP",
  "INTJ",
  "INTP",
  "INFJ",
  "INFP",
  "ESTJ",
  "ESTP",
  "ESFJ",
  "ESFP",
  "ENTJ",
  "ENTP",
  "ENFJ",
  "ENFP",
];

const GenderButton = ({
  gender,
  children,
}: {
  gender: number;
  children: React.ReactNode;
}) => {
  const { profile } = useSignUpState();
  const dispatch = useSignUpDispatch();

  return (
    <OutlineButton
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
    </OutlineButton>
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

  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(evt.target.name, evt.target.value);
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
            onChange={onChange}
            placeholder="닉네임을 입력해 주세요."
          />
        </Section>
        <Section required label="지역" error={errors?.profile?.region}>
          <Input.Select
            name="region"
            value={profile.region}
            onChange={onSelect}
            placeholder="지역을 선택해 주세요."
          >
            {REGIONS.map(({ code, value }) => (
              <option key={code} value={code}>
                {value}
              </option>
            ))}
          </Input.Select>
        </Section>
        <Section required label="생년월일" error={errors?.profile?.birthdate}>
          <div className="flex gap-x-3">
            <Input.Basic
              type="text"
              className="w-1/3"
              name="birthdate.year"
              value={profile.birthdate.year}
              onChange={onChange}
              placeholder="연"
              maxLength={4}
            />
            <Input.Select
              className="w-1/3"
              name="birthdate.month"
              value={profile.birthdate.month}
              onChange={onSelect}
              placeholder="월"
            >
              {[...range(1, 12)].map((month) => (
                <option key={month} value={month < 10 ? `0${month}` : month}>
                  {month}
                </option>
              ))}
            </Input.Select>
            <Input.Basic
              type="text"
              className="w-1/3"
              name="birthdate.day"
              value={profile.birthdate.day}
              onChange={onChange}
              placeholder="일"
              maxLength={2}
            />
          </div>
        </Section>
        <Section required label="성별" error={errors?.profile?.gender}>
          <div className="flex gap-x-3">
            <GenderButton gender={constants.GENDER_MALE}>남자</GenderButton>
            <GenderButton gender={constants.GENDER_FEMALE}>여자</GenderButton>
          </div>
        </Section>
        <Section label="MBTI">
          <Input.Select
            name="MBTI"
            value={profile.MBTI}
            onChange={onSelect}
            placeholder="MBTI를 선택해 주세요."
          >
            {MBTIS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Input.Select>
          <div className="mt-2.5 flex items-center rounded-xl bg-system-dimyellow py-3 px-3.5 text-sm text-grayscale-80">
            <img src={lightImage} alt="tip" className="mr-3 w-6" />
            지금 몰라도 나중에 입력할 수 있어요!
          </div>
        </Section>
      </main>

      <footer className={cn(styles.footer, "mt-8 flex flex-col")}>
        <ColoredButton color="yellow" onClick={onClickSubmit}>
          시작하기
        </ColoredButton>
        <OutlineButton onClick={onClickPrev}>이전으로</OutlineButton>
      </footer>
    </>
  );
};

export default Profile;
