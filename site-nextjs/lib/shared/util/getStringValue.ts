export function getStringValue(
  str: string | Array<string> | undefined
): string {
  return Array.isArray(str) ? str[0] : str || "";
}
