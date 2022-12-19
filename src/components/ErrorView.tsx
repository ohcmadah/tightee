import { useNavigate } from "react-router-dom";
import { URL_CS } from "../common/constants";

import Header from "./Header";
import Button from "./Button";
import Footer from "./Footer";
import ExternalLink from "./ExternalLink";

import sadIcon from "../assets/sad.png";
import Notice from "./Notice";

const Base = ({
  title,
  footer,
  children,
}: {
  title: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) => (
  <>
    <Header>
      <Header.H1 className="text-center">{title}</Header.H1>
    </Header>
    <main>
      <Notice iconSrc={sadIcon} alt="sad pensive face" className="text-base">
        {children}
      </Notice>
    </main>
    <Footer className="flex items-center justify-center gap-x-3">
      {footer}
    </Footer>
  </>
);

const Default = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();

  const DefaultFooter = (
    <>
      <Button.Colored
        color="yellow"
        className="w-full"
        onClick={() => navigate("/")}
      >
        홈으로
      </Button.Colored>
      <Button.Outline className="w-full" onClick={() => navigate(-1)}>
        이전으로
      </Button.Outline>
    </>
  );

  return (
    <Base title="무언가 문제가 발생했어요." footer={DefaultFooter}>
      {children || (
        <article>
          주소가 잘못되었거나 문제가 있어 들어갈 수 없어요 :(
          <br />
          서비스 이용에 어려움이 있다면&nbsp;
          <ExternalLink className="text-primary" href={URL_CS}>
            고객센터
          </ExternalLink>
          로 문의해 주세요!
        </article>
      )}
    </Base>
  );
};

const ExpiredQuestion = ({
  onReload,
}: {
  onReload: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const navigate = useNavigate();

  const DefaultFooter = (
    <>
      <Button.Colored color="yellow" className="w-full" onClick={onReload}>
        네!
      </Button.Colored>
      <Button.Outline className="w-full" onClick={() => navigate("/")}>
        홈으로 갈래요
      </Button.Outline>
    </>
  );

  return (
    <Base title="답을 보낼 수 없어요 :(" footer={DefaultFooter}>
      <article>
        시간이 지나 질문이 마감되었어요.
        <br />
        새로 추가된 오늘의 질문에 대답하러 가볼까요?
      </article>
    </Base>
  );
};

export default {
  Default: Default,
  ExpiredQuestion: ExpiredQuestion,
};
