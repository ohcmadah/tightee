import axios from "axios";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config";

import { AuthResponse, User } from "../@types";

export const authKakao = (code: string): Promise<AuthResponse> => {
  return axios.post("/api/auth/kakao", { code });
};

export const createUser = (user: User) => {
  return setDoc(doc(db, "users", user.id), user);
};

export const getUser = (id: string) => {
  return getDoc(doc(db, "users", id));
};

export const updateUser = (id: string, data: { [key: string]: any }) => {
  return updateDoc(doc(db, "users", id), data);
};
