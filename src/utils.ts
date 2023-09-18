export const omit = <T extends object, K extends keyof T>(
  obj: T,
  props: K[],
  extraProps?: K[],
): Pick<T, Exclude<keyof T, K>> => {
  const result = {...obj};
  const finalProps = extraProps ? props.concat(extraProps) : props;
  finalProps.forEach(prop => {
    delete result[prop];
  });
  return result;
};
