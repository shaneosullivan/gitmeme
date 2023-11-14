export default function getArray(item: any): Array<any> {
  if (item === null || item === undefined) {
    return [];
  }
  if (!Array.isArray(item)) {
    return [item];
  }
  return item;
}
