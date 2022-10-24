import cn from "classnames";
import styles from "../../styles/components/Input.module.scss";

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
