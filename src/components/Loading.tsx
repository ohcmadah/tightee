import Popup from "./Popup";
import Spinner from "./Spinner";

const Full = () => (
  <div className="flex h-[100vh] w-full items-center justify-center">
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
