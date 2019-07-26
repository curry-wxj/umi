/**
 * authority: [admin, user]
 * Routes:
 *   - ./src/page/authorized.js
 */
import React, { Component } from 'react';
import Redirect from 'umi/redirect';
import { getInitCfg } from 'Utils/sysConfig';
import UserLayout from './userLayout';
import BasicLayout from './basicLayout';

const initCfg = getInitCfg();
export default class Page extends Component {
  render() {
    const {
      children,
      location: { pathname, key },
      route: { routes = [] },
    } = this.props;
    let node = null;
    if (pathname === '/user/login') {
      node = <UserLayout>{children}</UserLayout>
    } else {
      node =
        <React.Fragment>
          <BasicLayout
            pathname={pathname.toLocaleLowerCase()}
            routes={routes}
            keys={key}
          >
            {children}
          </BasicLayout>
          {pathname === '/' && <Redirect to={initCfg.home} />}
        </React.Fragment>
    }
    return node;
  }
}