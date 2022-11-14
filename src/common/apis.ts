import axios, { AxiosResponse } from "axios";
import { doc, getDoc, setDoc, UpdateData, updateDoc } from "firebase/firestore";
import { db } from "../config";

import { Auth, Question, User } from "../@types";
import { getLocalTime } from "./utils";

export const authKakao = (code: string): Promise<AxiosResponse<Auth>> => {
  return axios.post("/api/auth/kakao", { code });
};

export const createUser = (user: User) => {
  return setDoc(doc(db, "users", user.id), user);
};

export const getUser = (id: string) => {
  return getDoc(doc(db, "users", id));
};

export const updateUser = (id: string, data: UpdateData<User>) => {
  return updateDoc(doc(db, "users", id), data);
};

export const getTodayQuestion = (): Promise<AxiosResponse<Question>> => {
  const today = getLocalTime().format("YYYYMMDD");
  return axios.get("/api/question/" + today);
};
