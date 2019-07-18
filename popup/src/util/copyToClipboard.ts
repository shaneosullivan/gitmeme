// @flow

export default function copyToClipboard(text: string): boolean {
  const docElem = document.documentElement;
  if (!docElem || !document.body) {
    return false;
  }
  const isRTL = docElem.getAttribute("dir") === "rtl";
  const textarea = document.createElement("textarea");
  function s(prop: string, value: string) {
    textarea.style.setProperty(prop, value);
  }
  s("fontSize", "12pt");
  // Reset box model
  s("border", "0");
  s("padding", "0");
  s("margin", "0");
  s("position", "absolute");
  s(isRTL ? "right" : "left", "-9999px");

  let yPosition = window.pageYOffset || docElem.scrollTop;
  s("top", `${yPosition}px`);

  textarea.setAttribute("readonly", "");
  textarea.value = text;
  if (!document.body) {
    return false;
  }
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.selectionStart = 0;
  textarea.selectionEnd = text.length;

  let succeeded = false;

  try {
    succeeded = document.execCommand("copy");
  } catch (err) {
    succeeded = false;
  }
  if (textarea.parentNode) {
    textarea.parentNode.removeChild(textarea);
  }
  return succeeded;
}
