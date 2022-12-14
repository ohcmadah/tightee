import cn from "classnames";

const Container = ({
  className,
  children,
}: {
  className?: cn.Argument;
  children?: React.ReactNode;
}) => (
  <section className={cn("flex w-full flex-col gap-y-6", className)}>
    {children}
  </section>
);

const Box = ({
  className,
  children,
}: {
  className?: cn.Argument;
  children?: React.ReactNode;
}) => (
  <article
    className={cn(
      "flex w-full flex-col items-start rounded-2xl border border-grayscale-20 bg-white p-5 text-base drop-shadow-lg",
      className
    )}
  >
    {children}
  </article>
);

export default Object.assign(Box, { Container: Container });
