import cn from "classnames";

type InputProps = {
  type: string;
  className?: string;
  name?: string;
  value: string;
  onChange?: React.ChangeEventHandler;
  placeholder?: string;
};

export const BasicInput = ({
  type,
  className,
  name,
  value,
  onChange,
  placeholder,
}: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        "rounded-md border border-grayscale-20 bg-white py-3.5 px-5 text-base font-medium",
        className
      )}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={!onChange}
      placeholder={placeholder}
    />
  );
};
