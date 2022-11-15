import axios, { AxiosResponse } from "axios";
import {
  addDoc,
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
import { auth, db } from "../config";

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

export const getTodayAnswer = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const today = getLocalTime().format("YYYYMMDD");
  const questions = await getDocs(
    query(collection(db, "questions"), where("createdAt", "==", today))
  );
  if (questions.empty) {
    throw new Error("Today's question does not exist.");
  }

  const user = doc(db, "users", userId);
  const question = questions.docs[0].ref;

  const answersQuery = query(
    collection(db, "answers"),
    where("user", "==", user),
    where("question", "==", question)
  );
  return await getDocs(answersQuery);
};

export const answer = (questionId: string, optionId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId || !questionId || !optionId) {
    return;
  }
  const option = doc(db, "options", optionId);
  const question = doc(db, "questions", questionId);
  const user = doc(db, "users", userId);

  const answer = {
    option,
    question,
    user,
  };
  return addDoc(collection(db, "answers"), answer);
};
