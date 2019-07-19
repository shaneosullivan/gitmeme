interface Listener {
  input: HTMLElement;
  remove: Function;
}

export default function findTextInputs(
  listenToInput: (node: HTMLElement) => Listener
) {
  const ids = ["new_comment_field", "issue_body"];

  const inputsById = Array.from(
    document.querySelectorAll(ids.map(id => `#${id}`).join(","))
  ).filter(input => !!input);

  const allInputs = inputsById;

  // If the cursor is already focused in a text area, get to work!
  if (
    document.activeElement &&
    document.activeElement.tagName.toLowerCase() === "textarea" &&
    !allInputs.some(input => input === document.activeElement)
  ) {
    allInputs.push(document.activeElement);
  }

  let listeners = allInputs.map(listenToInput as any) as Array<Listener>;

  // Listen to any lazily created text areas too
  document.body.addEventListener("focusin", (evt: Event) => {
    const node = evt.target as HTMLElement;
    const tagName = node.tagName;
    if (
      tagName &&
      tagName.toLowerCase() === "textarea" &&
      !listeners.some(listener => {
        return listener.input === node;
      })
    ) {
      listeners.push(listenToInput(node));
    }
  });

  setInterval(() => {
    const newListeners = validateListeners(listeners);
    if (newListeners.length !== listeners.length) {
      listeners = newListeners;
    }
  }, 200);
}

function validateListeners(listeners: Array<Listener>): Array<Listener> {
  const newListeners = listeners.filter(listener => {
    // A Node's offsetParent is null if it or any of its
    // parent nodes are hidden.  Handy!
    if (!listener.input.offsetParent) {
      listener.remove();
      return false;
    }
    return true;
  });
  return newListeners;
}
