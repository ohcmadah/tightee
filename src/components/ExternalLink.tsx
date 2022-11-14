import cn from "classnames";

const ExternalLink = ({
  className,
  href,
  children,
}: {
  className?: string | string[];
  href: string;
  children: React.ReactNode;
}) => (
  <a
    className={cn("text-base text-grayscale-20", className)}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);

export default ExternalLink;
