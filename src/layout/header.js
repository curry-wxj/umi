import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import GlobalHeader from '../component/globalHeader';

const { Header } = Layout;

export default class HeaderView extends PureComponent {
  render() {
    const { toggleCollapsed, collapsed } = this.props;
    return (
      <Header style={{ padding: 0 }}>
        <GlobalHeader
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
        />
      </Header>
    );
  }
}