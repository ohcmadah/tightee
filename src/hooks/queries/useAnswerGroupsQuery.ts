import { useQuery } from "@tanstack/react-query";
import { getAnswerGroups } from "../../api/answer";

export const useAnswerGroupsQuery = (groupKeys: string[]) => {
  const query = useQuery({
    queryKey: ["answerGroups"],
    queryFn: () => getAnswerGroups({ groups: groupKeys }),
  });
  return query;
};
