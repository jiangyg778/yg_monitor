import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";

export function injectJsError() {
  window.addEventListener(
    "error",
    function (event) {
      let lastEvent = getLastEvent(); //获取用户最后一个操作
      let log = {
        kind: "stability", //大类
        type: "error", //小类
        errorType: "JsError", //错误类型
        url: window.location.href, //页面url
        message: event.message, //类型详情
        filename: event.filename, //访问的文件名
        position: `${event.lineno}:${event.colno}`, //行列信息
        stack: getLines(event.error.stack), //错误堆栈
        selector: lastEvent ? getSelector(lastEvent) : "", //最后一个操作的元素

        title: document.title, //页面标题
        timeStamp: new Date().getTime(), //访问时间戳
        userAgent: navigator.userAgent, //浏览器信息
      };
      console.log(log, 5555);
    },
    true //捕获阶段
  );
}

function getLines(stack) {
  return stack
    .split("\n")
    .slice(1)
    .map((item) => item.replace(/^\s+at\s+/g, ""))
    .join("^");
}
