# call、apply、bind函数封装实现

## call

cal-改this指向

``` js
/**
 * @author 小炜 2021-06-18
 * @param {Function} Fn - 函数
 * @param {Object} obj 对象
 * @return 传入函数的执行结果
 */
function call(Fn, obj, ...args){
  // 判断obj对象等于空指向全局对象
  if (obj === undefined || obj === null) {
    obj = globalThis;
  }
  // 为 obj 添加临时的方法
  obj.__temp = Fn; // Fn赋值给temp，这时temp函数this的指向是obj
  // 调用 temp 方法
  let result = obj.__temp(...args);
  // 删除 temp 方法
  delete obj.__temp;
  // 返回执行结果
  return result;
}

// 调用函数
function add(a, b) {
  console.log(this)
  return a + b + this.c;
}
let obj = {c: 1}
window.c = 2;

console.log(call(add, obj, 1, 1));
```

## apply

apply-改this指向

``` js
/**
 * @author 小炜 2021-06-18
 * @param {Function} Fn - 函数
 * @param {Object} obj 对象
 * @return 传入函数的执行结果
 */
function apply(Fn, obj, args){
  // 判断obj对象等于空指向全局对象
  if (obj === undefined || obj === null) {
    obj = globalThis;
  }
  // 为 obj 添加临时的方法
  obj.__temp = Fn; // Fn赋值给temp，这时temp函数this的指向是obj
  // 调用 temp 方法
  let result = obj.__temp(...args);
  // 删除 temp 方法
  delete obj.__temp;
  // 返回执行结果
  return result;
}
```

## bind

bind-改this指向，不立即执行返回一个新函数

``` js
/**
 * @author 小炜 2021-06-18
 * @param {Function} Fn - 函数
 * @param {Object} obj 对象
 * @return 传入函数的执行结果
 */
function bind(Fn, obj, ...args){
  return function(...args2) {
    // 调用call函数
    return call(Fn, obj, ...args, ...args2)
  }
}
```
