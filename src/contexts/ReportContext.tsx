import { createContext, useContext } from "react";
import { Answer, Question } from "../@types";

type ReportState = {
  isPublic: boolean;
  answer: Answer;
  question: Question;
  groups: { [groupKey: string]: { [id: string]: string[] } };
};

const ReportStateContext = createContext<ReportState | undefined>(undefined);

export const ReportContextProvider = ({
  data,
  children,
}: {
  data: ReportState;
  children: React.ReactNode;
}) => {
  return (
    <ReportStateContext.Provider value={{ ...data }}>
      {children}
    </ReportStateContext.Provider>
  );
};

export const useReportState = () => {
  const reportState = useContext(ReportStateContext);
  if (!reportState) throw new Error("ReportContextProvider not found");
  return reportState;
};
