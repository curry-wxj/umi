/**
 * image: '/images/menu/系统管理.png'
 * icon: shake
 */
import React from 'react';
import { Table } from 'antd';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];

const data = [];
for (let i = 0; i < 46; i+=1) {
  data.push({
    name: `Edward King ${i}`,
    age: i,
    address: `London, Park Lane no. ${i}`,
  });
}
export default class ListApp extends React.Component {
  state = {
    selectedRowKeys: [],
  };

  onSelectChange = (selectedRowKeys, a) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys: a.map(item => item.age) });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        scroll={{ y: 460 }}
        rowKey={records => records.age}
      />
    );
  }
}