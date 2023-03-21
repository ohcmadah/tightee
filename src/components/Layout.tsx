import cn from "classnames";

import styles from "../styles/components/Layout.module.scss";

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
}

const Layout = ({ className, children }: LayoutProps) => (
  <main className={cn(styles.layout, "py-24 px-8", className)}>{children}</main>
);

export default Layout;
