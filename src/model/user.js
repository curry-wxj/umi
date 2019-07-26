
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { stringify } from 'qs';
import { login } from '@/services/login';
import { setLocalStorage, getLocalStorage } from '@/utils/localStorage';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { getInitCfg } from 'Utils/sysConfig';

const initCfg = getInitCfg();

export default {
  namespace: 'user',

  state: {
    username: getLocalStorage(),
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { username=getLocalStorage(), success=false } = response || {};
      yield put({
        type: 'loadData',
        payload: { username },
      });
      reloadAuthorized();
      if (success) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }else {
          redirect=initCfg.home; // 不存在 就调配置页面
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        message.warning('账户密码错误！');
      }
    },

    *logout(_, { put }) {
      yield put({
        type: 'loadData',
        payload: {
          username: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    loadData(state, { payload }) {
      setLocalStorage(payload.username);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
