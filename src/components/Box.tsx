import cn from "classnames";

const Container = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex flex-col gap-y-6">{children}</div>
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
      "flex w-full flex-col items-start rounded-2xl border border-grayscale-20 bg-white p-5 text-base drop-shadow-lg",
      className
    )}
  >
    {children}
  </div>
);

export default Object.assign(Box, { Container: Container });
