import React from "react";
import cn from "classnames";

type ButtonProps = {
  color: "primary" | "yellow";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
};

const convertColorToClassName = (color: ButtonProps["color"]): string => {
  const map = {
    primary: "bg-primary",
    yellow: "bg-system-yellow",
  };
  return map[color];
};

export const ColoredButton = ({
  color = "primary",
  className,
  onClick,
  disabled,
  children,
}: ButtonProps) => (
  <button
    className={cn(
      "rounded-md bg-system-yellow p-3.5 text-base font-bold",
      convertColorToClassName(color),
      className
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
