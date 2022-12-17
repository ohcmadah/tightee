import axios, { AxiosResponse } from "axios";
import { UpdateData } from "firebase/firestore";
import { auth } from "../config";
import { getLocalTime } from "./utils";

import { Answer, Auth, Option, Question, User } from "../@types";

const getCurrentUserId = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
};

export const authKakao = (code: string): Promise<AxiosResponse<Auth>> => {
  return axios.post("/api/auth/kakao", { code });
};

export const createUser = (user: User) => {
  return axios.post("/api/users/" + user.id, { ...user });
};

export const getUser = async (
  id: string,
  token: string
): Promise<User | null> => {
  const res = await axios.get("/api/users/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 204) {
    return null;
  }
  return res.data;
};

export const updateUser = (
  id: string,
  token: string,
  data: UpdateData<User>
) => {
  return axios.patch(
    "/api/users/" + id,
    { ...data },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteUser = async (token: string) => {
  return axios.delete("/api/users/" + getCurrentUserId(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getNicknames = async (): Promise<string[]> => {
  const users = await axios.get("/api/users", {
    params: { fields: ["nickname"] },
  });
  return users.data.map(
    (user: { id: string; nickname: string }) => user.nickname
  );
};

export const getTodayQuestion = (): Promise<AxiosResponse<Question>> => {
  const today = getLocalTime().format("YYYYMMDD");
  return axios.get("/api/questions", { params: { date: today } });
};

export const getQuestion = (id: string) => {
  return axios.get("/api/questions/" + id);
};

export const answer = (questionId: string, optionId: string) => {
  return axios.post("/api/answers", {
    question: questionId,
    option: optionId,
    user: getCurrentUserId(),
  });
};

type GetAnswersParams =
  | { user: string; token: string; question?: undefined }
  | { question: string; user?: undefined; token?: undefined };

export const getAnswers = async (
  params?: GetAnswersParams
): Promise<AxiosResponse<Answer[]>> => {
  if (params && params.user) {
    return axios.get("/api/answers", {
      params: {
        user: params.user,
      },
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    });
  }
  return axios.get("/api/answers", { params });
};

export const getAnswer = (answerId: string): Promise<AxiosResponse<Answer>> => {
  return axios.get("/api/answers/" + answerId);
};

export const getOptions = (params?: {
  ids: string[];
}): Promise<AxiosResponse<Option[]>> => {
  return axios.get("/api/options", { params });
};
