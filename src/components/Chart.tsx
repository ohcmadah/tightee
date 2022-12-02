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

export default { Summary };
