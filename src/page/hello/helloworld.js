/**
 * icon: distribution
 * authority: admin
 */
import React from 'react';
import PanelCtrl from '@/component/PanelCtrl';

class helloworld extends React.Component {

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
    return (
      <PanelCtrl
        direction="col"
        size={[25, 75]}
        style={{ height: 'calc(100vh - 180px)' }}
        header={<div style={{ background: 'blue' }}>我是头部</div>}
        footer={<div style={{ background: 'yellow' }}>我是尾部</div>}
      >
        <PanelCtrl direction="col" size={[25, 75]}>
          <div style={{ border: '1px solid red', height: '100%' }}>
            sadsad
          </div>
          <PanelCtrl direction="row" size={[25, 75]} loading loadms="正在加载中">
            <div style={{ border: '1px solid red', height: '100%' }}>
              sadsad111
            </div>
            <div style={{ border: '1px solid yellow', height: '100%' }}>
              sss
            </div>
          </PanelCtrl>
        </PanelCtrl>
        <div style={{ border: '1px solid yellow', height: '100%' }}>
          sss
        </div>
      </PanelCtrl>
    );
  }
}
export default helloworld;
