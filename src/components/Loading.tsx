import Popup from "./Popup";
import Spinner from "./Spinner";

const Full = () => (
  <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white">
    <Spinner.Big />
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
