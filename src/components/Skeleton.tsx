import ContentLoader from "react-content-loader";
import Box from "./Box";

const Container = ({
  viewBox,
  children,
}: {
  viewBox: string;
  children: React.ReactNode;
}) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox={viewBox}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {children}
  </ContentLoader>
);

const BoxLoader = () => (
  <Box>
    <Container viewBox="0 0 340 66">
      <rect x="0" y="0" rx="18" ry="18" width="100" height="30" />
      <rect x="0" y="52" rx="6" ry="6" width="160" height="14" />
    </Container>
  </Box>
);

export default {
  Container: Container,
  BoxLoader: BoxLoader,
};
