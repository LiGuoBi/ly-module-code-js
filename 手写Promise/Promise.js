
class Promise {
  // 构造函数传入一个函数
  constructor(executor) {
    // 添加属性
    this.PromiseState = 'pending'; // 状态 pending (等待/未确定的)、 resolved/fulfilled (成功)、 rejected (失败)
    this.PromiseResult = null; // 结果值
    this.resolveArr = []; // 初始化then中成功的方法
    this.rejectArr = []; // 初始化then中失败的方法

    let change = (status, result) => {
      // 判断PromiseState只能更改一次
      if (this.PromiseState !== 'pending') return;
      // 修改状态 赋值结果
      this.PromiseState = status;
      this.PromiseResult = result;

      // 判断执行成功(fulfilled)还是失败(rejected)的方法
      let callbacks = status === 'fulfilled' ? this.resolveArr : this.rejectArr;
      // 回调数组如果为空，说明还没有执行then添加方法，
      if (callbacks.length > 0) {
        callbacks.forEach(item => item())
      } else {
        // 把执行回调放入setTimeout事件队列中，等主线程执行完成后再执行
        setTimeout(() =>{
          callbacks.forEach(item => item())
        }, 0)
      }
    }

    // 成功执行 resolve
    let resolve = result => {
      change('fulfilled', result)
    }
    // 失败执行 reject
    let reject = result => {
      change('rejected', result)
    }

    // 同步调用执行器函数传入两个参数
    try {
      executor(resolve, reject)
    } catch (error) {
      // 捕获执行器函数抛出的异常，执行失败的函数修改PromiseState状态
      reject(error)
    }

  }

  // 添加then方法
  then(onResolved, onRejected) {
    // 判断 onResolved, onRejected 回调函数，不是函数赋值一个默认的
    if (typeof onResolved !== 'function') {
      // 成功回调 默认赋值一个 return 参数的函数
      onResolved = val => val;
    }
    if (typeof onRejected !== 'function') {
      // 失败回调 默认赋值一个抛出异常的函数
      onRejected = err => {
        throw err;
      }
    }

    // 返回Promise实现链式调用
    return new Promise((resolve, reject) => {
      // 改变Promise的状态
      let change = (fn) => {
        try {
          // 获取回调函数的执行结果，函数默认返回 undefined
          // 根据回调函数返回的结果去改变Promise的状态
          let result = fn(this.PromiseResult);
          // 判断是否是Promise对象
          if (result instanceof Promise) {
            // 是Promise对象调用then
            // result.then(v => resolve(v), r => reject(r)); // 传入箭头函数调用resolve, reject方法
            result.then(resolve, reject); // 直接传入resolve (成功), reject (失败) 
          } else {
            // 不是调用成功 传入回调函数的结果值
            resolve(result);
          }
        } catch (error) {
          // 捕获 onResolved() 或者 onRejected() 抛出的异常，调用失败
          reject(error);
        }
      }

      // 把 onResolved, onRejected 回调函数添加到数组中在 resolve reject 中调用
      this.resolveArr.push(() => {
        change(onResolved)
      })
      this.rejectArr.push(() => {
        change(onRejected)
      })
    })
    
  }

  // 添加catch方法
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  // 添加 resolve 静态方法，resolve是类的方法，不是实例
  // 传入的值不是Promise对象，返回成功的Promise对象，是跟随传入的Promise对象返回
  static resolve(value) {
    return new Promise((resolve, reject) => {
      // 判断value是否是一个Promise对象
      if (value instanceof Promise) {
        // 是Promise对象调用then
        value.then(resolve, reject); // 直接传入resolve (成功), reject (失败) 
      } else {
        // 不是调用成功
        resolve(value);
      }
    })
  }

  // 添加 reject 静态方法
  // 返回一个失败的Promise
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  // 添加 all 静态方法
  // 传入一个 Promise 数组，
  // 全部Promise对象为成功返回成功的Promise对象
  // 有一个失败返回失败的Promise对象
  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0; // 统计成功的数量
      let resArr = []; // Promise对象成功的结果，存入数组中
      // 循环获取Promise对象的结果
      promises.forEach((item, i) => {
        item.then(res => {
          count++;
          resArr[i] = res;
          // count等于数组长度，全部成功修改Promise对象状态为成功
          if (count === promises.length) {
            resolve(resArr)
          }
        }, err => {
          // 有一个失败修改Promise对象状态为失败
          reject(err)
        })
      })
    })
  }

  // 添加 race 静态方法
  // 传入一个 Promise 数组，返回的Promise对象状态和结果由Promise数组中最先改变状态的Promise决定
  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((item) => {
        item.then(resolve, reject)
      })
    })
  }

}