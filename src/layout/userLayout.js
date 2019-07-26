import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import Texty from 'rc-texty';
import { formatMessage } from 'umi/locale';
import 'rc-texty/assets/index.css';
import { getInitCfg } from 'Utils/sysConfig';
import styles from './userlayout.less';
import SelectLang from '@/component/SelectLang'
import GlobalFooter from '../component/globalFooter';
import LogoGather from '../component/logoGather';

const { Content, Header } = Layout;
const initCfg = getInitCfg();

export default class UserLayout extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.wrapping}>
        <LogoGather />
        <Layout className={styles.container}>
          <Header className={styles.header}>
            <img alt="logo" className={styles['header-img']} src={initCfg.logo} />
            <Texty type='flash' className={styles['header-text']}>
              {formatMessage({ id: 'app.user.login.title' })}
            </Texty>
            <SelectLang className={`${styles.selectlang}`} />
          </Header>
          <Content>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.link}>
                  <img alt="logo" className={styles.logo} src={initCfg.logo} />
                  <Texty className={styles.title}>
                    {formatMessage({ id: 'app.user.login' })}
                  </Texty>
                </div>
                <div className={styles.desc}>
                  <Texty type='scaleBig'>
                    {formatMessage({ id: 'app.user.login.message' })}
                  </Texty>
                </div>
              </div>
              {children}
            </div>
          </Content>
          <GlobalFooter />
        </Layout>
      </div>
    );
  }
}