import Header from "../components/Header";
import SEOHelmet from "../components/SEOHelmet";

const PublicReport = () => {
  return (
    <>
      <SEOHelmet
        title="💌 00님으로부터 타이티 리포트가 도착했어요."
        description="지금 바로 확인하고 나만의 리포트를 만들어 보세요!"
        imgSrc="/ogimg.png"
        path={location.pathname}
      />
      <Header>
        <Header.H1>00님의 리포트</Header.H1>
      </Header>
    </>
  );
};

export default PublicReport;
