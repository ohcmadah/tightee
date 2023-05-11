import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "../../api/question";

export const useQuestionsQuery = (
  keys?: string[],
  params?: Parameters<typeof getQuestions>[0]
) => {
  return useQuery({
    queryKey: ["questions", ...(keys || [])],
    queryFn: () => getQuestions(params),
    select: (res) => res.data,
  });
};
