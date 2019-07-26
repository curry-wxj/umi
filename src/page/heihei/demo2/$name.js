/**
 * authority: admin
 */
import React from 'react';

export default (props) => {
  const { match: { params: { name } } } = props;
  return (
    <div>{name}</div>
  );
};