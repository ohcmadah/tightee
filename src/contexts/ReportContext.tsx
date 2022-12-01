import { createContext, useContext, useMemo } from "react";
import { Answer, Option, Question, User } from "../@types";
import { groupBy } from "../common/utils";

type Group = ReturnType<typeof groupBy<Answer>>;

type Data = {
  answer: {
    question: Question & { id: string };
    option: Option & { id: string };
  };
  answers: Answer[];
  user: User;
};
type ReportState = Data & {
  groups: {
    option: Group;
    user: {
      mbti: Group;
      region: Group;
    };
  };
};

const ReportStateContext = createContext<ReportState | undefined>(undefined);

export const ReportContextProvider = ({
  data,
  children,
}: {
  data: Data;
  children: React.ReactNode;
}) => {
  const { answers } = data;
  const groups = useMemo(
    () => ({
      option: groupBy(answers, "option.id"),
      user: {
        mbti: groupBy(answers, "user.MBTI"),
        region: groupBy(answers, "user.region"),
      },
    }),
    [answers]
  );
  return (
    <ReportStateContext.Provider value={{ ...data, groups }}>
      {children}
    </ReportStateContext.Provider>
  );
};

export const useReportState = () => {
  const reportState = useContext(ReportStateContext);
  if (!reportState) throw new Error("ReportContextProvider not found");
  return reportState;
};
