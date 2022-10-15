import cn from "classnames";

import styles from "../styles/components/layout.module.css";

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({ className, children }: LayoutProps) => (
  <div className={cn(styles.layout, className)}>{children}</div>
);

export default Layout;
