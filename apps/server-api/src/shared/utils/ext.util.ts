export function removeEmptyFields<T extends Record<string, any>>(obj: T): { [p: string]: any } {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null && value !== undefined && value !== '')
  );
}
