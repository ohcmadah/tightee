import React, { createContext, useContext } from "react";
import cn from "classnames";
import { formatPercent } from "../common/utils";

import Icon from "./Icon";

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
      <Icon src={chartIcon} alt="chart" />
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

const calcXY = (isSelected: boolean, ratio: number) => {
  if (!isSelected || ratio === 1) {
    return { x: 0, y: 0 };
  }
  return { x: 5, y: ratio <= 0.5 ? 3 : -3 };
};

type ChartData = {
  id: string;
  title: string;
  ratio: number;
  color: string;
  isSelected: boolean;
}[];
const ChartContext = createContext<ChartData | undefined>(undefined);

const DEFAULT_COLORS = ["#ED7D31", "#4472C4"];

const Pie = ({
  size,
  className,
}: {
  size: string | number;
  className?: React.SVGAttributes<SVGSVGElement>["className"];
}) => {
  const data = useContext(ChartContext);

  if (!data) {
    return <>ChartProvider not found.</>;
  }

  const RADIUS = 22.5;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let filled = 0;
  const sortedData = data.sort((a, _) => (a.isSelected ? -1 : 0));

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {sortedData.map(({ title, ratio, color, isSelected }) => {
        const strokeLength = CIRCUMFERENCE * ratio;
        const spaceLength = CIRCUMFERENCE - strokeLength;
        const offset = filled * CIRCUMFERENCE;

        const { x, y } = calcXY(isSelected, ratio);

        filled += ratio;
        return (
          <circle
            key={title}
            r={RADIUS}
            cx="50%"
            cy="50%"
            fill="transparent"
            stroke={color}
            strokeWidth={RADIUS * 2}
            strokeDasharray={`${strokeLength} ${spaceLength}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90) translate(${-100 + y} ${x})`}
          ></circle>
        );
      })}
    </svg>
  );
};

const Regend = () => {
  const data = useContext(ChartContext);

  if (!data) {
    return <>ChartProvider not found.</>;
  }

  return (
    <div className="last:mb-0">
      {data
        .sort((a, b) => a.ratio - b.ratio)
        .map(({ title, ratio, color, isSelected }) => (
          <div
            key={title}
            className={cn("mb-3 flex items-center", {
              "font-bold": isSelected,
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
  id,
  children,
}: {
  data: { [id: string]: { title: string; ratio: number } };
  id: string;
  children: React.ReactNode;
}) => {
  const value = Object.entries(data).reduce(
    (acc: ChartData, [currentId, value], index) => [
      ...acc,
      {
        ...value,
        id,
        color: DEFAULT_COLORS[index],
        isSelected: currentId === id,
      },
    ],
    []
  );
  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
};

export default Object.assign(Chart, { Summary, Pie, Regend });
