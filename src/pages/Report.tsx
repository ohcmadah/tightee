import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getAnswer, getAnswers } from "../common/apis";
import useAsyncAPI from "../hooks/useAsyncAPI";
import { Answer, MBTI, Option } from "../@types";
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

import Header from "../components/Header";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Box from "../components/Box";
import Badge from "../components/Badge";
import Chart from "../components/Chart";
import Icon from "../components/Icon";

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

const RANK_ICONS = [goldIcon, silverIcon, bronzeIcon];

const genChartData = (
  answers: Answer[],
  options: Option[]
): { [optionId: string]: { title: string; ratio: number } } => {
  const total = answers.length;
  const group = groupBy(answers, (answer) => answer.option.id);

  return options.reduce((acc, option) => {
    const answers = group.get(option.id);

    const ratio = (answers?.length || 0) / total;
    return { ...acc, [option.id]: { title: option.text, ratio } };
  }, {});
};

const calcMBTIrank = (group: Map<MBTI, Answer[]>, options: Option[]) => {
  return Array.from(group)
    .filter(([mbti, _]) => mbti !== null)
    .map(([mbti, answers]) => {
      const data = genChartData(answers, options);
      const { title, ratio } = Object.values(data).sort(
        (a, b) => b.ratio - a.ratio
      )[0];
      return { mbti, option: title, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio);
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

const EmptyMBTI = () => (
  <div className="flex items-start">
    <Icon src={lightIcon} alt="tip" />
    <div>
      <div className="mb-3 leading-7 text-grayscale-80">
        MBTI 정보가 없어 분석할 수 없어요 :(
        <br />
        MBTI 설정 후 다음 날 질문부터 정보를 확인할 수 있어요!
      </div>
      <Link to="/profile" className="font-medium text-grayscale-100">
        {"MBTI 설정하기 >"}
      </Link>
    </div>
  </div>
);

const DetailReport = () => {
  const {
    answer: { user, question, option },
    groups,
  } = useReportState();

  const mbtiData = genChartData(
    groups.user.mbti.get(user.MBTI) || [],
    question.options
  );
  const regionData = genChartData(
    groups.user.region.get(user.region) || [],
    question.options
  );
  const ageGroup = calcAgeGroup(user.birthdate);
  const ageData = genChartData(
    groups.user.age.get(ageGroup) || [],
    question.options
  );
  const genderData = genChartData(
    groups.user.gender.get(user.gender) || [],
    question.options
  );

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
                <Chart.Pie className="m-auto my-7" size="33%" />
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
              <Chart.Pie className="m-auto my-7" size="33%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon={hourglassIcon}>나이별 분석</Title>
            <Reply>{option.text}</Reply>
            <Chart data={ageData} id={option.id}>
              <Chart.Summary>{`'${ageGroup}대'의 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
              <Chart.Pie className="m-auto my-7" size="33%" />
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
              <Chart.Pie className="m-auto my-7" size="33%" />
              <Chart.Regend />
            </Chart>
          </Box>
        </Box.Container>
      </section>
    </>
  );
};

const MBTIRankReport = () => {
  const { answer, groups } = useReportState();

  if (answer.user.MBTI === null) {
    return (
      <Box>
        <Title icon={rankIcon}>MBTI 순위</Title>
        <EmptyMBTI />
      </Box>
    );
  }

  const rank = calcMBTIrank(groups.user.mbti, answer.question.options);
  const myRank = rank.map((value) => value.mbti).indexOf(answer.user.MBTI) + 1;

  return (
    <Box>
      <Title icon={rankIcon}>MBTI 순위</Title>
      <Chart.Summary value={myRank + "등"}>
        {"16개 MBTI 중에서 {value}으로 대답이 일치해요."}
      </Chart.Summary>
      {rank.map(({ mbti, option, ratio }, index) => (
        <div key={mbti} className="mt-5">
          <Icon src={RANK_ICONS[index]} alt={`${index + 1}등`} />
          {mbti}{" "}
          <span className="text-grayscale-60">
            ({option}, {formatPercent(ratio)})
          </span>
        </div>
      ))}
    </Box>
  );
};

const BasicReport = () => {
  const { answer, answers } = useReportState();

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
            data={genChartData(answers || [], answer.question.options)}
            id={answer.option.id}
          >
            <Chart.Summary>{`전체 타이티 중에 {value}를 차지하고 있어요.`}</Chart.Summary>
            <Chart.Pie className="m-auto my-7" size="33%" />
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
        <Header.Back onClick={() => navigate(-1)}>리포트</Header.Back>
      </Header>
      <main>
        <BasicReport />
        <DetailReport />
      </main>
    </>
  );
};

const getMyAnswerAndAnswers = async (answerId: string) => {
  const answer = await getAnswer(answerId);
  const answers = await getAnswers({ question: answer.question.id });

  return {
    answer,
    answers: answers.data,
  };
};

const Report = () => {
  const { answerId } = useParams();

  if (!answerId) {
    return <Navigate to="/answer" />;
  }

  const { state, data } = useAsyncAPI(getMyAnswerAndAnswers, answerId);

  switch (state) {
    case "loading":
      return <Loading.Full />;

    case "error":
      return <Error.Default />;

    case "loaded":
      return (
        <ReportContextProvider data={data}>
          <ActualReport />
        </ReportContextProvider>
      );
  }
};

export default Report;
