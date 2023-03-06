import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../../common/apis";

export const useQuestionQuery = (id: string) => {
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
