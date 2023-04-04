import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../../common/apis";
import { useQuestionsQuery } from "./useQuestionsQuery";

export const useQuestionQuery = (id: string) => {
  const questions = useQuestionsQuery();

  if (questions.data) {
    return {
      ...questions,
      data: questions.data.find((question) => question.id === id),
    };
  }

  return useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestion(id),
    select: (res) => {
      if (res.status === 204) {
        return null;
      }
      return res.data;
    },
  });
};
