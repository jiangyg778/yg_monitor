export default function getSelector(event) {
  const path = [];
  let node = event.target;

  while (node != document) {
    path.push(node);
    node = node.parentNode;
  }

  path.push(document, window);

  return path
    .reverse()
    .filter((element) => element !== document && element !== window)
    .map((element) => {
      const selector = element.nodeName.toLowerCase();
      if (element.id) {
        return `${selector}#${element.id}`;
      }
      if (element.className) {
        return `${selector}.${element.className}`;
      }
      return selector;
    })
    .join(" ");
}
