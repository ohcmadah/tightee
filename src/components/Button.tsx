import cn from "classnames";
import maleImage from "../assets/male.png";
import femaleImage from "../assets/female.png";
import { GENDER_FEMALE, GENDER_MALE } from "../common/constants";

interface ButtonProps {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
}

interface ColoredProps extends ButtonProps {
  color: "primary" | "yellow";
}

const convertColorToClassName = (color: ColoredProps["color"]): string => {
  const map = {
    primary: "bg-primary",
    yellow: "bg-system-yellow",
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
      "rounded-md border border-grayscale-20 p-3.5 text-base font-bold text-grayscale-20",
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
        <img className="mr-4 w-6" src={maleImage} alt="male" />
        남자
      </Outline>
      <Outline
        className={cn(genderButtonStyle, {
          "bg-system-dimyellow": value === GENDER_FEMALE,
        })}
        onClick={() => onChange(GENDER_FEMALE)}
      >
        <img className="mr-4 w-6" src={femaleImage} alt="female" />
        여자
      </Outline>
    </div>
  );
};

export default {
  Colored: Colored,
  Outline: Outline,
  GenderToggle: GenderToggle,
};
