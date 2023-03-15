import { getLocalTime } from "../../common/utils";
import { useQuestionsQuery } from "./useQuestionsQuery";

export const useTodayQuestionsQuery = () => {
  const questions = useQuestionsQuery();
  const today = getLocalTime().format("YYYYMMDD");

  if (questions.data) {
    return {
      ...questions,
      data: questions.data.filter((question) => question.createdAt === today),
    };
  }

  return questions;
};
