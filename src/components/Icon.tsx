import cn from "classnames";
import Img from "./Img";

const Icon = ({
  className,
  src,
  alt,
}: {
  className?: cn.Argument;
  src: string;
  alt: string;
}) => (
  <Img
    lazy
    width={20}
    height={20}
    className={cn("mr-1.5 inline-block", className)}
    src={src}
    alt={alt}
  />
);

export default Icon;
