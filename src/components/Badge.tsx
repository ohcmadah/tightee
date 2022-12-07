import cn from "classnames";

const Badge = ({
  className,
  children,
}: {
  className?: cn.Argument;
  children?: React.ReactNode;
}) => (
  <div
    className={cn("inline-block rounded-full py-1.5 px-5 text-base", className)}
  >
    {children}
  </div>
);

export default Badge;
