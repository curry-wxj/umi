import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Icon, Avatar, Menu, Dropdown, Badge, Modal } from 'antd';
import SelectLang from '@/component/SelectLang'
import styles from './index.less'

@connect((state) => ({
  username: state.user.username
}))
class GlobalHeader extends PureComponent {
  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      Modal.confirm({
        title: formatMessage({ id: 'app.header.tips' }),
        content: formatMessage({ id: 'app.header.logout-tips' }),
        onOk: () => {
          dispatch({
            type: 'user/logout',
          });
        },
      });
    }
  }

  render() {
    const { toggleCollapsed, collapsed, username } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="center">
          <Icon style={{ float: 'left', marginTop: '5px' }} type="user" />
          <a target="_blank" href="http://www.alipay.com/" rel="noopener noreferrer">{formatMessage({ id: 'app.header.accout-center' })}</a>
        </Menu.Item>
        <Menu.Item key="help">
          <Icon style={{ float: 'left', marginTop: '5px' }} type="question-circle-o" />
          <a target="_blank" href="http://www.baidu.com/" rel="noopener noreferrer">{formatMessage({ id: 'app.header.help' })}</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          {formatMessage({ id: 'app.header.logout' })}
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggleCollapsed}
        />
        <div className={styles.right}>
          <Dropdown overlay={menu} className={styles.dropdown}>
            <div>
              <Badge count={5} className={styles.badge}>
                <Icon type="bell" className={styles.message} />
              </Badge>
              <div className={styles.avatarWrap}>
                <Avatar
                  icon="user"
                  size="small"
                  className={styles.avatar}
                />
                {username}
              </div>
            </div>
          </Dropdown>
          <SelectLang className={`${styles.selectlang} ${styles.action}`} />
        </div>
      </div>
    );
  }
}
export default GlobalHeader;