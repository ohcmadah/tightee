import cn from "classnames";

export const Basic = ({
  type,
  className,
  name,
  value,
  onChange,
  placeholder,
  maxLength,
}: React.HTMLProps<HTMLInputElement>) => {
  return (
    <input
      type={type}
      className={cn(
        "rounded-md border border-grayscale-20 bg-white py-3.5 px-5 text-base font-medium placeholder:text-grayscale-20",
        className
      )}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={!onChange}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
};
