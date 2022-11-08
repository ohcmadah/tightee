const Background = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed top-0 left-0 bottom-0 right-0 z-popup flex h-full w-full items-center justify-center bg-grayscale-100/60">
    {children}
  </div>
);

export default {
  Background: Background,
};
