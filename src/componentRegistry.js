import React from 'react';

function Demo(props) {
  const { title } = props;
  return (
    <p>{title}</p>
  );
}

const registry = {
  Demo,
};

export function getComponent(name) {
  return registry[name];
}
