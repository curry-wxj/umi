import React, { Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi/locale';
import pathToRegexp from 'path-to-regexp'; // 将pathname转为正则表达式
import { TransitionGroup, CSSTransition } from "react-transition-group";
import SiderMenu from '../component/siderMenu';
import Exception from '@/component/Exception';
import Header from './header';
import Authorized from '@/utils/Authorized';
import { formatterId, getRoutes } from '@/utils/utils';
import { getCfgByKey } from '@/utils/sysConfig';
import GlobalFooter from '../component/globalFooter';
import styles from './basicLayout.less';

const { Content } = Layout;
const menu = getCfgByKey('menu');

export default class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap() || {};
    this.menuData = this.getMenuData();
  }

  state = {
    collapsed: false,
  }

  getBreadcrumbNameMap = () => {
    if (menu) {
      const routerMap = {};
      const mergeMenuAndRouter = data => {
        data.forEach(item => {
          if (item.children) {
            mergeMenuAndRouter(item.children);
          }
          routerMap[item.path] = item;
        });
      };
      mergeMenuAndRouter(menu);
      return routerMap;
    }
    return null;
  }
  // 获取面包屑数组结构
  // getbreadcrumbItem = (url) => {
  //   const urllist = url.split('/').filter(i => i);
  //   const dataArr = urllist.map((urlItem, index) => `menu.${urllist.slice(0, index + 1).join('.')}`);
  //   dataArr.unshift('menu.home');
  //   return dataArr;
  // }

  // 通过routes 生成父子菜单关系
  getMenuData() {
    if (menu) return menu;
    const {
      routes,
    } = this.props;
    const rouFilter = routes.filter(elem => !elem.isHide && elem.path);
    rouFilter.forEach((item) => {
      this.breadcrumbNameMap[item.path] = item;
    });
    let pathGroup = [];
    rouFilter.forEach(router => {
      const urllist = router.path.split('/').filter(i => i);
      let dataArr = urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
      if (dataArr.length !== 1) { dataArr = dataArr.filter((item, index) => dataArr.length - 1 !== index) };
      dataArr.forEach(routerPath => {
        const getRouteData = getRoutes(routerPath, this.breadcrumbNameMap)
        pathGroup.push(getRouteData);
      })
    }
    );
    const objFil = {};
    pathGroup = pathGroup.filter((fil) => {
      if (!objFil[fil.path]) {
        objFil[fil.path] = 1;
        return true;
      }
      return false;
    })
    //   // 子菜单配置项 icon image authority([admin, user] or admin)
    //   // 菜单配置项 icon image path authority([admin, user] or admin)
    return pathGroup;
  }

  // 切换路由 改变document.title
  getPageTitle = (routerConfig) => {
    if (!routerConfig.path) {
      return formatMessage({ id: 'app.user.login.title' });
    }
    return `${formatMessage({ id: 'app.user.login.title' })} - ${formatMessage({ id: formatterId(routerConfig.path) })}`;
  }

  // 寻找 对应的路由配置
  findPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).
      find(key => pathToRegexp(key).test(pathname));
    return this.breadcrumbNameMap[pathKey];
  };

  // 菜单切换
  toggleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  }

  // 获取面包屑数组结构
  getbreadcrumbItem = (url) => {
    const urllist = url.split('/').filter(i => i);
    const dataArr = urllist.map((urlItem, index) => `menu.${urllist.slice(0, index + 1).join('.')}`);
    dataArr.unshift('menu.home');
    return dataArr;
  }

  render() {
    const {
      children,
      keys,
      pathname
    } = this.props;
    const { collapsed } = this.state;
    const routerConfig = this.findPath(pathname) || {};
    const breadcrumbItem = this.getbreadcrumbItem(pathname).map(item => <Breadcrumb.Item key={item}>{formatMessage({ id: item })}</Breadcrumb.Item>)
    return (
      <DocumentTitle title={this.getPageTitle(routerConfig)}>
        <Layout>
          <SiderMenu
            pathname={pathname}
            Authorized={Authorized}
            menuData={this.menuData}
            collapsed={collapsed}
          />
          <Layout>
            <Header toggleCollapsed={this.toggleCollapsed} collapsed={collapsed} />
            <div className={styles.warpBread}>
              <Breadcrumb>
                {breadcrumbItem}
              </Breadcrumb>
            </div>
            <Content className={styles.content}>
              <Authorized
                authority={routerConfig.authority}
                noMatch={<Exception type="403" />}
              >
                <TransitionGroup>
                  {/* exit={false} enter={true} */}
                  <CSSTransition timeout={3000} exit={false} key={keys} classNames="fade">
                    {children}
                  </CSSTransition>
                </TransitionGroup>
              </Authorized>
            </Content>
            <GlobalFooter />
          </Layout>
        </Layout>
      </DocumentTitle>
    )
  }
}