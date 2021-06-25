# 对象相关API

## 创建新对象

```js
function newInstance(Fn, ...args) {
  // 创建一个新对象
  const obj = {};
  // 修改函数内部 this 指向新对象并执行
  const result = Fn.call(obj, ...args);
  // 修改新对象的原型对象
  obj.__proto__ = Fn.prototype;
  // 返回新对象
  return result instanceof Object ? result : obj;
}

// 调用
function Person(){}
let obj = newInstance(Person, '参数1', '参数2')
```

## 自定义instanceof

```js
function myInstanceOf(obj, Fn) {
  // 获取函数的显式原型
  let prototype = Fn.prototype;
  // 获取 obj 的隐式原型对象
  let proto = obj.__proto__;
  // 遍历原型链
  while(proto) {
    // 检测原型对象是否相等
    if (prototype === proto) {
      return true;
    }
    // 不相等 获取上一个原型
    proto = proto.__proto__;
  }
  return false;
}

function Person(){}
let p = new Person;
console.log(myInstanceOf(p, Person))
// console.log(p instanceof Person)
```
