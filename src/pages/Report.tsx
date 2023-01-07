import React, { useMemo, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import cn from "classnames";
import { getAnswer, getAnswerGroups, getQuestion } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Question } from "../@types";
import {
  calcAgeGroup,
  convertGenderCodeToReadable,
  convertRegionCodeToReadable,
  formatPercent,
  getFormattedDate,
  groupBy,
} from "../common/utils";
import {
  ReportContextProvider,
  useReportState,
} from "../contexts/ReportContext";
import copyToClipboard from "../common/copyToClipboard";
import { useAuthState } from "../contexts/AuthContext";
import { User } from "firebase/auth";

import { ToastContainer, toast } from "react-toastify";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import Box from "../components/Box";
import Badge from "../components/Badge";
import Chart from "../components/Chart";
import Icon from "../components/Icon";
import Button, {
  ColoredProps as ColoredButtonProps,
} from "../components/Button";
import Notice from "../components/Notice";

const RANK_ICONS = [
  "/images/gold.png",
  "/images/silver.png",
  "/images/bronze.png",
];

const calcRatio = (
  group: Map<string, string[]>,
  total: number,
  defaultOptions: Record<string, string>
) => {
  return Object.entries(defaultOptions).reduce((acc, [id, text]) => {
    const sameOptions = group.get(id);

    const ratio = (sameOptions?.length || 0) / total;
    return { ...acc, [id]: { title: text, ratio } };
  }, {});
};

const genChartData = (
  options: string[],
  defaultOptions: Record<string, string>
): { [optionId: string]: { title: string; ratio: number } } => {
  const total = options.length;
  const group = groupBy(options, (option) => option);
  return calcRatio(group, total, defaultOptions);
};

const calcMBTIRatio = (
  group: Record<string, string[]>,
  defaultOptions: Record<string, string>
) => {
  return Object.entries(group)
    .filter(([mbti, _]) => mbti !== "null")
    .map(([mbti, options]) => {
      const data = genChartData(options, defaultOptions);
      const { title, ratio } = Object.values(data).sort(
        (a, b) => b.ratio - a.ratio
      )[0];
      return { mbti, option: title, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio);
};

const calcMBTIRank = (
  data: ReturnType<typeof calcMBTIRatio>,
  isSkip = false
) => {
  const rank = Array.from({ length: data.length }, () => 1);

  for (let i = 0; i < data.length; i++) {
    const currentItem = data[i];
    const compared = new Set();
    for (let j = 0; j < data.length; j++) {
      const otherItem = data[j];
      if (
        otherItem.ratio > currentItem.ratio &&
        (isSkip || !compared.has(otherItem.ratio))
      ) {
        compared.add(otherItem.ratio);
        rank[i]++;
      }
    }
  }

  return rank;
};

const FloatingFooter = ({
  className,
  color,
  onClick,
  children,
}: {
  className: cn.Argument;
  color: ColoredButtonProps["color"];
  onClick: ColoredButtonProps["onClick"];
  children: React.ReactNode;
}) => (
  <footer className={cn("sticky z-nav w-full pb-[20px] pt-6", className)}>
    <Button.Colored
      color={color}
      className="flex w-full items-center py-4 text-white"
      onClick={onClick}
    >
      {children}
    </Button.Colored>
  </footer>
);

const ShareFooter = () => {
  const { answer } = useReportState();
  const onShare = async () => {
    const url = location.origin + "/" + answer.id + "/public";
    if (navigator.share) {
      await navigator.share({
        title: "Tightee",
        url,
      });
    } else {
      const result = await copyToClipboard(url);
      if (result) {
        toast.success("복사가 완료되었어요!");
      } else {
        toast.error("공유를 지원하지 않는 환경이에요 :(");
      }
    }
  };
  return (
    <FloatingFooter className="bottom-nav" color="violet" onClick={onShare}>
      <Icon src="/images/letter.png" alt="letter" className="mr-3" />
      친구에게 리포트 공유하기
      <Icon src="/images/share.svg" alt="share" className="ml-auto mr-0" />
    </FloatingFooter>
  );
};

const RightArrowIcon = () => (
  <svg
    className="ml-auto"
    width="9"
    height="16"
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.657615 0.915855C0.548587 1.02748 0.487549 1.17732 0.487549 1.33335C0.487549 1.48939 0.548587 1.63923 0.657615 1.75085L6.74886 7.9996L0.657615 14.2471C0.548587 14.3587 0.487549 14.5086 0.487549 14.6646C0.487549 14.8206 0.548587 14.9705 0.657615 15.0821C0.71061 15.1365 0.773972 15.1798 0.843961 15.2093C0.91395 15.2389 0.989148 15.2541 1.06511 15.2541C1.14108 15.2541 1.21628 15.2389 1.28627 15.2093C1.35626 15.1798 1.41962 15.1365 1.47262 15.0821L7.95011 8.43585C8.06388 8.31914 8.12755 8.16259 8.12755 7.9996C8.12755 7.83661 8.06388 7.68007 7.95011 7.56335L1.47262 0.917105C1.41962 0.862676 1.35626 0.819414 1.28627 0.789875C1.21628 0.760336 1.14108 0.745117 1.06511 0.745117C0.989148 0.745117 0.91395 0.760336 0.843961 0.789875C0.773972 0.819414 0.71061 0.862676 0.657615 0.917105V0.915855Z"
      fill="white"
    />
  </svg>
);

const PublicFooter = () => {
  const navigate = useNavigate();
  const {
    answer: { question },
  } = useReportState();
  const authState = useAuthState();
  const onStart = () => {
    const isAuthentication =
      authState.state === "loaded" && authState.isAuthentication;
    if (isAuthentication) {
      return navigate("/questions/" + question);
    }
    return navigate("/welcome", {
      state: { question },
    });
  };
  return (
    <FloatingFooter className="bottom-0" color="primary" onClick={onStart}>
      <Icon src="/images/star_eyes.png" alt="star eyes" className="mr-3" />
      질문에 대답하고 나만의 리포트 보러가기
      <RightArrowIcon />
    </FloatingFooter>
  );
};

const Title = ({ icon, children }: { icon: string; children: string }) => (
  <Badge className="m-auto mb-5 flex items-center bg-system-yellow text-base font-normal">
    <Icon src={icon} alt={children} />
    {children}
  </Badge>
);

const EmptyMBTI = () => {
  const { isPublic } = useReportState();
  return (
    <div className="flex items-start">
      <Icon src="/images/light.png" alt="tip" />
      <div className="text-grayscale-80">
        <div className="font-medium leading-7">
          MBTI 정보가 없어 분석할 수 없어요 :(
        </div>
        {!isPublic && (
          <>
            <div className="mb-3">
              MBTI 설정 후 다음 날 질문부터 정보를 확인할 수 있어요!
            </div>
            <Link to="/profile" className="font-medium text-grayscale-100">
              {"MBTI 설정하기 >"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

const DetailReport = () => {
  const {
    answer: { user, option },
    groups,
    question: { options },
  } = useReportState();

  const mbtiData = genChartData(
    groups["user.MBTI"][user.MBTI ?? "null"],
    options
  );
  const regionData = genChartData(groups["user.region"][user.region], options);
  const ageGroup = calcAgeGroup(user.birthdate);
  const ageData = genChartData(groups["user.birthdate"][ageGroup], options);
  const genderData = genChartData(groups["user.gender"][user.gender], options);

  return (
    <>
      <h2 className="mt-10 mb-7 select-none text-2xl font-bold">상세 리포트</h2>
      <section>
        <Box.Container>
          <Box>
            <Title icon="/images/genie.png">MBTI별 분석</Title>
            {user.MBTI ? (
              <Chart data={mbtiData} id={option}>
                <Chart.Summary>{`'${user.MBTI}' 유형의 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
                <Chart.Pie className="m-auto my-4" size="45%" />
                <Chart.Regend />
              </Chart>
            ) : (
              <EmptyMBTI />
            )}
          </Box>

          <Box>
            <Title icon="/images/location.png">지역별 분석</Title>
            <Chart data={regionData} id={option}>
              <Chart.Summary>
                {"'" +
                  convertRegionCodeToReadable(user.region) +
                  "'에 사는 타이티 중에 {value}가 같은 응답을 했어요."}
              </Chart.Summary>
              <Chart.Pie className="m-auto my-4" size="45%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon="/images/hourglass.png">나이별 분석</Title>
            <Chart data={ageData} id={option}>
              <Chart.Summary>{`'${ageGroup}대'의 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
              <Chart.Pie className="m-auto my-4" size="45%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon="/images/heart.png">성별 분석</Title>
            <Chart data={genderData} id={option}>
              <Chart.Summary>
                {`성별이 '${convertGenderCodeToReadable(
                  user.gender
                )}'인 타이티 중에 {value}가 같은 응답을 했어요.`}
              </Chart.Summary>
              <Chart.Pie className="m-auto my-4" size="45%" />
              <Chart.Regend />
            </Chart>
          </Box>
        </Box.Container>
      </section>
    </>
  );
};

const ToggleButton = ({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <button
    className="flex w-full items-center justify-center font-medium text-grayscale-60"
    onClick={onClick}
  >
    {children}
  </button>
);

const RankItem = ({
  item,
  rank,
  mbti,
}: {
  item: { mbti: string; option: string; ratio: number };
  rank: number;
  mbti: string;
}) => {
  const { mbti: itemMBTI, option, ratio } = item;
  const icon = rank <= 3 ? RANK_ICONS[rank - 1] : "/images/white_heart.png";
  return (
    <li
      className={cn("mb-3 flex items-start last:mb-0", {
        "font-bold": itemMBTI === mbti,
      })}
    >
      <Icon src={icon} alt={`${rank}등`} />
      <div>
        {itemMBTI}{" "}
        <span className="text-grayscale-60">
          ({option}, {formatPercent(ratio)})
        </span>
      </div>
    </li>
  );
};

const MBTIRankReport = () => {
  const {
    answer: {
      user: { MBTI },
    },
    groups,
    question,
  } = useReportState();
  const [isOpen, setIsOpen] = useState(false);

  if (MBTI === null) {
    return (
      <Box>
        <Title icon="/images/rank.png">MBTI 단합 랭킹</Title>
        <EmptyMBTI />
      </Box>
    );
  }

  const mbtiData = calcMBTIRatio(groups["user.MBTI"], question.options);
  const rank = calcMBTIRank(mbtiData);
  const rankWithSkipping = calcMBTIRank(mbtiData, true);
  const myRank =
    rankWithSkipping[mbtiData.map(({ mbti }) => mbti).indexOf(MBTI)];
  const visibleItems = useMemo(
    () => (isOpen ? mbtiData : mbtiData.slice(0, 3)),
    [isOpen]
  );

  return (
    <Box>
      <Title icon="/images/rank.png">MBTI 단합 랭킹</Title>
      <Chart.Summary value={myRank + "등"}>
        {"16개 MBTI 중에서 {value}으로 대답이 일치해요."}
      </Chart.Summary>

      <ul className="my-5">
        {visibleItems.map((item, index) => (
          <RankItem
            key={item.mbti}
            item={item}
            rank={rank[index]}
            mbti={MBTI}
          />
        ))}
      </ul>

      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "접기" : "펼치기"}
        <img
          src="/images/down_arrow.svg"
          alt="up arrow"
          className={cn("ml-1.5", { "rotate-180": isOpen })}
        />
      </ToggleButton>
    </Box>
  );
};

const BasicReport = () => {
  const { answer, groups, question } = useReportState();

  const optionsByOptionIdMap = groups["option"];
  const total = Object.values(optionsByOptionIdMap).flat().length;

  return (
    <section>
      <Box.Container>
        <Box>
          <Badge className="bg-question-not-today">
            {getFormattedDate(question.createdAt)}
          </Badge>
          <div className="mt-3 ml-2">{question.title}</div>
          <div className="mt-3 ml-1 flex items-center font-medium text-primary">
            <Icon src="/images/reply.svg" alt="reply" />
            {question.options[answer.option]}
          </div>
        </Box>

        <Box>
          <Chart
            data={calcRatio(
              new Map(Object.entries(optionsByOptionIdMap)),
              total,
              question.options
            )}
            id={answer.option}
          >
            <Chart.Summary>{`전체 타이티 중에 {value}를 차지하고 있어요.`}</Chart.Summary>
            <Chart.Pie className="m-auto my-4" size="45%" />
            <Chart.Regend />
          </Chart>
        </Box>

        <MBTIRankReport />
      </Box.Container>
    </section>
  );
};

const Main = () => (
  <main>
    <BasicReport />
    <DetailReport />
    <Notice
      iconSrc="/images/clock.png"
      alt="clock"
      className="mt-8 text-sm text-grayscale-60"
    >
      하루가 끝나기 전에는 리포트가 변경될 수 있어요 :)
    </Notice>
  </main>
);

const MyReport = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header>
        <Header.H1>
          <Header.Back onClick={() => navigate("/answer")}>리포트</Header.Back>
        </Header.H1>
      </Header>
      <Main />
      <ShareFooter />
    </>
  );
};

const PublicReport = () => {
  const {
    answer: {
      user: { nickname },
    },
  } = useReportState();
  const nicknameWithEllipsis =
    nickname.length > 10 ? nickname.substring(0, 10) + "..." : nickname;

  return (
    <>
      <Header>
        <Header.H1>{nicknameWithEllipsis}님의 리포트</Header.H1>
      </Header>
      <Main />
      <PublicFooter />
    </>
  );
};

const getMyAnswerAndAnswers = async (
  answerId: string,
  user: User | null,
  question?: Question
) => {
  const groupKeys = [
    "user.MBTI",
    "user.region",
    "user.birthdate",
    "user.gender",
    "option",
  ];
  if (question) {
    const answerPromise = user
      ? user.getIdToken().then((token) => getAnswer(answerId, { token }))
      : getAnswer(answerId);
    const groupsPromise = getAnswerGroups({
      groups: groupKeys,
      questionId: question.id,
    });
    const [answerResult, groupsResult] = await Promise.allSettled([
      answerPromise,
      groupsPromise,
    ]);
    if (answerResult.status === "rejected") {
      throw new Error(answerResult.reason);
    }
    if (groupsResult.status === "rejected") {
      throw new Error(groupsResult.reason);
    }
    return {
      answer: answerResult.value.data,
      question,
      groups: groupsResult.value,
    };
  }

  const token = await user?.getIdToken();
  const answer = await getAnswer(answerId, { token });

  const questionPromise = getQuestion(answer.data.question);
  const groupsPromise = getAnswerGroups({
    groups: groupKeys,
    questionId: answer.data.question,
  });
  const [questionResult, groupsResult] = await Promise.allSettled([
    questionPromise,
    groupsPromise,
  ]);
  if (questionResult.status === "rejected") {
    throw new Error(questionResult.reason);
  }
  if (groupsResult.status === "rejected") {
    throw new Error(groupsResult.reason);
  }

  return {
    answer: answer.data,
    question: questionResult.value.data,
    groups: groupsResult.value,
  };
};

const Report = ({ isPublic = false }: { isPublic?: boolean }) => {
  const { answerId } = useParams();
  const location = useLocation();
  const authState = useAuthState();
  const isAuthentication =
    authState.state === "loaded" && authState.isAuthentication;

  if (!answerId) {
    // TODO: 404 페이지 만들기
    return <Navigate to={isPublic ? "/" : "/answer"} />;
  }

  const { state, data } = useAsyncAPI(
    getMyAnswerAndAnswers,
    answerId,
    isAuthentication && !isPublic ? authState.user : null,
    location.state?.question
  );

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <ErrorView.Default />;

    case "loaded":
      if (!isPublic && isAuthentication) {
        if (data.answer.user.id !== authState.user.uid) {
          return (
            <ErrorView.Default>
              <article>리포트를 볼 수 있는 권한이 없어요 :(</article>
            </ErrorView.Default>
          );
        }
      }
      return (
        <ReportContextProvider data={{ ...data, isPublic }}>
          {isPublic ? <PublicReport /> : <MyReport />}
          <ToastContainer
            className="text-base"
            autoClose={3000}
            theme="colored"
          />
        </ReportContextProvider>
      );
  }
};

const ReportWrapper = ({ isPublic = false }: { isPublic?: boolean }) =>
  isPublic ? (
    <Layout>
      <Report isPublic={isPublic} />
    </Layout>
  ) : (
    <Report isPublic={isPublic} />
  );

export default ReportWrapper;
