/**
 * @description: 加载时间
 */

import getLastEvent from "../utils/getLastEvent";
import { getSelectorJs, getSelectorRes } from "../utils/getSelector";
import onload from "../utils/onload";
import tracker from "../utils/tracker";

export function timing() {
  let FMP; // 首次有效绘制
  let LCP; // 最大内容绘制

  // 增加一个监听器，当 PerformanceObserver 接收到新的性能条目时，它会调用回调函数
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries[0];
    observer.disconnect(); // 停止监听
  }).observe({ entryTypes: ["element"] }); // 监听的类型

  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    LCP = perfEntries[0];
    observer.disconnect(); // 停止监听
  }).observe({ entryTypes: ["largest-contentful-paint"] }); // 监听的类型

  new PerformanceObserver((entryList, observer) => {
    let lastEvent = getLastEvent();
    let firstInput = entryList.getEntries()[0];
    if (firstInput) {
      // processingStart开始处理时间 startTime触发时间 duration持续时间
      let inputDelay = firstInput.processingStart - firstInput.startTime;
      let duration = firstInput.duration;
      if (inputDelay > 0 || duration > 0) {
        tracker.send({
          kind: "experience", // 用户体验
          type: "firstInputDelay", // 首次输入延迟
          inputDelay, // 延时的时间
          duration, // 持续时间
          startTime: firstInput.startTime, // 触发时间
          selector: lastEvent ? getSelectorJs(lastEvent) : "", // 触发的元素
        });
      }
    }
    observer.disconnect(); // 停止监听
  }).observe({ type: "first-input", buffered: true }); // 监听的类型

  onload(() => {
    setTimeout(() => {
      const {
        fetchStart, // 开始获取资源
        connectStart, // 开始建立连接
        connectEnd, // 建立连接结束
        requestStart, // 开始请求
        responseStart, // 开始接收响应
        responseEnd, // 响应结束
        domLoading, // 开始解析dom
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
      } = performance.timing;
      tracker.send({
        kind: "experience", // 用户体验
        type: "timing", // 加载性能
        connectTime: connectEnd - connectStart, // TCP连接耗时
        ttfbTime: responseStart - requestStart, // TTFB耗时 首字节到达时间
        responseTime: responseEnd - responseStart, // 响应耗时  响应读取时间
        parseDomTime: domInteractive - domLoading, // 解析dom树耗时 解析dom的时间
        domContentLoadedTime:
          domContentLoadedEventEnd - domContentLoadedEventStart, // domContentLoaded耗时
        timeToInteractive: domInteractive - fetchStart, // 可交互时间 首次可交互时间
        loadTime: loadEventStart - fetchStart, // 完整的加载时间
      });
      let FP = performance.getEntriesByName("first-paint")[0]; // 首次绘制
      let FCP = performance.getEntriesByName("first-contentful-paint")[0]; // 首次内容绘制
      tracker.send({
        kind: "experience", // 用户体验
        type: "paint", // 加载性能
        firstPaint: FP.startTime, // 首次绘制
        firstContentfulPaint: FCP.startTime, // 首次内容绘制
        firstMeaningfulPaint: FMP.startTime, // 首次有效绘制
        largestContentfulPaint: LCP.startTime, // 最大内容绘制
      });

      //开始发送性能指标
    }, 3000);
  });
}
