const Header = ({ children }: { children: React.ReactNode }) => (
  <header className="mb-12">
    <h1 className="text-3xl font-bold">{children}</h1>
  </header>
);

export default Header;
