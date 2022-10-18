import { useState } from "react";

type Errors = {
  [name: string]: string;
};

export type Validator<T> = (values: T) => Errors | {};

type useFormProps<T> = {
  initialValues: T;
  onSubmit: Function;
  validator: Validator<T>;
};

const useForm = <T,>({
  initialValues,
  onSubmit,
  validator,
}: useFormProps<T>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (key: string, value: any) => {
    setValues({ ...values, [key]: value });
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
