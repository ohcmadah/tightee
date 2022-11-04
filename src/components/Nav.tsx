import { Link } from "react-router-dom";

const Nav = () => (
  <nav className="flex w-full items-center justify-between">
    <Link to="/">home</Link>
    <Link to="/question">question</Link>
    <Link to="/answer">answer</Link>
    <Link to="/profile">profile</Link>
  </nav>
);

export default Nav;
