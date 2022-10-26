import cn from "classnames";
import styles from "../styles/components/Input.module.scss";

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

type CheckboxProps = {
  className?: string;
  checked: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  name?: string;
  children?: string | React.ReactNode;
};

export const Checkbox = ({
  onChange,
  disabled,
  checked,
  className,
  name,
  children,
}: CheckboxProps) => (
  <label
    className={cn(
      "inline-flex select-none items-center text-base",
      styles.container,
      {
        "cursor-pointer": onChange && !disabled,
        [styles.checked]: checked,
      },
      className
    )}
  >
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      readOnly={!onChange}
      disabled={disabled}
      className="hidden"
    />
    {children}
  </label>
);

export const Select = ({
  className,
  name,
  value = "",
  onChange,
  placeholder,
  children,
}: React.HTMLProps<HTMLSelectElement>) => (
  <select
    className={cn(
      "appearance-none rounded-md border border-grayscale-20 bg-white py-3.5 px-5 text-base font-medium",
      { "text-grayscale-20": placeholder && value === "" },
      styles.select,
      className
    )}
    name={name}
    value={value}
    onChange={onChange}
  >
    {placeholder && (
      <option value="" hidden>
        {placeholder}
      </option>
    )}
    {children}
  </select>
);

export default {
  Basic: Basic,
  Checkbox: Checkbox,
  Select: Select,
};
