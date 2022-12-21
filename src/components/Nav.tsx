import cn from "classnames";
import { Link, useMatch } from "react-router-dom";
import Img from "./Img";

const pages = [
  { path: "/", icon: "/images/home.png" },
  { path: "/question", icon: "/images/question.png" },
  { path: "/answer", icon: "/images/answer.png" },
  { path: "/profile", icon: "/images/eyes.png" },
];

const Menu = ({ path, icon }: { path: string; icon: string }) => {
  const isMatched = useMatch(path + "/*");
  return (
    <li key={path} className="h-full w-full">
      <Link
        to={path}
        className={cn(
          "inline-flex h-full w-full items-center justify-center rounded-lg",
          { "bg-primary": isMatched }
        )}
      >
        <Img lazy width={30} src={icon} alt={path} />
      </Link>
    </li>
  );
};

const Nav = () => (
  <nav>
    <div className="h-nav" />
    <ul className="fixed bottom-0 left-0 z-nav flex h-nav w-full items-center gap-x-5 bg-white bg-primary-peach px-8 py-2">
      {pages.map(({ path, icon }) => (
        <Menu key={path} path={path} icon={icon} />
      ))}
    </ul>
  </nav>
);

export default Nav;
