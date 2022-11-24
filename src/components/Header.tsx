import cn from "classnames";

import React from "react";

const Title = ({
  iconSrc,
  alt,
  children,
}: {
  iconSrc: string;
  alt?: string;
  children?: React.ReactNode;
}) => (
  <>
    <img width={40} className="mr-4 inline-block" src={iconSrc} alt={alt} />
    <span className="align-middle">{children}</span>
  </>
);

const Header = ({
  className,
  optionRenderer,
  children,
}: {
  className?: string | string[];
  optionRenderer?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <header className={cn("mb-12", className)}>
    <h1 className="text-3xl font-bold">{children}</h1>
    {optionRenderer}
  </header>
);

export default Object.assign(Header, { Title: Title });
