import { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { C } from './hoge';

export default function Page() {
  return (
    <>
      <Sidebar>
        <div>カレンダー</div>
        <C/>
      </Sidebar>
    </>
  );
}
