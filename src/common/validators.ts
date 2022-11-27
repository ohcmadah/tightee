import moment from "moment";
import { FormError } from "../@types";
import { AgreementValues, ProfileValues } from "../contexts/SignUpContext";

const isEmpty = (value: any) => {
  switch (typeof value) {
    case "undefined":
      return true;

    case "string":
      return value === "";

    case "object":
      if (!value) return true;
      return Array.isArray(value)
        ? value.length === 0
        : Object.keys(value).length === 0;

    default:
      return false;
  }
};

const nicknameValidator = (
  existentNicknameSet: Set<string>,
  nickname: string
) => {
  if (isEmpty(nickname)) {
    return "닉네임이 입력되지 않았어요.";
  }

  if (nickname.length > 20) {
    return "20자 이내로 입력해 주세요.";
  }

  if (existentNicknameSet.has(nickname)) {
    return "이미 존재하는 닉네임입니다.";
  }
};

const birthdateValidator = (birthdate: ProfileValues["birthdate"]) => {
  const { year, month, day } = birthdate;

  if (!year || !month || !day) {
    return "생년월일을 모두 입력해 주세요.";
  }

  const normalizedYear = year.padStart(4, "0");
  const normalizedMonth = month.padStart(2, "0");
  const normalizedDay = day.padStart(2, "0");

  const date = moment(`${normalizedYear}-${normalizedMonth}-${normalizedDay}`);
  const today = moment();

  if (!date.isValid() || date.isBefore("1900-01-01")) {
    return "생년월일을 정확하게 입력해 주세요.";
  }

  if (date.isAfter(today)) {
    return "미래에서 오셨군요!";
  }

  if (!date.isSameOrBefore(today.subtract(14, "years"))) {
    return "만 14세 이상만 가입이 가능합니다.";
  }
};

const emptyValidator = (value: any, msg?: string) => {
  if (isEmpty(value)) {
    return msg || true;
  }
  return false;
};

export const profileValidator = (
  values: ProfileValues,
  existentNicknameSet: Set<string>
): FormError => {
  const validators: Record<string, Function> = {
    region: (value: ProfileValues["region"]) =>
      emptyValidator(value, "지역이 선택되지 않았어요."),

    gender: (value: ProfileValues["gender"]) =>
      emptyValidator(value, "성별이 선택되지 않았어요."),

    birthdate: birthdateValidator,

    nickname: (value: ProfileValues["nickname"]) =>
      nicknameValidator(existentNicknameSet, value),

    MBTI: () => false,
  };

  const errors: FormError = Object.entries(values).reduce(
    (acc, [key, value]) => {
      const validator = validators[key];
      const error = validator(value);

      if (error) {
        return { ...acc, [key]: error };
      }
      return acc;
    },
    {}
  );

  return errors;
};

export const agreementValidator = (values: AgreementValues): FormError => {
  const { age, personal, terms } = values;

  if (!age || !personal || !terms) {
    return { agreement: "서비스 이용을 위해 필수 약관에 동의해 주세요!" };
  }

  return {};
};
