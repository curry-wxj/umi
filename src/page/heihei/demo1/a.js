/**
 * authority: admin
 */
import React from "react";
import { Card } from "antd";
import CardButton from "@/page/components/CardButton";

export default props => {
  const a = props;
  console.log(a);

  const onChange = value => {
    console.log(value);
  };
  return (
    <Card
      loading={false}
      title="绩效统计"
      extra={
        <CardButton
          onChange={onChange}
          names={[
            { title: "月", value: "month" },
            { title: "年", value: "year" },
            { title: "更多", value: "more" }
          ]}
        />
      }
      style={{ width: '100%' }}
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
};
