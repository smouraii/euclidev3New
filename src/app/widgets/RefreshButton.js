import React from 'react';
import {Button, Icon} from 'antd';
import { configConsumerProps } from 'antd/lib/config-provider';

function RefreshButton(props) {
  const {onClick} = props;
  return (
    <div>
      <Button onClick={onClick}><Icon type="retweet" /></Button>
    </div>
  );
}

export default RefreshButton;