import { Question } from "../@types";
import instance from "./instance";

export const getQuestions = (params?: { date?: string }) => {
  return instance.get<Question[]>("/api/questions", { params });
};

export const getQuestion = (id: string) => {
  return instance.get<Question>("/api/questions/" + id);
};
