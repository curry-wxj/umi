import React from 'react';
import { Layout, Icon } from 'antd';
import styles from './index.less';

const { Footer } = Layout;

export default () => (
  <Footer className={styles.footer}>
    Copyright <Icon type="copyright" /> 2018 Created by wxj
  </Footer>
);
