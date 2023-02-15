import ContentLoader from "react-content-loader";
import Box from "./Box";
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

const BoxLoader = () => (
  <Box>
    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      viewBox="0 0 340 66"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="18" ry="18" width="100" height="30" />
      <rect x="0" y="52" rx="6" ry="6" width="160" height="14" />
    </ContentLoader>
  </Box>
);

export default {
  Full: Full,
  Modal: Modal,
  BoxLoader: BoxLoader,
};
