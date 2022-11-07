import cn from "classnames";
import React from "react";
import { range } from "../common/utils";

import Input from "./Input";

const requiredClass = "after:content-['*'] after:ml-1 after:text-system-alert";

const Label = ({
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
);

const Error = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("h-6 text-base text-system-alert", className)}>
    {children}
  </div>
);

const BirthdateInput = ({
  values,
  onChange,
}: {
  values: { year?: string; month?: string; day?: string };
  onChange: (name: string, value: string) => any;
}) => (
  <div className="flex gap-x-3">
    <Input.Basic
      type="text"
      className="w-1/3"
      name="year"
      value={values.year}
      onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
        onChange(evt.target.name, evt.target.value)
      }
      placeholder="연"
      maxLength={4}
    />
    <Input.Select
      className="w-1/3"
      name="month"
      value={values.month}
      onChange={(evt: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(evt.target.name, evt.target.value)
      }
      placeholder="월"
    >
      {[...range(1, 12)].map((month) => (
        <option key={month} value={month < 10 ? `0${month}` : month}>
          {month}
        </option>
      ))}
    </Input.Select>
    <Input.Basic
      type="text"
      className="w-1/3"
      name="day"
      value={values.day}
      onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
        onChange(evt.target.name, evt.target.value)
      }
      placeholder="일"
      maxLength={2}
    />
  </div>
);

type SectionProps = {
  required?: boolean;
  label: string;
  error?: string;
  children: React.ReactNode;
};

const Section = ({ required, label, error, children }: SectionProps) => (
  <section className={"mb-4 flex flex-col last:mb-0"}>
    <Label required={required} className="mb-2">
      {label}
    </Label>
    {children}
    <Error className="mt-1.5">{error}</Error>
  </section>
);

export default {
  Label: Label,
  Error: Error,
  BirthdateInput: BirthdateInput,
  Section: Section,
};
