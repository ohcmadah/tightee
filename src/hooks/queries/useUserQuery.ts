import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../common/apis";
import { User } from "../../@types";

export const useUserQuery = (uid: User["id"]) => {
  const query = useQuery({
    queryKey: ["user", uid],
    queryFn: () => getUser(uid),
  });
  return query;
};
