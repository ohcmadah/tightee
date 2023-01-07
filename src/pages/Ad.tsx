import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { formatPercent, getFormattedDate, getLocalTime } from "../common/utils";
import { useAuthState } from "../contexts/AuthContext";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Box from "../components/Box";
import Badge from "../components/Badge";
import Chart from "../components/Chart";
import Icon from "../components/Icon";
import Button from "../components/Button";
import Notice from "../components/Notice";

const RANK_ICONS = [
  "/images/gold.png",
  "/images/silver.png",
  "/images/bronze.png",
];

const OPTION1 = "당연하지 👌";
const OPTION2 = "계획..? 그게 뭐야? 😒";
const MY_MBTI = "ENTJ";
const SELECTED_OPTION_ID = "a";

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
  const authState = useAuthState();
  const onStart = () => {
    const isAuthentication =
      authState.state === "loaded" && authState.isAuthentication;
    if (isAuthentication) {
      return navigate("/questions");
    }
    return navigate("/welcome");
  };
  return (
    <footer className="sticky bottom-0 z-nav w-full pb-[20px] pt-6">
      <Button.Colored
        color="primary"
        className="flex w-full items-center py-4 text-white"
        onClick={onStart}
      >
        <Icon src="/images/star_eyes.png" alt="star eyes" className="mr-3" />
        질문에 대답하고 나만의 리포트 보러가기
        <RightArrowIcon />
      </Button.Colored>
    </footer>
  );
};

const Reply = ({ children }: { children?: React.ReactNode }) => (
  <div className="mb-5 flex items-center text-primary">
    <Icon src="/images/reply.svg" alt="reply" />
    {children}
  </div>
);

const Title = ({ icon, children }: { icon: string; children: string }) => (
  <Badge className="m-auto mb-5 flex items-center bg-system-yellow text-base font-normal">
    <Icon src={icon} alt={children} />
    {children}
  </Badge>
);

const genChartData = (ratioList: number[]) => {
  const options = [
    { id: "a", text: OPTION1 },
    { id: "b", text: OPTION2 },
  ];
  return options.reduce(
    (acc, { id, text }, index) => ({
      ...acc,
      [id]: { title: text, ratio: ratioList[index] },
    }),
    {}
  );
};

const DetailReport = () => {
  return (
    <>
      <h2 className="mt-10 mb-7 select-none text-2xl font-bold">상세 리포트</h2>
      <section>
        <Box.Container>
          <Box>
            <Title icon="/images/genie.png">MBTI별 분석</Title>
            <Reply>{MY_MBTI}</Reply>
            <Chart
              data={genChartData([0.6787, 0.3213])}
              id={SELECTED_OPTION_ID}
            >
              <Chart.Summary>{`'${MY_MBTI}' 유형의 타이티 중에 {value}가 같은 응답을 했어요.`}</Chart.Summary>
              <Chart.Pie className="m-auto my-7" size="40%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon="/images/location.png">지역별 분석</Title>
            <Reply>{OPTION1}</Reply>
            <Chart
              data={genChartData([0.7238, 0.2762])}
              id={SELECTED_OPTION_ID}
            >
              <Chart.Summary>
                {
                  "'서울특별시'에 사는 타이티 중에 {value}가 같은 응답을 했어요."
                }
              </Chart.Summary>
              <Chart.Pie className="m-auto my-7" size="40%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon="/images/hourglass.png">나이별 분석</Title>
            <Reply>{OPTION1}</Reply>
            <Chart
              data={genChartData([0.6377, 0.3623])}
              id={SELECTED_OPTION_ID}
            >
              <Chart.Summary>
                {"'20대'의 타이티 중에 {value}가 같은 응답을 했어요."}
              </Chart.Summary>
              <Chart.Pie className="m-auto my-7" size="40%" />
              <Chart.Regend />
            </Chart>
          </Box>

          <Box>
            <Title icon="/images/heart.png">성별 분석</Title>
            <Reply>{OPTION1}</Reply>
            <Chart
              data={genChartData([0.7836, 0.2164])}
              id={SELECTED_OPTION_ID}
            >
              <Chart.Summary>
                {"성별이 '여성'인 타이티 중에 {value}가 같은 응답을 했어요."}
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
  const rank = [
    { mbti: "ESTJ", option: OPTION1, ratio: 0.7446 },
    { mbti: "ENTJ", option: OPTION1, ratio: 0.6787 },
    { mbti: "ISFP", option: OPTION2, ratio: 0.6557 },
  ];
  const myRank = rank.map((value) => value.mbti).indexOf(MY_MBTI) + 1;

  return (
    <Box>
      <Title icon="/images/rank.png">MBTI 단합 랭킹</Title>
      <Chart.Summary value={myRank + "등"}>
        {"16개 MBTI 중에서 {value}으로 대답이 일치해요."}
      </Chart.Summary>
      <div className="mt-5 last:mb-0">
        {rank.slice(0, 3).map(({ mbti, option, ratio }, index) => (
          <div
            key={mbti}
            className={cn("mb-3", { "font-bold": mbti === MY_MBTI })}
          >
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

const BasicReport = () => (
  <section>
    <Box.Container>
      <Box>
        <Badge className="bg-question-not-today">
          {getFormattedDate(getLocalTime())}
        </Badge>
        <div className="mt-3">
          곧 있으면 크리스마스🎄 나는 크리스마스에 무엇을 할지 이미 다
          생각해놨다.
        </div>
      </Box>

      <Box>
        <Reply>{OPTION1}</Reply>
        <Chart data={genChartData([0.3467, 0.6533])} id={SELECTED_OPTION_ID}>
          <Chart.Summary>{`전체 타이티 중에 {value}를 차지하고 있어요.`}</Chart.Summary>
          <Chart.Pie className="m-auto my-7" size="40%" />
          <Chart.Regend />
        </Chart>
      </Box>

      <MBTIRankReport />
    </Box.Container>
  </section>
);

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

const Report = () => {
  return (
    <Layout>
      <Header>
        <Header.H1>유정💜님의 리포트</Header.H1>
      </Header>
      <Main />
      <PublicFooter />
    </Layout>
  );
};

export default Report;
