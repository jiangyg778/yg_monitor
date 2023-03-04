let host = "cn-hangzhou.log.aliyuncs.com";
let project = "yagunang";
let logstore = "yaguang-store";
let userAgent = require("user-agent");

function getExtraData() {
  return {
    url: location.href,
    title: document.title,
    userAgent: userAgent.parse(navigator.userAgent).name, //浏览器信息
    timestamp: Date.now(),
  };
}

class SendTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logstore}/track`; //上报地址
    this.xhr = new XMLHttpRequest();
  }
  send(data = {}) {
    let extraData = getExtraData();
    let log = {
      ...data,
      ...extraData,
    };

    //数字转字符串
    for (let key in log) {
      if (typeof log[key] === "number") {
        log[key] = `${log[key]}`;
      }
    }

    console.log(log, 5555);

    let body = JSON.stringify({
      __logs__: [log],
    });

    this.xhr.open("POST", this.url, true);
    this.xhr.setRequestHeader("x-log-apiversion", "0.6.0"); //固定值
    this.xhr.setRequestHeader("x-log-bodyrawsize", body.length); //body的长度
    this.xhr.setRequestHeader("Content-Type", "application/json"); //固定值
    this.xhr.onload = function () {
      console.log("上报成功");
    };
    this.xhr.onerror = function () {
      console.log("上报失败");
    };
    this.xhr.send(body);
  }
}

export default new SendTracker();
