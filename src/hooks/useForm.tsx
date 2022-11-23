import { useState } from "react";
import { FormError } from "../@types";
import { setProperty } from "../common/utils";

export type Validator<T> = (values: T) => FormError | {};

type useFormProps<T> = {
  initialValues: T;
  onSubmit: (values: T) => any;
  validator: Validator<T>;
};

const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validator,
}: useFormProps<T>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormError>({});

  const handleChange = (key: string, value: any) => {
    const newValues = setProperty(values, key, value);
    setValues(newValues);
  };

  const handleSubmit = () => {
    const errors = validator(values);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit(values);
    }
  };

  const initAll = (values: T) => {
    setValues(values);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    initAll,
  };
};

export default useForm;
