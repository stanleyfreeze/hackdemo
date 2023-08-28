import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Style from '@/styles/index.less';
// import db from '@/utils/db';
import { GETINDEXEDDB } from '@/utils/enum';
// import { useLiveQuery } from 'dexie-react-hooks';

type paramType = {
  originTab: number;
  dataId: string;
};
interface Params {
  [key: string]: string | number;
}
function getURLParameters(url: string) {
  const params: Params = {};
  const urlSearchParams = new URLSearchParams(url.split('?')[1]);

  for (const [key, value] of urlSearchParams.entries()) {
    params[key] = value;
  }

  return params;
}

interface ResultData {
  img?: string;
  data?: string;
  path?: string;
}

const Newtab = () => {
  const param = getURLParameters(location.href);
  const imgRef = useRef(null);
  const [result, setResult] = useState<ResultData>();
  useEffect(() => {
    if (param && param.originTab) {
      chrome.tabs.sendMessage(
        parseInt(param.originTab as string),
        { action: GETINDEXEDDB, dataId: param.dataId },
        (response: any) => {
          setResult(response);
        },
      );
    }
  }, []);

  return (
    <div className={Style.newTab}>
      <div className={Style.content}>
        {result && result.img && <img id="screenshotImg" src={result.img} ref={imgRef} className={Style.img} width='100%'/>}
      </div>
      {/* <div>编辑</div> */}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Newtab />
  </React.StrictMode>,
);
