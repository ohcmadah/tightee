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
      value={value || ""}
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

const Switch = () => {
  return (
    <label className={cn(styles.switch, "relative inline-block")}>
      <input type="checkbox" className="h-0 w-0 opacity-0" />
      <span
        className={cn(
          styles.slider,
          "absolute top-0 left-0 right-0 bottom-0 cursor-pointer rounded-[34px] bg-grayscale-20 duration-300"
        )}
      ></span>
    </label>
  );
};

export default {
  Basic: Basic,
  Checkbox: Checkbox,
  Select: Select,
  Switch: Switch,
};
