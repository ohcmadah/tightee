import cn from "classnames";
import { Link, useLocation } from "react-router-dom";

import homeIcon from "../assets/home.png";
import questionIcon from "../assets/question.png";
import answerIcon from "../assets/answer.png";
import eyesIcon from "../assets/eyes.png";

const pages = [
  { path: "/", icon: homeIcon },
  { path: "/question", icon: questionIcon },
  { path: "/answer", icon: answerIcon },
  { path: "/profile", icon: eyesIcon },
];

const Nav = () => {
  const { pathname } = useLocation();

  return (
    <nav>
      <ul className="fixed bottom-0 left-0 flex h-nav w-full items-center  gap-x-5 bg-white bg-primary-peach px-12 py-2">
        {pages.map(({ path, icon }) => (
          <li key={path} className="h-full w-full">
            <Link
              to={path}
              className={cn(
                "inline-flex h-full w-full items-center justify-center rounded-lg",
                {
                  "bg-primary": path === pathname,
                }
              )}
            >
              <img width={30} src={icon} alt={path} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
