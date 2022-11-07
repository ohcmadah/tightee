import moment from "moment";
import { ProfileState } from "../contexts/SignUpContext";

const birthdateValidator = (birthdate: {
  year?: string;
  month?: string;
  day?: string;
}): string => {
  const { year, month, day } = birthdate;
  if (!year || !month || !day) {
    return "생년월일을 모두 입력해 주세요.";
  }

  const normalizedYear = year.padStart(4, "0");
  const normalizedDay = day.padStart(2, "0");

  const date = moment(`${normalizedYear}-${month}-${normalizedDay}`);
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

  return "";
};

export const profileValidator = (values: any): {} | null => {
  const emptyErrorByKeyMap: { [key: string]: string } = {
    nickname: "닉네임이 입력되지 않았어요.",
    region: "지역이 선택되지 않았어요.",
    birthdate: "생년월일을 모두 입력해 주세요.",
    gender: "성별이 선택되지 않았어요.",
  };
  const emptyErrors = Object.entries(values).reduce((acc, [key, value]) => {
    if (!value) {
      const errorMsg = emptyErrorByKeyMap[key];
      return { ...acc, [key]: errorMsg };
    }
    return acc;
  }, {});

  const birthdateError = birthdateValidator(values.birthdate);
  const errors = {
    ...emptyErrors,
    ...(birthdateError === "" ? {} : { birthdate: birthdateError }),
  };

  if (Object.keys(errors).length !== 0) {
    return errors;
  }

  return null;
};
