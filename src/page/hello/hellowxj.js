/**
 * icon: distribution
 * authority: admin
 */
import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import styles from './hellowxj.less';

const FormItem = Form.Item;

@Form.create()
class Hellowxj extends React.Component {
  getDefaultProps(){
    return {
      name: 1
    }
  }

  getInitialState(){
    return {
      name1: 1
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem className={styles.button}>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Hellowxj;
