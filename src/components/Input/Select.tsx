import React from "react";
import cn from "classnames";

import styles from "../../styles/components/Input.module.scss";

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
