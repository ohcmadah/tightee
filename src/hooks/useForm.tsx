import { useEffect, useState } from "react";

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

  const initAll = (values: T) => {
    setValues(values);
  };

  useEffect(() => {
    setErrors(validator(values));
  }, [values]);

  return {
    values,
    errors,
    handleChange,
    initAll,
  };
};

export default useForm;
