import React, { createContext, useContext } from "react";
import cn from "classnames";
import { formatPercent } from "../common/utils";

import chartIcon from "../assets/chart.png";

/**
 * string 타입의 `children`을 받아 그 안에 입력된 **{value} 문자열**을 <span className="text-primary">{`props.value`}</span>로 치환합니다.
 */
const Summary = ({
  value,
  className,
  children,
}: {
  value: number | string;
  className?: cn.Argument;
  children?: string;
}) => {
  const regex = /(\{value\})/;
  const elements = children?.split(regex);

  return (
    <div className={cn("flex items-center text-grayscale-80", className)}>
      <img width={20} src={chartIcon} alt="chart" className="mr-1.5" />
      <div>
        {elements?.map((element, index) =>
          element.match(regex) ? (
            <span key={index} className="text-primary">
              {typeof value === "number" ? formatPercent(value) : value}
            </span>
          ) : (
            element
          )
        )}
      </div>
    </div>
  );
};

type ChartState = { title: string; ratio: number }[];
const ChartContext = createContext<ChartState | undefined>(undefined);

const DEFAULT_COLORS = ["#ED7D31", "#4472C4"];

const Pie = ({
  className,
  size,
  colors = DEFAULT_COLORS,
}: {
  className?: React.SVGAttributes<SVGSVGElement>["className"];
  size: string | number;
  colors?: string[];
}) => {
  const data = useContext(ChartContext);

  if (!data) {
    return <>ChartProvider not found</>;
  }

  let filled = 0;
  const radius = 25;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {data.map(({ ratio }, index) => {
        const strokeLength = circumference * ratio;
        const spaceLength = circumference - strokeLength;
        const offset = filled * circumference;

        filled += ratio;
        return (
          <circle
            key={index}
            r={radius}
            cx="50%"
            cy="50%"
            fill="transparent"
            stroke={colors[index]}
            strokeWidth={radius * 2}
            strokeDasharray={`${strokeLength} ${spaceLength}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90) translate(${-100})`}
          ></circle>
        );
      })}
    </svg>
  );
};

const Chart = ({
  data,
  children,
}: {
  data: ChartState;
  children: React.ReactNode;
}) => <ChartContext.Provider value={data}>{children}</ChartContext.Provider>;

export default Object.assign(Chart, { Summary, Pie });
