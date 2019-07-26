/**
 * authority: admin
 */
import React, { useState } from "react";
import { Button } from "antd";

console.log(React.useState);
function Example() {
  // 声明一个新的叫做 “count” 的 state 变量
  const [count, setCount] = useState(0);
  let a = 1;

  return (
    <div>
      <p>You clicked {count} times</p>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        Click me
      </Button>
    </div>
  );
}

export default Example;
