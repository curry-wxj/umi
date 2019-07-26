const isType = (type) => (param) => Object.prototype.toString.call(param) === `[object ${type}]`;

const resolvePromise = (promise2, x, newFulfill, newReject) => {
  let called = false;
  if (promise2 === x) { // 2.3.1 
    return newReject(new TypeError('循环引用promise'));
  }
  if (isType('Object')(x) || isType('Function')(x)) {
    try {
      const { then } = x;
      if (typeof then == 'function') {
        // 有些promise会同时执行成功和失败的回调
        then.call(x, (y) => {
          // 2.3.3.3.3
          if (called) return;
          called = true;
          resolvePromise(promise2, y, newFulfill, newReject)
        }, (err) => {
          if (called) return;
          called = true;
          newReject(err);
        });
      } else {
        // 到此的话x不是一个thenable对象，那直接把它当成值resolve promise2就可以了
        newFulfill(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      newReject(e);
    }
  } else {
    // 如果X是一个普通 的值，则用x的值去resolve promise2
    newFulfill(x);
  }
}

const gen = (length, resolve) => {
  const arr = [];
  let count = 0;
  return (data, index) => {
    arr[index] = data;
    count += 1
    if (count === length) {
      resolve(arr);
    }
  }
}

class Promise {
  // 全成功就成功，一个失败就失败
  static all(promises) {
    return new Promise((resolve, reject) => {
      const done = gen(promises.length, resolve);
      promises.forEach((item, index) => {
        item.then((data) => {
          done(data, index);
        }, reject)
      })
    })
  }

  // 一个成功就成功，一个失败就失败
  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((item) => {
        item.then(resolve, reject)
      })
    })
  }

  // 返回一个立刻成功的promise (将普通的值转换为promose对象)
  static resolve(value) {
    return new Promise(function (resolve) {
      resolve(value);
    });
  }

  // 返回一个立刻失败的promise
  static reject(reason) {
    return new Promise(function (resolve, reject) {
      reject(reason);
    });
  }

  constructor(task) {
    // 2.1
    this.status = 'pending'; // 设置状态
    this.value = undefined; // new Promise 执行成功、失败传入的结果
    // 存放成功的回调
    this.onfulfilledCallbacks = [];
    // 存放失败的回调
    this.onRejectedCallbacks = [];
    const reject = (err) => {
      setTimeout(() => {
        if (this.status === 'pending') {
          this.status = 'rejected';
          this.value = err;
          this.onRejectedCallbacks.forEach(fn => fn());
        }
      });
    }
    const fulfill = (data) => {
      if (data instanceof Promise) {
        return data.then(fulfill, reject);
      }
      setTimeout(() => {
        if (this.status === 'pending') {
          this.status = 'fulfilled';
          this.value = data;
          this.onfulfilledCallbacks.forEach(fn => fn());
        }
      });
    }
    try { // task()可能会异常
      task(fulfill, reject)
    } catch (e) {
      reject(e);
    }
  };

  then(onFulfilled, onRejected) {
    // 2.2.1
    onFulfilled = // 2.2.7.3
      typeof onFulfilled === 'function' ?
        onFulfilled : (value) => { return value };
    onRejected = // 2.2.7.4
      typeof onRejected == 'function' ?
        onRejected : reason => { throw reason };
    let promise2; // 2.2.7
    switch (this.status) {
      case 'pending':
        promise2 = new Promise((newFulfill, newReject) => {
          // 2.2.6.1
          this.onfulfilledCallbacks.push(() => {
            try { // 2.2.7.2
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, newFulfill, newReject); // 2.2.2.1
            } catch (e) {
              newReject(e)
            }
          })
          this.onRejectedCallbacks.push(() => {
            try {
              const x = onRejected(this.value);
              resolvePromise(promise2, x, newFulfill, newReject);
            } catch (e) {
              newReject(e)
            }
          })
        })
        break;
      case 'fulfilled':
        promise2 = new Promise((newFulfill, newReject) => {
          setTimeout(() => { // 2.2.4
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, newFulfill, newReject);
            } catch (e) {
              newReject(e)
            }
          })
        })
        break;
      default:
        promise2 = new Promise((newFulfill, newReject) => {
          setTimeout(() => {
            try {
              const x = onRejected(this.value);
              resolvePromise(promise2, x, newFulfill, newReject);
            } catch (e) {
              newReject(e)
            }
          })
        })
    }
    return promise2
  }

  catch(onRejected) {
    this.then(null, onRejected);
  }
}

module.exports = Promise;

// 测试
Promise.deferred = Promise.defer = function () {
  let defer = {};
  defer.promise = new Promise(function (resolve1, reject1) {
    defer.resolve = resolve1;
    defer.reject = reject1;
  });
  return defer;
}
/**
 * npm i -g promises-aplus-tests
 * promises-aplus-tests Promise.js
 */