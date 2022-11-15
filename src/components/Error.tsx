import Header from "./Header";

import sadIcon from "../assets/sad.png";
import ExternalLink from "./ExternalLink";
import { URL_CS } from "../common/constants";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Default = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <>
      <Header className="text-center">무언가 문제가 발생했어요.</Header>
      <main className="text-center text-base">
        <img
          width={30}
          className="mb-2 inline-block"
          src={sadIcon}
          alt="sad pensive face"
        />
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
      </main>
      <footer className="mt-12 flex items-center justify-center gap-x-3">
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
      </footer>
    </>
  );
};

export default {
  Default: Default,
};
