import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { getAnswer, getAnswerGroups, getOptions } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Option } from "../@types";
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

import { ToastContainer, toast } from "react-toastify";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Box from "../components/Box";
import Badge from "../components/Badge";
import Chart from "../components/Chart";
import Icon from "../components/Icon";
import Button, {
  ColoredProps as ColoredButtonProps,
} from "../components/Button";

import replyIcon from "../assets/reply.svg";
import rankIcon from "../assets/rank.png";
import goldIcon from "../assets/gold.png";
import silverIcon from "../assets/silver.png";
import bronzeIcon from "../assets/bronze.png";
import genieIcon from "../assets/genie.png";
import locationIcon from "../assets/location.png";
import hourglassIcon from "../assets/hourglass.png";
import lightIcon from "../assets/light.png";
import heartIcon from "../assets/heart.png";
import letterIcon from "../assets/letter.png";
import shareIcon from "../assets/share.svg";
import starEyesIcon from "../assets/star_eyes.png";

const RANK_ICONS = [goldIcon, silverIcon, bronzeIcon];

const calcRatio = (
  group: Map<string, Option[]>,
  total: number,
  defaultOptions: Option[]
) => {
  return defaultOptions.reduce((acc, option) => {
    const sameOptions = group.get(option.id);

    const ratio = (sameOptions?.length || 0) / total;
    return { ...acc, [option.id]: { title: option.text, ratio } };
  }, {});
};

const genChartData = (
  options: Option[],
  defaultOptions: Option[]
): { [optionId: string]: { title: string; ratio: number } } => {
  const total = options.length;
  const group = groupBy(options, (option) => option.id);
  return calcRatio(group, total, defaultOptions);
};

const calcMBTIrank = (group: Record<string, Option[]>, options: Option[]) => {
  return Object.entries(group)
    .filter(([mbti, _]) => mbti !== "null")
    .map(([mbti, answers]) => {
      const data = genChartData(answers, options);
      const { title, ratio } = Object.values(data).sort(
        (a, b) => b.ratio - a.ratio
      )[0];
      return { mbti, option: title, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio);
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
      <Icon src={letterIcon} alt="letter" className="mr-3" />
      친구에게 리포트 공유하기
      <Icon src={shareIcon} alt="share" className="ml-auto mr-0" />
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
  return (
    <FloatingFooter
      className="bottom-0"
      color="primary"
      onClick={() => navigate("/welcome")}
    >
      <Icon src={starEyesIcon} alt="star eyes" className="mr-3" />
      질문에 대답하고 나만의 리포트 보러가기
      <RightArrowIcon />
    </FloatingFooter>
  );
};

const Reply = ({ children }: { children?: React.ReactNode }) => (
  <div className="mb-5 flex items-center text-primary">
    <Icon src={replyIcon} alt="reply" />
    {children}
  </div>
);

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
      <Icon src={lightIcon} alt="tip" />
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
    options,
    groups,
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
            <Title icon={genieIcon}>MBTI별 분석</Title>
            <Reply>{option.text}</Reply>
            {user.MBTI ? (
              <Chart data={mbtiData} id={option.id}>
                <Chart.Summary>{`'${user.MBTI}' 유형의 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
                <Chart.Pie className="m-auto my-7" size="40%" />
                <Chart.Regend />
              </Chart>
            ) : (
              <EmptyMBTI />
            )}
          </Box>

          <Box>
            <Title icon={locationIcon}>지역별 분석</Title>
            <Reply>{option.text}</Reply>
            <Chart data={regionData} id={option.id}>
              <Chart.Summary>
                {"'" +
                  convertRegionCodeToReadable(user.region) +
                  "'에 사는 타이티 중에 {value}가 같은 응답을 했어요."}
              </Chart.Summary>
              <Chart.Pie className="m-auto my-7" size="40%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon={hourglassIcon}>나이별 분석</Title>
            <Reply>{option.text}</Reply>
            <Chart data={ageData} id={option.id}>
              <Chart.Summary>{`'${ageGroup}대'의 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
              <Chart.Pie className="m-auto my-7" size="40%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon={heartIcon}>성별 분석</Title>
            <Reply>{option.text}</Reply>
            <Chart data={genderData} id={option.id}>
              <Chart.Summary>
                {`성별이 '${convertGenderCodeToReadable(
                  user.gender
                )}'인 타이티 중에 {value}가 같은 응답을 했어요.`}
              </Chart.Summary>
              <Chart.Pie className="m-auto my-7" size="40%" />
              <Chart.Regend />
            </Chart>
          </Box>
        </Box.Container>
      </section>
    </>
  );
};

const MBTIRankReport = () => {
  const { answer, options, groups } = useReportState();

  if (answer.user.MBTI === null) {
    return (
      <Box>
        <Title icon={rankIcon}>MBTI 순위</Title>
        <EmptyMBTI />
      </Box>
    );
  }

  const rank = calcMBTIrank(groups["user.MBTI"], options);
  const myRank = rank.map((value) => value.mbti).indexOf(answer.user.MBTI) + 1;

  return (
    <Box>
      <Title icon={rankIcon}>MBTI 순위</Title>
      <Chart.Summary value={myRank + "등"}>
        {"16개 MBTI 중에서 {value}으로 대답이 일치해요."}
      </Chart.Summary>
      <div className="mt-5 last:mb-0">
        {rank.map(({ mbti, option, ratio }, index) => (
          <div key={mbti} className="mb-3">
            <Icon src={RANK_ICONS[index]} alt={`${index + 1}등`} />
            {mbti}{" "}
            <span className="text-grayscale-60">
              ({option}, {formatPercent(ratio)})
            </span>
          </div>
        ))}
      </div>
    </Box>
  );
};

const BasicReport = () => {
  const { answer, options, groups } = useReportState();

  const optionsByOptionIdMap = groups["option.id"];
  const total = Object.values(optionsByOptionIdMap).flat().length;

  return (
    <section>
      <Box.Container>
        <Box>
          <Badge className="bg-question-not-today">
            {getFormattedDate(answer.question.createdAt)}
          </Badge>
          <div className="mt-3">{answer.question.title}</div>
        </Box>

        <Box>
          <Reply>{answer.option.text}</Reply>
          <Chart
            data={calcRatio(
              new Map(Object.entries(optionsByOptionIdMap)),
              total,
              options
            )}
            id={answer.option.id}
          >
            <Chart.Summary>{`전체 타이티 중에 {value}를 차지하고 있어요.`}</Chart.Summary>
            <Chart.Pie className="m-auto my-7" size="40%" />
            <Chart.Regend />
          </Chart>
        </Box>

        <MBTIRankReport />
      </Box.Container>
    </section>
  );
};

const ActualReport = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header>
        <Header.H1>
          <Header.Back onClick={() => navigate("/answers")}>리포트</Header.Back>
        </Header.H1>
      </Header>
      <main>
        <BasicReport />
        <DetailReport />
      </main>
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
    <Layout>
      <Header>
        <Header.H1>{nicknameWithEllipsis}님의 리포트</Header.H1>
      </Header>
      <main>
        <BasicReport />
        <DetailReport />
      </main>
      <PublicFooter />
    </Layout>
  );
};

const getMyAnswerAndAnswers = async (answerId: string) => {
  const answer = await getAnswer(answerId);
  const options = await getOptions({ ids: answer.data.question.options });
  const groups = await getAnswerGroups({
    groups: [
      "user.MBTI",
      "user.region",
      "user.birthdate",
      "user.gender",
      "option.id",
    ],
    questionId: answer.data.question.id,
  });

  return {
    answer: answer.data,
    options: options.data,
    groups,
  };
};

const Report = ({ isPublic = false }: { isPublic?: boolean }) => {
  const { answerId } = useParams();

  if (!answerId) {
    // TODO: 404 페이지 만들기
    return <Navigate to={isPublic ? "/" : "/answer"} />;
  }

  const { state, data } = useAsyncAPI(getMyAnswerAndAnswers, answerId);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      return (
        <ReportContextProvider data={{ ...data, isPublic }}>
          {isPublic ? <PublicReport /> : <ActualReport />}
          <ToastContainer
            className="text-base"
            autoClose={3000}
            theme="colored"
          />
        </ReportContextProvider>
      );
  }
};

export default Report;
