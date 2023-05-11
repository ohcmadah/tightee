import { useQuery } from "@tanstack/react-query";
import { getMyAnswers } from "../../api/answer";
import { User } from "../../@types/user";

export const useMyAnswersQuery = (uid?: User["id"]) => {
  const query = useQuery({
    queryKey: ["answers", uid],
    queryFn: () => {
      if (uid) {
        return getMyAnswers(uid);
      }
      throw new Error("유저 정보가 존재하지 않습니다.");
    },
  });
  return query;
};
