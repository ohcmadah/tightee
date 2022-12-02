import moment from "moment";
import { FormError, MBTI } from "../@types";

export const setProperty = <T extends Record<string, any>>(
  obj: T,
  path: string,
  value: any
): T => {
  const [head, ...rest] = path.split(".");
  return {
    ...obj,
    [head]: rest.length ? setProperty(obj[head], rest.join("."), value) : value,
  };
};

export const setAll = (obj: object, value: any): {} => {
  return Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: value }), {});
};

const getProperty = <T extends Record<string, any>>(
  obj: T,
  path: string
): any => {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
};

export const groupBy = <T extends Record<string, any>>(
  arr: T[],
  path: string
) => {
  return arr.reduce((acc: Record<string, T[]>, x) => {
    const val = getProperty(x, path);
    const key = typeof val === "string" ? val : JSON.stringify(val);
    (acc[key] = acc[key] || []).push(x);
    return acc;
  }, {});
};

export const isValidForm = (error: FormError) => {
  return Object.keys(error).length === 0;
};

const isFormError = (error: string | FormError): error is FormError => {
  return typeof error !== "string";
};

export const getFormErrorMessage = (
  error: FormError | string,
  path: string
): string => {
  const [head, ...rest] = path.split(".");
  if (isFormError(error)) {
    return head in error
      ? getFormErrorMessage(error[head], rest.join("."))
      : "";
  }
  return error;
};

export function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

export const formatPercent = (number: number) => {
  return parseFloat((number * 100).toFixed(2)) + "%";
};

export const getLocalTime = () => {
  const timezoneOffset = new Date().getTimezoneOffset();
  return moment.utc().utcOffset(-timezoneOffset);
};

export const getUTCTime = () => {
  return moment.utc().valueOf();
};

export const getFormattedDate = (date?: moment.MomentInput) => {
  return moment(date).format("YY.MM.DD(ddd)");
};

export const convertBirthdateToUTC = (birthdate: {
  year?: string;
  month?: string;
  day?: string;
}) => {
  const { year, month, day } = birthdate;
  if (year && month && day) {
    return Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
};

export const convertUTCToBirthdate = (utctime: number) => {
  const timezoneOffset = new Date().getTimezoneOffset();
  const birthdate = moment.utc(utctime).utcOffset(-timezoneOffset);

  return {
    year: birthdate.get("year").toString(),
    month: (birthdate.get("month") + 1).toString(),
    day: birthdate.get("date").toString(),
  };
};

export const getMBTIName = (mbti: MBTI) => {
  if (!mbti) return "";
  const nameByMBTIMap = {
    ISTJ: "소금형",
    ISFJ: "권력형",
    INFJ: "예언자형",
    INTJ: "과학자형",
    ISTP: "백과사전형",
    ISFP: "성인군자형",
    INFP: "잔다르크형",
    INTP: "아이디어형",
    ESTP: "활동가형",
    ESFP: "사교형",
    ENFP: "스파크형",
    ENTP: "발명가형",
    ESTJ: "사업가형",
    ESFJ: "친선도모형",
    ENFJ: "언변능숙형",
    ENTJ: "지도자형",
  };
  return nameByMBTIMap[mbti];
};
