import cn from "classnames";

const requiredClass = "after:content-['*'] after:ml-1 after:text-system-alert";

export default {
  Label: ({
    required,
    className,
    children,
  }: {
    required?: boolean;
    className?: string;
    children: React.ReactNode;
  }) => (
    <label
      className={cn(
        "text-lg font-bold",
        { [requiredClass]: required },
        className
      )}
    >
      {children}
    </label>
  ),

  Error: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div className={cn("h-6 text-base text-system-alert", className)}>
      {children}
    </div>
  ),
};