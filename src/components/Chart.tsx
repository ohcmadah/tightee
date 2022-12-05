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

type ChartData = { id: string; title: string; ratio: number; color: string }[];
const ChartContext = createContext<ChartData | undefined>(undefined);

const DEFAULT_COLORS = ["#ED7D31", "#4472C4"];

const Pie = ({
  className,
  size,
}: {
  className?: React.SVGAttributes<SVGSVGElement>["className"];
  size: string | number;
}) => {
  const data = useContext(ChartContext);

  if (!data) {
    return <>ChartProvider not found.</>;
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
      {data.map(({ title, ratio, color }) => {
        const strokeLength = circumference * ratio;
        const spaceLength = circumference - strokeLength;
        const offset = filled * circumference;

        filled += ratio;
        return (
          <circle
            key={title}
            r={radius}
            cx="50%"
            cy="50%"
            fill="transparent"
            stroke={color}
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

const Regend = ({ selectedId }: { selectedId: string }) => {
  const data = useContext(ChartContext);

  if (!data) {
    return <>ChartProvider not found.</>;
  }

  return (
    <div className="last:mb-0">
      {data
        .sort((a, b) => a.ratio - b.ratio)
        .map(({ id, title, ratio, color }) => (
          <div
            key={title}
            className={cn("mb-3 flex items-center", {
              "font-bold": selectedId === id,
            })}
          >
            <span
              className="mr-1.5 inline-block h-[16px] w-[24px] rounded-xl"
              style={{ backgroundColor: color }}
            />
            {title}&nbsp;
            <span className="text-grayscale-40">({formatPercent(ratio)})</span>
          </div>
        ))}
    </div>
  );
};

const Chart = ({
  data,
  children,
}: {
  data: { [id: string]: { title: string; ratio: number } };
  children: React.ReactNode;
}) => {
  const value = Object.entries(data).reduce(
    (acc: ChartData, [id, value], index) => [
      ...acc,
      { ...value, id, color: DEFAULT_COLORS[index] },
    ],
    []
  );
  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
};

export default Object.assign(Chart, { Summary, Pie, Regend });
