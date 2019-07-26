import { message } from 'antd';
import request from '../utils/request';

// const delay = (millisecond) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, millisecond);
//   });
// };

export default {
  namespace: 'demo',
  state: {
    data: {},
  },
  effects: {
    *queryInitCards(_, { call, put }) {
      // https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke
      // 这里我们直接调用了一个「非本地」地址 能够请求成功。
      // 是因为被调用的 API (即 上面这个get请求 接口 )做了额外的人为设置 允许一个「非同域」的 ajax 请求(即允许跨域请求)
      const endPointURI = '/api/demo1'; // 获取假数据 
      try {
        const data = yield call(request, endPointURI); // 获取服务端数据
        yield put({ type: 'loadData', payload: data }); // 加一个卡片数据
      } catch (e) {
        message.error('数据获取失败'); // 打印错误信息
      }
    }
  },
  reducers: {
    loadData(state, { payload }) {
      return {
        data: payload,
      };
    }
  },
};