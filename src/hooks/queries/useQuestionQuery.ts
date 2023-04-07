import { useQuestionsQuery } from "./useQuestionsQuery";

export const useQuestionQuery = (id?: string) => {
  const questions = useQuestionsQuery();

  const question = questions.data?.find((question) => question.id === id);
  return {
    ...questions,
    data: question,
  };
};
