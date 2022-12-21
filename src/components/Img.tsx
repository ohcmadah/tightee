import { useIsElementInViewport } from "../hooks/useIsElementInViewport";

export default function Img(
  props: React.ImgHTMLAttributes<HTMLImageElement> & { lazy?: boolean }
) {
  const { lazy, ...imgProps } = props;
  const { elementRef, isVisible } = useIsElementInViewport({
    rootMargin: "0px 0px 500px 0px",
  });
  const isLoaded = !lazy || isVisible;

  return (
    <img
      {...imgProps}
      ref={elementRef}
      src={isLoaded ? props.src : "/images/fallback"}
    />
  );
}
