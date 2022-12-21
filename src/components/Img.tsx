import cn from "classnames";
import { useIsElementInViewport } from "../hooks/useIsElementInViewport";

export type ImgProps = {
  src: string;
  alt: string;
  width: number | "100%";
  height: number | "100%";
  lazy?: boolean;
};

export default function Img(
  props: React.ImgHTMLAttributes<HTMLImageElement> & { lazy?: boolean }
) {
  const { elementRef, isVisible } = useIsElementInViewport({
    rootMargin: "0px 0px 500px 0px",
  });
  const isLoaded = !props.lazy || isVisible;
  const fallback = `bg-grayscale-20 w-[${props.width || 20}] h-[${
    props.height || 20
  }]`;

  return (
    <img
      {...props}
      className={cn(props.className, { [fallback]: !isLoaded })}
      ref={elementRef}
      src={isLoaded ? props.src : ""}
    />
  );
}
