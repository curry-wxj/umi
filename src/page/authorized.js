/**
 * isHide: true,
 */
import React from 'react';
import RenderAuthorized from '@/component/Authorized';
import { getLocalStorage } from '@/utils/localStorage';
import Redirect from 'umi/redirect';

const Authorized = RenderAuthorized(getLocalStorage());

export default (props) => {
  const {
    children,
    location: { pathname },
    route: { authority },
  } = props;
  if (pathname === '/user/login') {
    return children;
  }
  return (
    <Authorized authority={authority} noMatch={<Redirect to="/user/login" />}>
      {children}
    </Authorized>
  )
};
