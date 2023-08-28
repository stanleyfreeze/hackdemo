//@ts-nocheck
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import Style from './Progressbar.less';

// const PROGRESS_INTERVAL = 500; // 定时器间隔
// const tips = '拍照中,请稍等';
const Progressbar = memo(({ value, onStop }: { value: number; onStop: () => void }) => {
  //   const [count, setCount] = useState(value);
  // const [status, setStatus] = useState(tips);
  //   const intervalIdRef = useRef(null);

  // useEffect(() => {
  //   if (value >= 100) {
  //     setStatus('拍照完成');
  //   } else {
  //     setStatus(tips);
  //   }
  // }, [value]);

  //   useEffect(() => {
  //     console.log(count);
  //     if (count >= 100) {
  //       // setCount(0)
  //       setStatus('拍照完成');
  //       clearInterval(intervalIdRef.current);
  //     } else {
  //       setStatus(tips);
  //       // 在组件挂载时启动定时任务
  //       const intervalId = setInterval(() => {
  //         setCount((prevCount) => prevCount + 3);
  //       }, 100);
  //       intervalIdRef.current = intervalId;
  //     }
  //     // 在组件卸载时清除定时器
  //     return () => {
  //       clearInterval(intervalIdRef.current);
  //     };
  //   }, []); // 依赖数组为空，表示只在组件挂载和卸载时执行一次

  return (
    <div className={Style.progress}>
      <div className={Style.progress_tips}>正在截取整个页面...</div>
      <div className={Style.progressbar}>
        <div className={Style.progressbar_inner} style={{ '--progress': value + '%' }}></div>
        <div className={Style.progressbar_inner2} style={value > 50 ? { color: '#fff' } : undefined}>
          {value}%
        </div>
      </div>
      <div className={Style.progressbar_tips2}>
        为了保证最好的截图效果，请不要在截图的时候<b>滚动</b>或<b>操作</b>页面；如若长时间未停止，点此
        <span onClick={onStop}>停止</span>。
      </div>
    </div>
  );
});

export default Progressbar;
