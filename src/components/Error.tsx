import Header from "./Header";

import sadIcon from "../assets/sad.png";
import ExternalLink from "./ExternalLink";
import { URL_CS } from "../common/constants";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import React, { MouseEventHandler } from "react";

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
    <Header className="text-center">{title}</Header>
    <main className="text-center text-base">
      <img
        width={30}
        className="mb-2 inline-block"
        src={sadIcon}
        alt="sad pensive face"
      />
      {children}
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
          주소가 잘못되었거나 페이지에 문제가 있어 들어갈 수 없어요 :(
          <br />
          혹시 서비스 이용에 어려움을 겪고 있다면&nbsp;
          <ExternalLink className="text-primary" href={URL_CS}>
            고객센터
          </ExternalLink>
          로 문의해주세요!
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
    <Base title="답을 보내는 데 실패했어요." footer={DefaultFooter}>
      <article>
        시간이 지나 질문이 마감되었어요 :(
        <br />
        새로 추가한 오늘의 질문에 대답하러 가볼까요?
      </article>
    </Base>
  );
};

export default {
  Default: Default,
  ExpiredQuestion: ExpiredQuestion,
};
