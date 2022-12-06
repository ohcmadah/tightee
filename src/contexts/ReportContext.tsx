import { createContext, useContext, useMemo } from "react";
import { Answer, MBTI } from "../@types";
import { calcAgeGroup, groupBy } from "../common/utils";

type Group<K> = ReturnType<typeof groupBy<K, Answer>>;

type Data = {
  answer: Answer;
  answers: Answer[];
};
type ReportState = Data & {
  groups: {
    user: {
      mbti: Group<MBTI>;
      region: Group<string>;
      age: Group<string>;
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
        age: groupBy(answers, (answer) => calcAgeGroup(answer.user.birthdate)),
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
