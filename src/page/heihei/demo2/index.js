/**
 * authority: admin
 */
import React from 'react';
import style from './index.less';

export default (props) => {
  const a = props;
  console.log(a);
  return (
    <div className={style.wrap}>
      <div className={style.box}>demo2</div>
    </div>
  );
};