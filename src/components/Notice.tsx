import cn from "classnames";
import Img from "./Img";

const Notice = ({
  iconSrc,
  alt,
  className,
  children,
}: {
  iconSrc: string;
  alt: string;
  className?: cn.Argument;
  children: React.ReactNode;
}) => (
  <section
    className={cn("text-center text-base text-grayscale-100", className)}
  >
    <Img
      lazy
      src={iconSrc}
      alt={alt}
      width={30}
      height={30}
      className="mx-auto mb-2"
    />
    {children}
  </section>
);

export default Notice;
