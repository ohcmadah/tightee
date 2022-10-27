import cn from "classnames";

const Header = ({
  className,
  children,
}: {
  className?: string | string[];
  children: React.ReactNode;
}) => (
  <header className={cn("mb-12", className)}>
    <h1 className="text-3xl font-bold">{children}</h1>
  </header>
);

export default Header;
