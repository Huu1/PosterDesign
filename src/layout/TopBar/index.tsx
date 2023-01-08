import { Button } from 'antd';
import  publish  from 'pubsub-js';
import * as React from 'react';

const Index = () => {
  return <div className=' h-12 bg-primary'><Button onClick={()=>{
    publish.publish('export')
  }}>导出</Button></div>
}

export default Index;