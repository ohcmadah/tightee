import cn from "classnames";

const Header = ({
  className,
  optionRenderer,
  children,
}: {
  className?: string | string[];
  optionRenderer?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <header className={cn("mb-12", className)}>
    <h1 className="text-3xl font-bold">{children}</h1>
    {optionRenderer}
  </header>
);

export default Header;
