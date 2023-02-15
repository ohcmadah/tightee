import cn from "classnames";
import { Link, LinkProps } from "react-router-dom";
import { Question as QuestionType } from "../@types";

import Badge from "./Badge";
import Box from "./Box";
import Chart from "./Chart";
import Icon from "./Icon";
import Img from "./Img";

type Props = {
  className?: cn.Argument;
  createdAt?: QuestionType["createdAt"];
  title: QuestionType["title"];
  option?: string;
  linkProps: LinkProps;
  ratio?: number;
};

const Question = ({
  className,
  createdAt,
  title,
  option,
  linkProps,
  ratio,
}: Props) => (
  <Box className={className}>
    {createdAt && (
      <Badge
        className={cn(
          "mb-5",
          createdAt === "TODAY" ? "bg-primary-peach" : "bg-question-not-today"
        )}
      >
        {createdAt}
      </Badge>
    )}
    <div className="mb-4 px-2">
      <div className="text-lg font-medium">{title}</div>
      {option && (
        <div className="mt-3 mb-2 inline-flex items-start text-primary">
          <Icon src="/images/reply.svg" alt="reply" />
          <div>{option}</div>
        </div>
      )}
    </div>
    <Link {...linkProps} className="flex w-full items-center justify-between">
      {option && ratio ? (
        <Chart.Summary value={ratio} className="mr-3 truncate text-ellipsis">
          {"전체 타이티 중에 {value}에 속해요."}
        </Chart.Summary>
      ) : (
        <div className="mr-3 text-grayscale-20">
          <Icon src="/images/reply.svg" alt="reply" />
          <span className="align-middle">대답하러 가기</span>
        </div>
      )}
      <Img src="/images/right_arrow.svg" width={9} height={16} alt="arrow" />
    </Link>
  </Box>
);

export default Question;
