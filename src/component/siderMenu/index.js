import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { getInitCfg } from 'Utils/sysConfig';
import { formatterId } from '@/utils/utils';
import styles from './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;
const initCfg = getInitCfg();
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.defaultOpenKeys = [];
    this.menuItem = this.getNavMenuItems();
  }

  // 遍历数据
  getNavMenuItems() {
    const { menuData } = this.props;
    return menuData.map((item) => this.getMenuDom(item))
  }

  // 检验是否有权限
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  // 进行权限判断
  getMenuItemPath = (item) => {
    const ItemDom = (
      <Menu.Item key={item.path}>
        <Link to={item.path}>
          {item.icon && <Icon type={item.icon} />}
          <span>{formatMessage({ id: formatterId(item.path) })}</span>
        </Link>
      </Menu.Item>
    );
    return this.checkPermissionItem(item.authority, ItemDom);
  }

  // 生成菜单dom
  getMenuDom = (item) => {
    if (item.children && item.children.length > 0) {
      const { pathname } = this.props;
      const childItem = item.children.map((elem) => {
        if (elem.path === pathname) {
          this.defaultOpenKeys = [item.path]; // 获取父菜单path
        }
        return this.getMenuItemPath(elem)
      })
      //  若子菜单均没有权限查看 则删除父菜单
      const isChild = childItem.some(chiItem => chiItem);
      return (
        isChild &&
        <SubMenu
          key={item.path}
          title={
            <span>
              {item.image && <img className={styles.menuImg} src={item.image} alt="menuImg" />}
              {!item.image && item.icon && <Icon type={item.icon} />}
              <span>{formatMessage({ id: formatterId(item.path) })}</span>
            </span>
          }
        >
          {childItem}
        </SubMenu>
      )
    }
    return this.getMenuItemPath(item);
  }

  render() {
    const { collapsed, pathname } = this.props;
    return (
      <Sider
        trigger={null}
        collapsible
        width={240}
        className={styles.sider}
        collapsed={collapsed}
      >
        <div className={styles.logo}>
          <Link to={initCfg.home}>
            <img src={initCfg.logo} alt="logo" />
            <h1>
              <FormattedMessage id="app.user.login.title" />
            </h1>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={this.defaultOpenKeys}
          inlineCollapsed={collapsed}
        >
          {this.menuItem}
        </Menu>
      </Sider>
    )
  }
}