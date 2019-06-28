export default function getParentByTagName(
  node: HTMLElement,
  tagName
): HTMLElement | null {
  let foundNode: HTMLElement = node.parentElement;
  while (foundNode && foundNode.tagName.toLowerCase() !== tagName) {
    foundNode = foundNode.parentElement;
  }
  return foundNode || null;
}
