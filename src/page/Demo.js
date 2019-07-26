/**
 * isHide: true,
 */
import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { getCfgByKey } from 'Utils/sysConfig';

const namespace = 'demo';
const a = getCfgByKey('demo');
console.log(a);
@connect(
  (state) => ({
    data: state[namespace].data
  })
)
class Demo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryInitCards`,
    });
  }

  render() {
    const { data } = this.props;
    return (
      <Card key={data.id}>
        <div>type: {data.type}</div>
      </Card>
    );
  }
}
export default Demo;