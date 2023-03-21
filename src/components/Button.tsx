import cn from "classnames";
import {
  GENDER_FEMALE,
  GENDER_MALE,
  URL_QUESTION_GOOGLE_FORM,
} from "../common/constants";

import Icon from "./Icon";
import Img from "./Img";
import Footer from "./Footer";

import styles from "../styles/components/Button.module.scss";

interface ButtonProps {
  className?: string | string[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
}

const Basic = ({ className, onClick, disabled, children }: ButtonProps) => (
  <button
    className={cn(
      "rounded-md border border-grayscale-20 bg-white p-3.5 text-base drop-shadow-md disabled:bg-grayscale-10 disabled:text-grayscale-60",
      className
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export interface ColoredProps extends ButtonProps {
  color: "primary" | "yellow" | "violet" | "blue";
}

const convertColorToClassName = (color: ColoredProps["color"]): string => {
  const map = {
    primary: "bg-primary",
    yellow: "bg-system-yellow",
    violet: "bg-secondary-question",
    blue: "bg-secondary-mbti",
  };
  return map[color];
};

const Colored = ({
  color = "primary",
  className,
  onClick,
  disabled,
  children,
}: ColoredProps) => (
  <button
    className={cn(
      "rounded-md p-3.5 text-base font-bold disabled:bg-grayscale-10 disabled:text-grayscale-60",
      convertColorToClassName(color),
      className
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Outline = ({ className, onClick, disabled, children }: ButtonProps) => (
  <button
    className={cn(
      "rounded-md border border-grayscale-20 bg-white p-3.5 text-base font-bold text-grayscale-20",
      className
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const genderButtonStyle =
  "flex w-1/2 items-center justify-center text-grayscale-100";

const GenderToggle = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (gender: string) => any;
}) => {
  return (
    <div className="flex gap-x-3">
      <Outline
        className={cn(genderButtonStyle, {
          "bg-system-dimyellow": value === GENDER_MALE,
        })}
        onClick={() => onChange(GENDER_MALE)}
      >
        <Icon className="mr-[20px]" src="/images/male.png" alt="male" />
        남자
      </Outline>
      <Outline
        className={cn(genderButtonStyle, {
          "bg-system-dimyellow": value === GENDER_FEMALE,
        })}
        onClick={() => onChange(GENDER_FEMALE)}
      >
        <Icon className="mr-[20px]" src="/images/female.png" alt="female" />
        여자
      </Outline>
    </div>
  );
};

const Kakao = ({
  className,
  onClick,
}: {
  className?: cn.Argument;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-md bg-kakao-container px-4 text-base font-medium text-grayscale-100/[.85]",
      className,
      styles.kakaoButton
    )}
    onClick={onClick}
  >
    <Img lazy width={14} src="/images/kakao.svg" alt="Kakao" />
    카카오로 시작하기
    <div />
  </button>
);

const GoogleForm = () => {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Footer.Floating
      className="bottom-nav mt-4"
      color="blue"
      onClick={() => openInNewTab(URL_QUESTION_GOOGLE_FORM)}
    >
      <div className="text-left">
        <div className="text-base">질문을 접수하면 타이티에 올려드려요!</div>
        <div className="text-sm font-normal">구글 폼으로 이동하기</div>
      </div>
      <Img
        width={20}
        src="/images/external.svg"
        alt="google form"
        className="ml-auto inline-block"
      />
    </Footer.Floating>
  );
};

export default {
  Basic: Basic,
  Colored: Colored,
  Outline: Outline,
  GenderToggle: GenderToggle,
  Kakao: Kakao,
  GoogleForm: GoogleForm,
};
