import Popup from "./Popup";
import Spinner from "./Spinner";

const Full = () => (
  <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-white">
    <Spinner.Big />
    <div className="mt-5 text-base text-grayscale-60">불러오고 있어요...</div>
  </div>
);

const Modal = () => (
  <Popup.Background>
    <Spinner.Big />
  </Popup.Background>
);

export default {
  Full: Full,
  Modal: Modal,
};
