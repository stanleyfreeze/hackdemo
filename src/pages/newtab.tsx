import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const Tab = () => {
  return <>tab</>;
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Tab />
  </React.StrictMode>,
);
