import cn from "classnames";
import Button from "../components/Button";
import type { ColoredProps } from "../components/Button";

const Footer = ({
  className,
  children,
}: {
  className?: string | string[];
  children: React.ReactNode;
}) => <footer className={cn("mt-12", className)}>{children}</footer>;

const Floating = ({
  className,
  color,
  onClick,
  children,
}: {
  className: cn.Argument;
  color: ColoredProps["color"];
  onClick: ColoredProps["onClick"];
  children: React.ReactNode;
}) => (
  <footer className={cn("sticky z-nav w-full pb-[20px] pt-6", className)}>
    <Button.Colored
      color={color}
      className="flex w-full items-center py-4 text-white"
      onClick={onClick}
    >
      {children}
    </Button.Colored>
  </footer>
);

export default Object.assign(Footer, { Floating: Floating });
