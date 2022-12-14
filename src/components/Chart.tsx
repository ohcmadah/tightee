import React, { createContext, useContext } from "react";
import cn from "classnames";
import { formatPercent } from "../common/utils";

import Icon from "./Icon";

type ChartData = {
  id: string;
  title: string;
  ratio: number;
  color: string;
  isSelected: boolean;
}[];
const ChartContext = createContext<ChartData | undefined>(undefined);

/**
 * string 타입의 `children`을 받아 그 안에 입력된 **{value} 문자열**을 <span className="text-primary">{`props.value`}</span>로 치환합니다.
 */
const Summary = ({
  value,
  className,
  children,
}: {
  value?: number | string;
  className?: string;
  children?: string;
}) => {
  const regex = /(\{value\})/;
  const elements = children?.split(regex);

  const data = useContext(ChartContext);
  const ratio = data?.filter((value) => value.isSelected)[0].ratio;

  return (
    <div className="flex items-start text-grayscale-80">
      <Icon src="/images/chart.png" alt="chart" />
      <div className={className}>
        {elements?.map((element, index) =>
          element.match(regex) ? (
            <span key={index} className="text-primary">
              {value
                ? typeof value === "number"
                  ? formatPercent(value)
                  : value
                : formatPercent(ratio || 0)}
            </span>
          ) : (
            element
          )
        )}
      </div>
    </div>
  );
};

const calcY = (ratio: number) => {
  if (ratio <= 0.25) {
    return 12 * (1 - ratio);
  }
  if (ratio <= 0.5) {
    return 3;
  }
  if (ratio < 0.75) {
    return -3;
  }
  return -5;
};

const calcXY = (isSelected: boolean, ratio: number) => {
  if (!isSelected || ratio === 1) {
    return { x: 0, y: 0 };
  }
  return { x: 5, y: calcY(ratio) };
};

const DEFAULT_COLORS = ["#30A9DE", "#EFDC05", "#E53A40", "#090707"];

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

  const RADIUS = 18;
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
            strokeDasharray={
              strokeLength.toFixed(2) + " " + spaceLength.toFixed(2)
            }
            strokeDashoffset={-offset}
            transform={`rotate(-90 50 50) translate(${y} ${x})`}
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
    <ul>
      {data.map(({ title, ratio, color, isSelected }) => (
        <li
          key={title}
          className={cn("mb-3 flex items-start last:mb-0", {
            "font-bold": isSelected,
          })}
        >
          <span
            className="mr-1.5 mt-1 inline-block h-[16px] w-[24px] flex-none rounded-xl"
            style={{ backgroundColor: color }}
          />
          <div>
            {title}&nbsp;
            <span className="text-grayscale-40">({formatPercent(ratio)})</span>
          </div>
        </li>
      ))}
    </ul>
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
  const value = Object.entries(data)
    .sort(([_a, a], [_b, b]) => b.ratio - a.ratio)
    .reduce(
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

export default Object.assign(Chart, {
  Summary: Summary,
  Pie: Pie,
  Regend: Regend,
});
