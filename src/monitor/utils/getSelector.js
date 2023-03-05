// function getSelector(path) {
//   return path
//     .reverse()
//     .filter((element) => {
//       return element !== document && element !== window;
//     })
//     .map((element) => {
//       let selector = "";
//       console.log(element, 222);
//       if (element.id) {
//         return `#${element.nodeName.toLowerCase()}#${element.id}`;
//       } else if (element.className && typeof element.className === "string") {
//         return `.${element.nodeName.toLowerCase()}.${element.className}`;
//       } else {
//         selector = element.nodeName.toLowerCase();
//       }
//       return selector;
//     })
//     .join(" ");
// }

export function getSelectorJs(event) {
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

export function getSelectorRes(pathOrTarget) {
  let path = [];
  while (pathOrTarget) {
    path.push(pathOrTarget);
    pathOrTarget = pathOrTarget.parentNode;
  }
  return path
    .reverse()
    .filter((element) => {
      return element !== document && element !== window;
    })
    .map((element) => {
      let selector = "";
      if (element.id) {
        return `#${element.nodeName.toLowerCase()}#${element.id}`;
      } else if (element.className && typeof element.className === "string") {
        return `.${element.nodeName.toLowerCase()}.${element.className}`;
      } else {
        selector = element.nodeName.toLowerCase();
      }
      return selector;
    })
    .join(" ");
}
