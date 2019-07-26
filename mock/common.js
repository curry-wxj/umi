// mock下可以为js文件和文件夹(文件夹中只能放置json文件)
import demo from './demo/demo';

const delay = (proxy, timer) => {
  var mockApi = {};
  Object.keys(proxy).forEach(function (key) {
    var foo;
    var result = proxy[key]; // 赋值为新的result
    // 是字符串且为http的 不做任何处理
    if (Object.prototype.toString.call(result) === '[object String]' && /^http/.test(result)) {
      mockApi[key] = result;
    } else {
      mockApi[key] = function (req, res) {
        if (Object.prototype.toString.call(result) === '[object Function]') {
          foo = result;
        } else {
          foo = function (req, res) {
            res.json(result);
          };
        }
        setTimeout(function () {
          foo(req, res);
        }, timer);
      };
    }
  });
  mockApi.__mockData = proxy;
  return mockApi;
};
const noProxy = process.env.MOCK === 'true';
console.log(process.env.MOCK);
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/demo1': demo,
  // GET POST 可省略
  '/api/demo2': {
    id: 123,
    type: 'wxj'
  },
  // 支持自定义函数，API 参考 express@4
  'get /api/demo3': function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    setTimeout(() => {
      res.json({
        id: 123,
        type: 'wxj'
      });
    }, 3000);
  },
  'POST /api/login': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      res.send({
        success: true,
        username,
      });
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        success: true,
        username,
      });
      return;
    }
    res.send({
      success: false,
      username,
    });
  },
};
export default delay(proxy, 1000);
