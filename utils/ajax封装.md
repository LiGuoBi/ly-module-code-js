# ajax封装

```js
/**
 * ajax
 * @param {Object} options 
 * @param {String} options.url 请求地址
 * @param {String} options.type 请求类型 GET(默认)|POST
 * @param {Object} options.data 请求参数
 * @param {Object} options.dataType 响应数据的类型 默认json
 * @param {Function} options.success 成功的回调函数
 * @param {Function} options.fail 失败的回调函数 
 * @return null
 */
function ajax(options = {}) {
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  // 格式化参数
  function formatParams(data) {
    let arr = [];
    for (let name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    return arr.join("&");
  }
  let params = formatParams(options.data);

  // 1.创建 XMLHttpRequest 对象
  let xhr = new XMLHttpRequest();
  // 判断请求类型
  if (options.type == "GET") {
    // 2.初始化设置请求方法和url
    xhr.open("GET", options.url + "?" + params, true);
    // 3.发送
    xhr.send(null);
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, true);
    // 设置请求头
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }
  // 设置返回响应数据的类型。
  xhr.responseType = options.dataType;
  // 4.事件绑定 处理服务端返回的结果
  xhr.onreadystatechange = function () {
    /* 
      readyState 状态码
      0 代理被创建，但尚未调用 open() 方法。
      1 open() 方法已经被调用。
      2 send() 方法已经被调用，并且头部和状态已经可获得。
      3 响应体部分正在被接收。
      4 请求操作已经完成。数据传输已经彻底完成或失败。
    */
    if (xhr.readyState == 4) {
      let status = xhr.status;
      // 判断返回响应状态码 200
      if (status >= 200 && status < 300) {
        // response 响应返回的数据
        options.success && options.success(xhr.response);
      } else {
        options.fail && options.fail(status);
      }
    }
  }
}
// 调用
ajax({
  url: "",
  type: "POST",
  data: { name: "super", age: 20 },
  dataType: "json",
  success: function (response) {
    // 此处放成功后执行的代码
  },
  fail: function (status) {
    // 此处放失败后执行的代码
  }
});
```
