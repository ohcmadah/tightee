import React from "react";
import cn from "classnames";

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
      "rounded-md p-3.5 text-base font-bold",
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

export default {
  Colored: Colored,
  Outline: Outline,
};
