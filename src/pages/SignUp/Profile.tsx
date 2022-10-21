import React from "react";
import {
  useSignUpDispatch,
  useSignUpState,
} from "../../contexts/SignUpContext";
import * as constants from "../../common/constants";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ColoredButton, OutlineButton } from "../../components/Button";
import { Error, Label } from "../../components/Form";
import { BasicInput, Select } from "../../components/Input";

import styles from "../../styles/pages/SignUp.module.scss";
import { range } from "../../common/utils";

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

type SectionProps = {
  required?: boolean;
  label: string;
  error?: string;
  children: React.ReactNode;
};

const Section = ({ required, label, error, children }: SectionProps) => (
  <section className={"mb-4 flex flex-col last:mb-0"}>
    <Label required={required} className="mb-2">
      {label}
    </Label>
    {children}
    <Error className="mt-1.5">{error}</Error>
  </section>
);

export const Profile = () => {
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
        <Section required label="닉네임" error={errors?.profile?.nickname}>
          <BasicInput
            type="text"
            name="nickname"
            value={profile.nickname}
            onChange={onChange}
            placeholder="닉네임을 입력해 주세요."
          />
        </Section>
        <Section required label="지역" error={errors?.profile?.region}>
          <Select
            name="region"
            value={profile.region}
            onChange={onSelect}
            placeholder="지역을 선택해 주세요."
          >
            {REGIONS.map(({ code, value }) => (
              <option value={code}>{value}</option>
            ))}
          </Select>
        </Section>
        <Section required label="생년월일" error={errors?.profile?.birthdate}>
          <div className="flex gap-x-3">
            <BasicInput
              type="text"
              className="w-1/3"
              name="birthdate.year"
              value={profile.birthdate.year}
              onChange={onChange}
              placeholder="연"
              maxLength={4}
            />
            <Select
              className="w-1/3"
              name="birthdate.month"
              value={profile.birthdate.month}
              onChange={onSelect}
              placeholder="월"
            >
              {[...range(1, 12)].map((month) => (
                <option value={month}>{month}</option>
              ))}
            </Select>
            <BasicInput
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
