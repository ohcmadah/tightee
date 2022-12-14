import moment from "moment";
import { FormError, MBTI } from "../@types";
import * as constants from "../common/constants";

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

export const getProperty = <T extends Record<string, any>>(
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

export const groupBy = <K, V>(arr: Array<V>, keyGetter: (item: V) => K) => {
  const map = new Map<K, Array<V>>();
  arr.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
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

export const calcAgeGroup = (date: number) => {
  const { year } = convertUTCToBirthdate(date);
  const currentYear = getLocalTime().year();
  const age = currentYear - parseInt(year) + 1;
  return age.toString().slice(0, 1) + "0";
};

export const getMBTIName = (mbti: MBTI) => {
  if (!mbti) return "";
  const nameByMBTIMap = {
    ISTJ: "?????????",
    ISFJ: "?????????",
    INFJ: "????????????",
    INTJ: "????????????",
    ISTP: "???????????????",
    ISFP: "???????????????",
    INFP: "???????????????",
    INTP: "???????????????",
    ESTP: "????????????",
    ESFP: "?????????",
    ENFP: "????????????",
    ENTP: "????????????",
    ESTJ: "????????????",
    ESFJ: "???????????????",
    ENFJ: "???????????????",
    ENTJ: "????????????",
  };
  return nameByMBTIMap[mbti];
};

export const convertRegionCodeToReadable = (code: string) => {
  const map: Record<string, string> = {
    [constants.REGION_SEOUL]: "???????????????",
    [constants.REGION_BUSAN]: "???????????????",
    [constants.REGION_DAEGU]: "???????????????",
    [constants.REGION_INCHEON]: "???????????????",
    [constants.REGION_GWANGJU]: "???????????????",
    [constants.REGION_DAEJEON]: "???????????????",
    [constants.REGION_ULSAN]: "???????????????",
    [constants.REGION_SEJONG]: "?????????????????????",
    [constants.REGION_GYEONGGIDO]: "?????????",
    [constants.REGION_GANGWONDO]: "?????????",
    [constants.REGION_CHUNGCHEONGBUKDO]: "????????????",
    [constants.REGION_CHUNGCHEONGNAMDO]: "????????????",
    [constants.REGION_JEOLLABUKDO]: "????????????",
    [constants.REGION_JEOLLANAMDO]: "????????????",
    [constants.REGION_GYEONGSANGNAMDO]: "????????????",
    [constants.REGION_GYEONGSANGBUKDO]: "????????????",
    [constants.REGION_JEJUDO]: "?????????",
  };
  return map[code] || "";
};

export const convertGenderCodeToReadable = (code: string) => {
  return code === constants.GENDER_MALE ? "??????" : "??????";
};

export const getCookieValue = (key: string) => {
  const cookies = document.cookie.split("; ");
  const value = cookies
    .find((cookie) => cookie.startsWith(key + "="))
    ?.split(key + "=")
    .pop();
  return value;
};
