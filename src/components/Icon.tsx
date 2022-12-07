import cn from "classnames";

const Icon = ({
  className,
  src,
  alt,
}: {
  className?: cn.Argument;
  src: string;
  alt: string;
}) => (
  <img
    width={20}
    height={20}
    className={cn("mr-1.5 inline-block", className)}
    src={src}
    alt={alt}
  />
);

export default Icon;
