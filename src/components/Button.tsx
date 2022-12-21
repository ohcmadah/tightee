import cn from "classnames";
import { GENDER_FEMALE, GENDER_MALE } from "../common/constants";

import Icon from "./Icon";

import maleImage from "../assets/male.png";
import femaleImage from "../assets/female.png";
import kakaoSymbol from "../assets/kakao.svg";

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
  color: "primary" | "yellow" | "violet";
}

const convertColorToClassName = (color: ColoredProps["color"]): string => {
  const map = {
    primary: "bg-primary",
    yellow: "bg-system-yellow",
    violet: "bg-secondary-question",
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
        <Icon className="mr-[20px]" src={maleImage} alt="male" />
        남자
      </Outline>
      <Outline
        className={cn(genderButtonStyle, {
          "bg-system-dimyellow": value === GENDER_FEMALE,
        })}
        onClick={() => onChange(GENDER_FEMALE)}
      >
        <Icon className="mr-[20px]" src={femaleImage} alt="female" />
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
    <img className="w-[14px]" src={kakaoSymbol} alt="Kakao" />
    카카오로 시작하기
    <div />
  </button>
);

export default {
  Basic: Basic,
  Colored: Colored,
  Outline: Outline,
  GenderToggle: GenderToggle,
  Kakao: Kakao,
};
