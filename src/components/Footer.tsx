import cn from "classnames";

const Footer = ({
  className,
  children,
}: {
  className?: string | string[];
  children: React.ReactNode;
}) => <footer className={cn("mt-12", className)}>{children}</footer>;

export default Footer;
