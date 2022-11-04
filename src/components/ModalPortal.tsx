import { useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";

const CONTAINER_ID = "modal";

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const container = useRef<HTMLDivElement | null>(null);

  const init = () => {
    const { body } = document;
    const modal = document.createElement("div");
    modal.setAttribute("id", CONTAINER_ID);
    body.appendChild(modal);
    container.current = modal;
    return modal;
  };

  useLayoutEffect(() => {
    if (!container.current) {
      init();
    }
  }, []);

  return (
    container.current && ReactDOM.createPortal(children, container.current)
  );
};

export default ModalPortal;
