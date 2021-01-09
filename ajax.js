// ajax封装
;(function() {

  function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    // 格式化参数
    function formatParams(data) {
      var arr = [];
      for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
      return arr.join("&");
    }
    var params = formatParams(options.data);

    // 1.创建 XMLHttpRequest 对象
    var xhr = new XMLHttpRequest();
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
        0	代理被创建，但尚未调用 open() 方法。
        1	open() 方法已经被调用。
        2	send() 方法已经被调用，并且头部和状态已经可获得。
        3	响应体部分正在被接收。
        4	请求操作已经完成。数据传输已经彻底完成或失败。
      */
      if (xhr.readyState == 4) {
        var status = xhr.status;
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

  // ajax({
  //   url: "",
  //   type: "POST",
  //   data: { name: "super", age: 20 },
  //   dataType: "json",
  //   success: function (response) {
  //     // 此处放成功后执行的代码
  //   },
  //   fail: function (status) {
  //     // 此处放失败后执行的代码
  //   }
  // });


  function show(el, type) {
    el.style.display = 'block';
    if (type == 1) { // transform
        el.style.transform = 'translateY(100%)';
        setTimeout(function() {
            el.style.transform = 'translateY(0%)';
        }, 100);
    } else if (type == 2) { //  opacity
        el.style.opacity = 0;
        setTimeout(function() {
            el.style.opacity = 1;
        }, 100);
    }
  }

  function hide(el, type) {
    if (type == 1) { // transform
        el.style.transform = 'translateY(100%)';
    } else if (type == 2) { //  opacity
        el.style.opacity = 0;
    }
    setTimeout(function() {
        el.style.display = 'none';
    }, 600);
  }

})();



// 自定义Promise https://juejin.cn/post/6844904142087913486
(function() {

// 自定义 Promise 不能链式调用，要实现链式调用需要then方法返回Promise实例
class myPromise {
  // 构造函数传入一个函数
  constructor(executor) {
    this.status = 'pending'; // 有三种状态 pending（等待），fulfilled （完成），rejected（拒绝）
    this.value = undefined; // 成功或者失败的返回值
    this.resolveArr = []; // 存储then中注册的成功的方法
    this.rejectArr = [];// 存储then中注册的失败的方法

    // 定义change方法，因为resolve和reject方法共同的地方还挺多
    let change = (status, value) => {
      if(this.status !== "pending") return;  // 状态一旦改变，就不会再变
      this.status = status;
      this.value = value;
      // 根据状态判断要执行成功的方法或失败的方法
      let fnArr = status === "fulfilled" ? this.resolveArr : this.rejectArr;
      // fnArr 中的方法依次执行
      fnArr.forEach(fn => {
        if(typeof fn !== "function") return;
        fn(this.value);
      })
    }
    /* // 这里是resolve方法，成功后执行，将状态改变为fulfilled，并且将结果返回
    let resolve = result => {
      if(this.status !== "pending") return;  // 状态一旦改变，就不会再变
      this.status = "fulfilled";
      this.value = result;
      // resolveArr 中的方法依次执行
      this.resolveArr.forEach(fn => {
        if(typeof fn !== "function") return;
        fn(this.value);
      })
    } */
    let resolve = result => {
      // 如果数组中有值，则立即改变状态
      if (this.resolveArr.length > 0) {
        change('fulfilled', result)
      } else {
        // 如果没值，则延后改变状态 Promise传入的函数不是异步才会出现这种情况，使用定时器模拟异步
        setTimeout(() => {
          change('fulfilled', result)
        }, 0)
      }
    }

    /* // 这里是reject方法，异常时执行，状态改为rejected，并且将失败的原因返回
    let reject = reason => {
      if(this.status !== "pending") return;
      this.status = "rejected";
      this.value = reason;
      // rejectArr 中的方法依次执行
      this.rejectArr.forEach(fn => {
        if(typeof fn !== "function") return;
        fn(this.value);
      })
    } */
    let reject = reason => {
      // 如果数组中有值，则立即改变状态
      if (this.rejectArr.length > 0) {
        change('rejected', reason)
      } else {
        // 如果没值，则延后改变状态 Promise传入的函数不是异步才会出现这种情况，使用定时器模拟异步
        setTimeout(() => {
          change('rejected', reason)
        }, 0)
      }
    }

    // 执行传入的函数传入成功(resolve)和失败(reject)的参数
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(resolveFn, rejectFn) {
    // 添加成功和失败的方法到集合中
    this.resolveArr.push(resolveFn)
    this.rejectArr.push(rejectFn)
  }
}

new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
}).then(res => {
  console.log(res)
})

})();