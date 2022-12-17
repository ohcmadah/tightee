import { createContext, useContext } from "react";
import { Answer, Option } from "../@types";

type ReportState = {
  answer: Answer;
  options: Option[];
  groups: { [groupKey: string]: { [id: string]: Option[] } };
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
