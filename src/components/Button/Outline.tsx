import React from "react";
import cn from "classnames";

type ButtonProps = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
};

export const OutlineButton = ({
  className,
  onClick,
  disabled,
  children,
}: ButtonProps) => (
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
