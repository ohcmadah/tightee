import moment from "moment";
import { FormError } from "../@types";

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

export const getLocalTime = () => {
  const timezoneOffset = new Date().getTimezoneOffset();
  return moment.utc().utcOffset(-timezoneOffset);
};

export const getUTCTime = () => {
  return moment.utc().valueOf();
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
