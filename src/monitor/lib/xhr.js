/**
 * 监控ajax请求
 */

import tracker from "../utils/tracker";

export function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest;
  let oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, async) {
    if (!url.match(/logstores/) && !url.match(/sockjs/)) {
      //过滤上报日志
      this.logData = {
        method,
        url,
        async,
      };
    }

    return oldOpen.apply(this, arguments);
  };
  let oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    if (this.logData) {
      let startTime = Date.now();
      let handler = (type) => (event) => {
        let duration = Date.now() - startTime;
        let status = this.status;
        let statusText = this.statusText;
        tracker.send({
          kind: "stability", //大类
          type: "xhr", //小类
          errorType: type, //错误类型 load error abort
          pathname: this.logData.url, //接口地址
          status: status + "-" + statusText, //状态码
          duration,
          response: this.response ? JSON.stringify(this.response) : "", //响应内容
          params: body || "", //请求参数
        });
      };
      this.addEventListener("load", handler("load"), false);
      this.addEventListener("error", handler("error"), false);
      this.addEventListener("abort", handler("abort"), false);
    }
    return oldSend.apply(this, arguments);
  };
}
