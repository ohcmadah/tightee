import { useLayoutEffect } from "react";

const useBackground = (src: string) => {
  useLayoutEffect(() => {
    document.body.style.backgroundImage = `url(${src})`;
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    }
  }, []);
};

export default useBackground;
