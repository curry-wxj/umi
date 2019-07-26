import { parse } from 'qs';
// 根据path 生成对应 formatMessage id
export const formatterId = (path) => `menu${path.replace(new RegExp('/', 'g'), '.')}`;

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) { // 相同
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  if (routes.length === 0) return [];
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
// export function getRoutes(path, routerData) {
//   let routes = Object.keys(routerData).filter(
//     routePath => routePath.indexOf(path) === 0 && routePath !== path
//   );
//   // Replace path to '' eg. path='user' /user/name => name
//   routes = routes.map(item => item.replace(path, ''));
//   // Get the route to be rendered to remove the deep rendering
//   const renderArr = getRenderArr(routes);
//   // Conversion and stitching parameters
//   let routerObj = {};
//   const renderRoutes = renderArr.map(item => {
//     const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
//     routerObj = { ...routerObj, ...routerData[`${path}${item}`] };
//     return {
//       exact,
//       authority: routerData[`${path}${item}`].authority,
//       path: `${path}${item}`,
//     };
//   });
//   return { children: renderRoutes, ...routerObj, path };
// }
export function getRoutes(path, routerData) {
  const routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0
  );
  const renderArr = getRenderArr(routes);
  let routerObj = {};
  let flag = false;
  const renderRoutes = renderArr.map(item => {
    flag = item === path;
    routerObj = { ...routerObj, ...routerData[item] };
    return {
      authority: routerData[item].authority,
      path: item,
    };
  });
  return { children: flag ? [] : renderRoutes, ...routerObj, path, authority: undefined };
}
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}