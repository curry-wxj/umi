import request from './request';
//  当路由是 http://localhost:5000/hello/helloworld时 
//  会去当前 路由下找  config/init.json  前面如果没有/，就会找不到
const initUrl = '/config/init.json';

const cache = new Map();
/**
 * 获取public/conmfig/init.json配置文件信息
 *
 * @function getInitCfg
 * @return {Object}
 */
export function getInitCfg() {
  if (cache.has('init')) {
    return cache.get('init');
  }
  const data = request(initUrl)
  cache.set('init', data);
  return data;
}
/**
 * 获取配置文件信息(需在init.json cfgs[]中进行配置)
 *
 * @function getCfgByKey
 * @param {string} key - 对应init.json cfgs[].key
 * @return {Object}
 */
export function getCfgByKey(key = '') {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const res = getInitCfg()
  const { cfgs = [] } = res;
  if (!Array.isArray(cfgs)) {
    throw new Error('init.json - cfgs配置');
  }
  let result;
  cfgs.filter(elem => elem.key === key).forEach(item => {
    if (item.loaded === false) {
      return
    }
    const res2 = request(`/${item.url}`)
    cache.set(key, res2);
    result = res2;
  })
  return result;
}
