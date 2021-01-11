# 常用函数

- 目录
  - [防抖](#防抖)
  - [节流](#节流)

## 防抖

防抖：任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行。

``` js
/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 * @author 小炜 2021-01-11
 * @param {Function} func - 回调函数
 * @param {Number} wait 延时的时间 默认500毫秒
 * @return {undefined}
 */
let timeout = null;
function debounce(func, wait = 500) {
  // 清除定时器
  clearTimeout(timeout);
  // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
  timeout = setTimeout(function() {
    typeof func === 'function' && func();
  }, wait);
}
// 调用防抖函数
debounce(function() {
  console.log("防抖成功！");
})
```

## 节流

```js
/**
 * 节流原理：在一定时间内，只能触发一次
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
let flag;
function throttle(func, wait = 500, immediate = true) {
  if (immediate) {
    if (!flag) {
      flag = true;
      // 如果是立即执行，则在wait毫秒开始前执行
      typeof func === 'function' && func();
      setTimeout(() => {
        flag = false;
      }, wait);
    }
  } else {
    if (!flag) {
      flag = true;
      // 如果是非立即执行，则在wait毫秒结束处执行
      setTimeout(() => {
        flag = false
        typeof func === 'function' && func();
      }, wait);
    }
  }
}
// 调用
throttle(function() {
  console.log("节流成功！");
});
```
