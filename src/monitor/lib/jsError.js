import getLastEvent from "../utils/getLastEvent";
import { getSelectorJs, getSelectorRes } from "../utils/getSelector";
import tracker from "../utils/tracker";

export function injectJsError() {
  // 1.捕获js错误
  window.addEventListener(
    "error",
    function (event) {
      let lastEvent = getLastEvent(); //获取用户最后一个操作
      // 脚本加载错误
      if (event.target && (event.target.src || event.target.href)) {
        console.log(2222);
        tracker.send({
          kind: "stability", //大类
          type: "error", //小类
          errorType: "resourceError", //js 或 css资源加载错误
          filename: event.target.src || event.target.href, //访问的文件名
          tagName: event.target.tagName, //行列信息
          selector: getSelectorRes(event.target), //最后一个操作的元素
        });
      } else {
        tracker.send({
          kind: "stability", //大类
          type: "error", //小类
          errorType: "JsError", //错误类型
          message: event.message, //类型详情
          filename: event.filename, //访问的文件名
          position: `${event.lineno}:${event.colno}`, //行列信息
          stack: getLines(event.error.stack), //错误堆栈
          selector: lastEvent ? getSelectorJs(lastEvent) : "", //最后一个操作的元素
        });
      }
    },
    true //捕获阶段
  );

  // 2.捕获promise错误
  window.addEventListener("unhandledrejection", (event) => {
    let lastEvent = getLastEvent(); //获取用户最后一个操作
    let message;
    let filename;
    let line = 0;
    let col = 0;
    let stack = "";
    let reason = event.reason;
    if (typeof reason === "string") {
      message = reason;
    }
    if (typeof reason === "object") {
      if (reason.stack) {
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        line = matchResult[2];
        col = matchResult[3];
        message = reason.message;
      }
      stack = getLines(reason.stack);
    }
    tracker.send({
      kind: "stability", //大类
      type: "error", //小类
      errorType: "promiseError", //错误类型
      message, //类型详情
      filename, //访问的文件名
      position: `${line}:${col}`, //行列信息
      stack, //错误堆栈
      selector: lastEvent ? getSelectorJs(lastEvent) : "", //最后一个操作的元素
    });
  });
}

function getLines(stack) {
  return stack
    .split("\n")
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, ""))
    .join("^");
}
