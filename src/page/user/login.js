/**
 * isHide: true,
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import Texty from 'rc-texty';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import styles from './login.less';

const FormItem = Form.Item;

@connect(state => ({
  user: state.user,
  submitting: state.loading.effects['user/login'],
}))
@Form.create()
class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'user/login',
          payload: values,
        });
      }
    });
  }

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: formatMessage({ id: 'app.login.username' }) }],
          })(
            <Input size="large" prefix={<Icon type="user" />} placeholder="admin/user" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: formatMessage({ id: 'app.login.password' }) }],
          })(
            <Input size="large" prefix={<Icon type="lock" />} type="password" placeholder="888888/123456" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>
              <Texty type='scaleBig' className={styles.texty}>
                {formatMessage({ id: 'app.login.remember-me' })}
              </Texty>
            </Checkbox>
          )}
          <Button
            className={styles.button}
            type="primary"
            htmlType="submit"
            loading={submitting}
          >
            <FormattedMessage id="app.login.login" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Login;
