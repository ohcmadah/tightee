import instance from "./instance";
import { GetQuestionResponse, GetQuestionsResponse } from "../@types/response";

export const getQuestions = (params?: { date?: string }) => {
  return instance.get<GetQuestionsResponse>("/questions", { params });
};

export const getQuestion = (id: string) => {
  return instance.get<GetQuestionResponse>("/questions/" + id);
};
