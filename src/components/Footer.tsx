import cn from "classnames";

type FooterProps = {
  className?: string | string[];
  children?: React.ReactNode;
};

export const Footer = ({ className, children }: FooterProps) => (
  <footer className={cn("mt-10", className)}>{children}</footer>
);
