import ModalPortal from "./ModalPortal";
import Spinner from "./Spinner";

const Full = () => (
  <div className="flex h-[100vh] w-full items-center justify-center">
    <Spinner.Big />
  </div>
);

const Modal = () => (
  <ModalPortal>
    <div className="t-0 l-0 b-0 r-0 fixed flex h-full w-full items-center justify-center bg-grayscale-100/60">
      <Spinner.Big />
    </div>
  </ModalPortal>
);

export default {
  Full: Full,
  Modal: Modal,
};
