// 文章地址掘金 https://juejin.cn/post/6844903795420299278

// 防抖：任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行。
// 防抖功能函数，接受传参
function debounce(fn) {
  // 创建一个标记用来存放定时器的返回值
  let timeout = null;
  return function() {
    // 每次当用户点击/输入的时候，把前一个定时器清除
    clearTimeout(timeout);
    // 然后创建一个新的 setTimeout
    // 这样就能保证点击按钮后的 interval 间隔内
    // 如果用户还点击了的话，就不会执行 fn 函数
    timeout = setTimeout(() => {
      fn.call(this, arguments);
    }, 1000);
  };
}
// 调用防抖函数体
debounce(function() {
  console.log("防抖成功！");
})



// 节流：指定时间间隔内只会执行一次任务。
// 节流函数体 
function throttle(fn) {
  // 通过闭包保存一个标记
  let canRun = true;
  return function() {
    // 在函数开头判断标志是否为 true，不为 true 则中断函数
    if(!canRun) {
      return;
    }
    // 将 canRun 设置为 false，防止执行之前再被执行
    canRun = false;
    // 定时器
    setTimeout( () => {
      fn.call(this, arguments);
      // 执行完事件（比如调用完接口）之后，重新将这个标志设置为 true
      canRun = true;
    }, 1000);
  };
}
// 调用节流函数体
throttle(function() {
  console.log('节流成功')
})