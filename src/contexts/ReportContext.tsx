import { createContext, useContext, useMemo } from "react";
import { Answer, MBTI, Option, Question, User } from "../@types";
import { getProperty, groupBy } from "../common/utils";

type Group<K> = ReturnType<typeof groupBy<K, Answer>>;

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
    user: {
      mbti: Group<MBTI>;
      region: Group<string>;
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
      user: {
        mbti: groupBy(answers, (answer) => answer.user.MBTI),
        region: groupBy(answers, (answer) => answer.user.region),
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
