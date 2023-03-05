import { injectJsError } from "./lib/jsError";
import { injectXHR } from "./lib/xhr";
import { blankScreen } from "./lib/blankScreen";

injectJsError(); //监控js错误
injectXHR(); //监控ajax请求
blankScreen(); //监控白屏
