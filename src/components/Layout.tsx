import styles from "../../styles/layout.module.css";

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({ className, children }: LayoutProps) => (
  <div className={[styles.layout, className].join(" ")}>{children}</div>
);

export default Layout;
