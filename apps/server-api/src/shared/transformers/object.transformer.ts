export const omitKeyInObj = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> => {
  const clone = { ...obj };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
};

export const omitKeyInArrObj = <T extends object, K extends keyof T>(arr: T[], ...keys: K[]): Omit<T, K>[] => {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.map((item) => omitKeyInObj(item, ...keys));
};
