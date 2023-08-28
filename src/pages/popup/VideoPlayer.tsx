//@ts-nocheck
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Timer } from '@/utils';
import {
  VIDEOSTART,
  VIDEOSTOP,
  VIDEOPAUSE,
  VIDEOSTATUS,
  GETVIDEOTIMER,
  VIDEORESUME,
  GETVIDEOSTATUS,
} from '@/utils/enum';
import Style from './VideoPlayer.less';

const videoCtrl = async (action: string) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (tab.id) {
    const result = await chrome.runtime.sendMessage({ action, tabId: tab.id });
  }
};
const sendMessage = (action: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { action, tabId: tab.id });
    }
  });
};

const VideoPlayer = memo(({ onBack }: { onBack: () => void }) => {
  // 状态：0 进行 1 暂停
  // 行为：2 开始播放 3 继续播放 4 停止播放 5 暂停播放
  // 行为决定了状态改变
  const [status, setStatus] = useState(0);
  const [time, setTime] = useState('00:00');

  // const startPlayer = () => {
  //   //2 开始播放
  //   setTime('00:00');
  //   setStatus(0); //0 进行
  //   setAction(2);
  //   videoCtrl(VIDEOSTART);
  //   // setIsTimerRunning(true);
  // };
  const resumePlayer = () => {
    //3 继续播放
    setStatus(0); //0 进行
    videoCtrl(VIDEORESUME);
    // setIsTimerRunning(true);
  };
  const pausePlayer = () => {
    //5 暂停播放
    setStatus(1); // 1 暂停
    videoCtrl(VIDEOPAUSE);
    // setIsTimerRunning(false);
  };
  const stopPlayer = () => {
    //4 停止播放
    // setStatus(-1); // -1 停止
    videoCtrl(VIDEOSTOP);
    // setIsTimerRunning(false);
    onBack();
  };

  useEffect(() => {
    // chrome.runtime.sendMessage({ action: GETVIDEOSTATUS }, function (response) {
    //   const { videostatus, timer } = response;
    //   setStatus(videostatus);
    // });
    chrome.storage.local.get('videostatus').then((res) => {
      if (res.videostatus && res.videostatus !== 0) {
        setStatus(res.videostatus);
      }
    });
    chrome.action.getBadgeText({}).then((result) => {
      if (result) {
        setTime(result);
      }
    });
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'recordTime') {
        setTime(msg.data.formattedTime);
      }
    });
  }, []);

  // useEffect(() => {
  //   let postMessageInterval;

  //   if (isTimerRunning) {
  //     postMessageInterval = setInterval(async () => {
  //       const response = await chrome.action.getBadgeText({});
  //       setTime(response || '00:00');
  //     }, 300);
  //   } else {
  //     clearInterval(postMessageInterval);
  //   }

  //   return () => clearInterval(postMessageInterval);
  // }, [isTimerRunning]);

  useEffect(() => {
    chrome.storage.local.set({ videostatus: status });

    //  -1 停止  0 进行 1 暂停
    // (async () => {
    //   chrome.storage.sync.get(['videostatus'], (items) => {
    //     console.log(items);
    //   });

    //   if (status === -1) {
    //     setIsTimerRunning(false);
    //   } else if (status === 0) {
    //     setIsTimerRunning(true);
    //   } else if (status === 1) {
    //     setIsTimerRunning(false);
    //   } else if (status === -2) {
    //     const items = await chrome.storage.sync.set({
    //       videostatus: 0,
    //     });

    //     await startPlayer();
    //   }
    //   const result = await chrome.action.getBadgeText({});
    //   setTime(result || '00:00');
    // })();

    //  -1 停止  0 进行 1 暂停
    // chrome.runtime.sendMessage({ action: VIDEOSTATUS, status, action }, (response) => {
    //   console.log(response);
    // });
  }, [status]);

  return (
    <div className={Style.VideoPlayer}>
      {/* -1 停止  0 进行 1 暂停 */}
      <div className={Style.videoTips}>
        {/* {status} */}
        {status === 0 && '录制中...'}
        {status === 1 && '暂停录制'}
        {/* {status === -1 && (
          <span onClick={onBack} style={{ float: 'right', fontSize: '12px' }}>
            返回
          </span>
        )} */}
      </div>
      <div className={Style.videoTime}>{time}</div>
      <div className={Style.videoCtrl}>
        {status === 0 && (
          <div className={Style.videoLeft} onClick={pausePlayer}>
            暂停
          </div>
        )}
        {status === 1 && (
          <div className={Style.videoLeft} onClick={resumePlayer}>
            继续
          </div>
        )}
        <div className={Style.videoRight} onClick={stopPlayer}>
          <i></i>停止录制
        </div>
      </div>
      {/* {status === -1 && (
        <div className={Style.videoCtrl}>
          <div className={`${Style.videoRight} ${Style.play}`} onClick={() => startPlayer()}>
            <i></i>开始录制
          </div>
        </div>
      )}
      {status === 1 && (
        <div className={Style.videoCtrl}>
          <div className={`${Style.videoRight} ${Style.play}`} onClick={() => resumePlayer()}>
            <i></i>继续录制
          </div>
        </div>
      )} */}
    </div>
  );
});

export default VideoPlayer;
