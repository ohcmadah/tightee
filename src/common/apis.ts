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
  writeBatch,
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

export const deleteUser = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    await user.delete();
  } catch (error: any) {
    if (error.code == "auth/requires-recent-login") {
      await auth.signOut();
      setTimeout(() => {
        alert("Please sign in again to delete your account.");
      }, 1);
    }
    return;
  }

  const batch = writeBatch(db);
  const answers = await getDocs(
    query(collection(db, "answers"), where("user.id", "==", user.uid))
  );
  answers.forEach((answer) => batch.update(answer.ref, { "user.id": null }));
  batch.delete(doc(db, "users", user.uid));
  await batch.commit();
};

export const getNicknames = async (): Promise<string[]> => {
  const users = await axios.get("/api/users", {
    params: { fields: ["nickname"] },
  });
  return users.data.map(
    (user: { id: string; nickname: string }) => user.nickname
  );
};

const getCurrentUserDoc = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return doc(db, "users", userId);
};

export const getTodayQuestion = (): Promise<AxiosResponse<Question>> => {
  const today = getLocalTime().format("YYYYMMDD");
  return axios.get("/api/questions", { params: { date: today } });
};

export const getTodayQuestionDoc = async () => {
  const today = getLocalTime().format("YYYYMMDD");
  const questions = await getDocs(
    query(collection(db, "questions"), where("createdAt", "==", today))
  );
  if (questions.empty) {
    throw new Error("Today's question does not exist.");
  }
  return questions.docs[0];
};

export const getQuestion = (questionId: string) => {
  return getDoc(doc(db, "questions", questionId));
};

export const getTodayAnswer = async () => {
  const user = getCurrentUserDoc();
  const question = (await getTodayQuestionDoc()).ref;

  const answers = await getDocs(
    query(
      collection(db, "answers"),
      where("user.id", "==", user.id),
      where("question", "==", question)
    )
  );
  if (answers.empty) {
    throw new Error("Today's answer does not exist.");
  }
  return answers.docs[0];
};

export const answer = async (questionId: string, optionId: string) => {
  if (!questionId || !optionId) {
    throw new Error("Please check the parameters.");
  }
  const option = doc(db, "options", optionId);
  const question = doc(db, "questions", questionId);
  const user = await getDoc(getCurrentUserDoc());

  const answer = {
    option,
    question,
    user: {
      id: user.id,
      ...user.data(),
    },
    createdAt: getUTCTime(),
  };
  return await addDoc(collection(db, "answers"), answer);
};

export const getAnswers = async (params?: {
  user?: string;
  question?: string;
}): Promise<AxiosResponse<Answer[]>> => {
  return axios.get("/api/answers", { params });
};

export const getAnswer = (answerId: string) => {
  return getDoc(doc(db, "answers", answerId));
};

export const getAnswerCount = async () => {
  const user = getCurrentUserDoc();
  const answers = await getDocs(
    query(collection(db, "answers"), where("user", "==", user))
  );
  return answers.size;
};

export const getOption = (optionId: string) => {
  return getDoc(doc(db, "options", optionId));
};
