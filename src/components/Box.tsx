import cn from "classnames";

const Container = ({ children }: { children?: React.ReactNode }) => (
  <div className="last:mb-0">{children}</div>
);

const Box = ({
  className,
  children,
}: {
  className?: cn.Argument;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "mb-8 flex w-full flex-col items-start rounded-2xl border border-grayscale-20 bg-white p-6 text-base drop-shadow-lg",
      className
    )}
  >
    {children}
  </div>
);

export default Object.assign(Box, { Container: Container });
