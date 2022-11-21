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
import { getLocalTime, getUTCTime } from "./utils";

import { Answer, Auth, Question, User } from "../@types";

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
  return axios.get("/api/questions", { params: { date: today } });
};

const getCurrentUserDoc = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return doc(db, "users", userId);
};

const getTodayQuestionDoc = async () => {
  const today = getLocalTime().format("YYYYMMDD");
  const questions = await getDocs(
    query(collection(db, "questions"), where("createdAt", "==", today))
  );
  if (questions.empty) {
    throw new Error("Today's question does not exist.");
  }
  return questions.docs[0];
};

export const getTodayAnswer = async () => {
  const user = getCurrentUserDoc();
  const question = (await getTodayQuestionDoc()).ref;

  const answers = await getDocs(
    query(
      collection(db, "answers"),
      where("user", "==", user),
      where("question", "==", question)
    )
  );

  return answers.docs[0];
};

export const answer = (questionId: string, optionId: string) => {
  if (!questionId || !optionId) {
    throw new Error("Please check the parameters.");
  }
  const option = doc(db, "options", optionId);
  const question = doc(db, "questions", questionId);
  const user = getCurrentUserDoc();

  const answer = {
    option,
    question,
    user,
    createdAt: getUTCTime(),
  };
  return addDoc(collection(db, "answers"), answer);
};

export const getAnswers = async (): Promise<AxiosResponse<Answer[]>> => {
  const user = getCurrentUserDoc();
  return axios.get("/api/answers", { params: { user: user.id } });
};
