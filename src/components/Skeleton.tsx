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

const Text = ({
  x,
  y,
  width,
  size = 14,
}: {
  x?: string | number;
  y: string | number;
  width?: number | string;
  size?: number;
}) => (
  <rect
    x={x || 0}
    y={y}
    rx={(size - 14) / 2 + 6}
    ry={(size - 14) / 2 + 6}
    width={width || "160"}
    height={size}
  />
);

const Badge = ({
  x,
  width = "100",
}: {
  x?: number | string;
  width?: number | string;
}) => <rect x={x || "0"} y="0" rx="18" ry="18" width={width} height="30" />;

const BoxLoader = () => (
  <Box>
    <Container viewBox="0 0 340 66">
      <Badge />
      <Text y={52} />
    </Container>
  </Box>
);

export default {
  Container: Container,
  Text: Text,
  Badge: Badge,
  BoxLoader: BoxLoader,
};
