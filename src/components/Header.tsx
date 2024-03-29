import cn from "classnames";
import React, { MouseEventHandler } from "react";
import Img from "./Img";

const Icon = ({
  iconSrc,
  alt,
  children,
}: {
  iconSrc: string;
  alt?: string;
  children?: React.ReactNode;
}) => (
  <>
    <Img
      lazy
      width={40}
      className="mr-4 inline-block"
      src={iconSrc}
      alt={alt}
    />
    <span className="align-middle">{children}</span>
  </>
);

const Back = ({
  onClick,
  children,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <>
    <button className="mr-4" onClick={onClick}>
      <Img
        lazy
        width={40}
        className="inline-block"
        src="/images/left_arrow.svg"
        alt="back"
      />
    </button>
    <span className="align-middle">{children}</span>
  </>
);

const H2 = ({
  className,
  children,
}: {
  className?: cn.Argument;
  children: React.ReactNode;
}) => (
  <h2 className={cn("select-none text-2xl font-bold", className)}>
    {children}
  </h2>
);

const H1 = ({
  className,
  children,
}: {
  className?: cn.Argument;
  children: React.ReactNode;
}) => (
  <h1 className={cn("select-none text-3xl font-bold", className)}>
    {children}
  </h1>
);

const Header = ({
  className,
  children,
}: {
  className?: string | string[];
  children: React.ReactNode;
}) => <header className={cn("mb-12", className)}>{children}</header>;

export default Object.assign(Header, {
  H1: H1,
  H2: H2,
  Icon: Icon,
  Back: Back,
});
