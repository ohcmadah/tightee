import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { UpdateData } from "firebase/firestore";
import { auth } from "../config";
import { getLocalTime } from "./utils";

import { Answer, Auth, Option, Question, User } from "../@types";
import {
  KAKAO_SCOPE_BIRTHDAY,
  KAKAO_SCOPE_EMAIL,
  KAKAO_SCOPE_GENDER,
  KAKAO_SCOPE_NICKNAME,
} from "./constants";

const getCurrentUserId = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
};

export const loginWithKakao = (state?: any) => {
  const redirectUri = `${location.origin}/callback/kakaotalk`;
  const scope = [
    KAKAO_SCOPE_NICKNAME,
    KAKAO_SCOPE_GENDER,
    KAKAO_SCOPE_BIRTHDAY,
    KAKAO_SCOPE_EMAIL,
  ].join(",");

  window.Kakao.Auth.authorize({
    redirectUri,
    scope,
    ...(state ? { state } : {}),
  });
};

export const authKakao = (code: string): Promise<AxiosResponse<Auth>> => {
  return axios.post("/api/auth/kakao", { code });
};

export const createUser = (user: User) => {
  return axios.post("/api/users/" + user.id, { ...user });
};

const getAuthIdToken = () => {
  const authUser = auth.currentUser;
  if (!authUser) {
    throw new Error("로그인해 주세요.");
  }
  return authUser.getIdToken();
};

export const getUser = async (id: string): Promise<User | null> => {
  const token = await getAuthIdToken();
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

export const updateUser = async (id: string, data: UpdateData<User>) => {
  const token = await getAuthIdToken();
  return await axios.patch(
    "/api/users/" + id,
    { ...data },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteUser = (token: string) => {
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

export const getQuestion = (id: string): Promise<AxiosResponse<Question>> => {
  return axios.get("/api/questions/" + id);
};

export const answer = (
  questionId: string,
  optionId: string
): Promise<AxiosResponse<{ id: string }>> => {
  return axios.post("/api/answers", {
    question: questionId,
    option: optionId,
    user: getCurrentUserId(),
  });
};

const getAnswers = (config: AxiosRequestConfig) => {
  return axios.get("/api/answers", config);
};

export const getMyAnswers = async (userId: string): Promise<Answer[]> => {
  const token = await getAuthIdToken();
  const res = await getAnswers({
    params: { user: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.status === 204 ? [] : res.data;
};

export const getAnswerGroups = async (params: {
  groups: string[];
  questionId?: string;
}): Promise<{ [groupKey: string]: { [id: string]: Option[] } }> => {
  const { groups, questionId } = params;
  const config = {
    params: { groups, ...(questionId ? { question: questionId } : {}) },
  };
  const res = await getAnswers(config);
  return res.status === 204 ? {} : res.data;
};

export const getAnswer = (
  answerId: string,
  params?: { token?: string }
): Promise<AxiosResponse<Answer>> => {
  const headers = params && { Authorization: `Bearer ${params.token}` };
  return axios.get("/api/answers/" + answerId, { headers });
};

export const getOptions = (params?: {
  ids: string[];
}): Promise<AxiosResponse<Option[]>> => {
  return axios.get("/api/options", { params });
};
