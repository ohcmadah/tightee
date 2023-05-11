import instance from "./instance";
import { auth } from "../config";
import { AxiosRequestConfig } from "axios";
import { Answer } from "../@types";

const getCurrentUserId = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
};

const getAuthIdToken = () => {
  const authUser = auth.currentUser;
  if (!authUser) {
    throw new Error("로그인해 주세요.");
  }
  return authUser.getIdToken();
};

export const answer = (questionId: string, optionId: string) => {
  return instance.post<{ id: string }>("/api/answers", {
    question: questionId,
    option: optionId,
    user: getCurrentUserId(),
  });
};

const getAnswers = (config: AxiosRequestConfig) => {
  return instance.get("/api/answers", config);
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
}): Promise<{ [groupKey: string]: { [id: string]: string[] } }> => {
  const { groups, questionId } = params;
  const config = {
    params: { groups, ...(questionId ? { question: questionId } : {}) },
  };
  const res = await getAnswers(config);
  return res.status === 204 ? {} : res.data;
};

export const getAnswer = (answerId: string, params?: { token?: string }) => {
  const headers = params && { Authorization: `Bearer ${params.token}` };
  return instance.get<Answer>("/api/answers/" + answerId, { headers });
};
