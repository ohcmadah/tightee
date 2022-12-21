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

  return (
    <img
      {...props}
      ref={elementRef}
      src={props.lazy && isVisible ? props.src : ""}
    />
  );
}
