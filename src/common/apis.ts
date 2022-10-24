import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config";

import { AuthResponse, User } from "../@types";

export const authKakao = (code: string): Promise<AuthResponse> => {
  return axios.post("/api/auth/kakao", { code });
};

export const createUser = (user: User) => {
  return setDoc(doc(db, "users", user.id), user);
};
