import React from 'react';
import {useTimeout} from '../../index';

const THIRTY_SECONDS = 30000;

export default function TestComponent(props) {
  const {callback} = props;
  const timeout = useTimeout(callback, THIRTY_SECONDS);

  timeout.start();

  return <span>test</span>;
}
