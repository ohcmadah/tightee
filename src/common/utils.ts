const setProperty = <T extends Record<string, any>>(
  obj: T,
  path: string,
  value: any
): T => {
  const [head, ...rest] = path.split(".");
  return {
    ...obj,
    [head]: rest.length ? setProperty(obj[head], rest.join("."), value) : value,
  };
};

export { setProperty };
