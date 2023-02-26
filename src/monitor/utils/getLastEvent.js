/**
 * 获取用户最后一个事件
 */
let lastEvent;
["click", "touchstart", "mousedown", "keydown", "mouseover"].forEach(
  (eventType) => {
    window.addEventListener(
      eventType,
      (event) => {
        lastEvent = event;
      },
      {
        capture: true, //捕获阶段
        passive: true, //不阻止默认行为
      }
    );
  }
);
export default function () {
  return lastEvent;
}
