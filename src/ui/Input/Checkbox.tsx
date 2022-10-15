import cn from "classnames";
import styles from "../../styles/ui/input/checkbox.module.css";

type CheckboxProps = {
  className?: string;
  checked: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  children?: string | React.ReactNode;
};

export const Checkbox = ({
  className,
  checked,
  onChange,
  disabled,
  children,
}: CheckboxProps) => (
  <label
    className={cn(
      "inline-flex select-none items-center",
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
      checked={checked}
      onChange={onChange}
      readOnly={!onChange}
      disabled={disabled}
      className="hidden"
    />
    {children}
  </label>
);
