import cn from "classnames";
import { Link, useMatch } from "react-router-dom";

import Img from "./Img";

import styles from "../styles/components/Nav.module.scss";

const pages = [
  { path: "/", icon: "/images/home.svg", label: "HOME" },
  { path: "/answer", icon: "/images/pencil.svg", label: "ANSWERS" },
  { path: "/profile", icon: "/images/profile.svg", label: "PROFILE" },
];

const Menu = ({ path, icon, label }: typeof pages[0]) => {
  const isQuestionPage = location.pathname.startsWith("/questions");
  const isMatched = isQuestionPage ? path === "/answer" : useMatch(path + "/*");
  return (
    <li
      key={path}
      className={cn("h-full", styles.menu, isMatched ? "w-52 py-3" : "w-32")}
    >
      <Link
        to={path}
        className={cn("inline-flex h-full w-full items-center justify-center", {
          "rounded-[30px] bg-primary": isMatched,
        })}
      >
        <div className="h-[25px] w-[25px]">
          <Img className="m-auto" src={icon} alt={path} />
        </div>
        <span
          className={cn(styles.label, "ml-3 text-lg font-bold text-white", {
            hidden: !isMatched,
          })}
        >
          {label}
        </span>
      </Link>
    </li>
  );
};

const Nav = () => (
  <nav>
    <div className="h-nav" />
    <ul
      className={cn(
        styles.container,
        "fixed bottom-0 left-0 z-nav flex h-nav w-full items-center justify-center bg-primary-peach px-8"
      )}
    >
      {pages.map(({ path, icon, label }) => (
        <Menu key={path} path={path} icon={icon} label={label} />
      ))}
    </ul>
  </nav>
);

export default Nav;
