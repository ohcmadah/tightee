import axios from "axios";
import moment from "moment";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  UpdateData,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";

import { AuthResponse, User } from "../@types";
import { getLocalTime } from "./utils";

export const authKakao = (code: string): Promise<AuthResponse> => {
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

export const getTodayQuestions = () => {
  const today = getLocalTime().format("YYYY-MM-DD");
  return getDocs(
    query(collection(db, "questions"), where("createdAt", "==", today))
  );
};

export const getOption = (id: string) => {
  return getDoc(doc(db, "options", id));
};
