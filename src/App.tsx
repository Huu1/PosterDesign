import React from 'react';
import './App.css';
import 'antd/dist/reset.css';
import { Layout } from "antd";
import TopBar from '@/layout/TopBar';
import SideBar from '@/layout/SideBar';
import Overview from '@/views/Home';

const { Content } = Layout;

function App() {
  return (
    <div className='h-screen flex flex-col'>
      <TopBar />
      <div className='flex-1 flex '>
        <SideBar />
        <div className='flex-1'>
          <Overview />
        </div>
      </div>
    </div>
  );
}

export default App;
