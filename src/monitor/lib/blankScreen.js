/**
 * @description: 空白屏监控
 */

import onload from "../utils/onload";
import tracker from "../utils/tracker";

export function blankScreen() {
  let wrapperElements = ["html", "body", "#container", ".content"]; // 用于判断是否是空白屏的元素
  let emptyPoints = 0; // 用于记录空白屏的次数

  function getSelector(element) {
    if (element.id) {
      return "#" + element.id;
    } else if (element.className) {
      return "." + element.className.split(" ").filter(Boolean).join(".");
    } else {
      return element.nodeName.toLowerCase();
    }
  }

  function isWrapper(elements) {
    let selector = getSelector(elements);
    if (wrapperElements.includes(selector)) {
      emptyPoints++;
    }
  }
  onload(() => {
    for (let i = 1; i <= 9; i++) {
      let xElement = document.elementsFromPoint(
        // 从文档的给定坐标（x，y）返回一个数组，该数组包含从最内层到最外层的所有元素，这些元素的边界包含了给定的坐标。
        (window.innerWidth * i) / 10,
        window.innerHeight / 2
      );
      let yElement = document.elementsFromPoint(
        window.innerWidth / 2,
        (window.innerHeight * i) / 10
      );
      isWrapper(xElement[0]);
      isWrapper(yElement[0]);
    }
    if (emptyPoints >= 18) {
      // 16是一个经验值，可以根据实际情况调整 16/18/20
      let centerElements = document.elementsFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
      tracker.send({
        kind: "stability",
        type: "blankScreen",
        emptyPoints,
        screen: window.screen.width + "*" + window.screen.height, // 屏幕分辨率
        viewPoint: window.innerWidth + "*" + window.innerHeight, // 可视区域
        selector: getSelector(centerElements[0]),
        url: window.location.href,
      });
    }
  });
}
