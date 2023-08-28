import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Style from '@/styles/index.less';

const Popup = () => {
  return (
    <div className={Style.popup}>
      <div className={Style.content}>Hack Demo</div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);