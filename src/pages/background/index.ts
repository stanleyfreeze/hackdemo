import {
  CAPTURE_IMG,
  NEWTABLE,
  POPSTATUS,
  CAPTURE_SECTION_DONE,
  VIDEOSTART,
  VIDEOSTOP,
  RECORDER,
  VIDEOSTATUS,
  GETPOPSTATUS,
  VIDEORESUME,
  VIDEOPAUSE,
  GETVIDEOTIMER,
  GETVIDEOSTATUS,
  GETINDEXEDDB,
  SET_PAGE_ENV,
} from '@/utils/enum';
import { Timer, actionIconWhitelist } from '@/utils';
import { sleep } from '../content/capture';

let globalCurrentWindowId: number | undefined;
let currentTabId: number | undefined;
let receiverTabId: number;
let videostatus: number = 0;
let popstatus: number = 1;
let currentTimer: string;

// chrome.storage.sync.get(
//   {
//     favoriteColor: "red",
//     likesColor: true,
//   },
//   (items) => {
//     setColor(items.favoriteColor);
//     setLike(items.likesColor);
//   }
// );

// (async () => {
//   const items = await chrome.storage.sync.set({
//     videostatus: 0,
//     popstatus: 1,
//   });
// })();

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const timerInstance = new Timer((formattedTime: string) => {
  currentTimer = formattedTime;
  chrome.action.setBadgeText({ text: formattedTime });
  chrome.runtime.sendMessage({ type: 'recordTime', data: { formattedTime } });
  // const items = await chrome.storage.sync.set({ currentTimer: formattedTime })
});

chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
//@ts-ignore
chrome.action.setBadgeTextColor({ color: '#FFFFFF' });

const timer: any = timerInstance;

// (async () => {
//   timer = await countTimer();
// })();

function getSubdomain(url: string): string {
  const hostname = new URL(url).hostname;
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  return hostname;
}

function checkPageSubdomain(url?: string) {
  if (url) {
    const currentPageSubdomain = getSubdomain(url);
    const isWhitelisted =
      actionIconWhitelist.includes(currentPageSubdomain) &&
      !url.startsWith('chrome://') &&
      !url.startsWith('chrome-extension://');

    if (isWhitelisted) {
      chrome.action.setIcon({ path: chrome.runtime.getURL('icon16.png') });
      chrome.action.enable();
    } else {
      chrome.action.setIcon({ path: chrome.runtime.getURL('icon_disable.png') });
      chrome.action.disable();
    }
  }
}

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     checkPageSubdomain(tab.url);
//   }
// });

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   const tabId = activeInfo.tabId;
//   chrome.tabs.get(tabId, (tab) => {
//     checkPageSubdomain(tab.url);
//   });
// });

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log('[Background]', 'Receive message = ', msg.action, msg);
  if (msg.action === CAPTURE_IMG) {
    chrome.tabs.captureVisibleTab({ format: 'jpeg', quality: 100 }).then(function (dataURI: string) {
      sendResponse({ dataURI });
    });
    return true;
  } else if (msg.action === NEWTABLE) {
    (async () => {
      const { data } = msg;
      const originTab = await getCurrentTab();
      let errorMsg = '';
      const envMap = await chrome.storage.local.get(data.origin as string);
      let env = envMap?.[data.origin as string] || {};
      if (!env.sysOrigin) errorMsg = '未知来源';
      const sysOrigin = env.sysOrigin || 'http://206764-wjs-page-audit.test.za.biz';
      let url = `${sysOrigin}/imageReceive?dataId=${data.dataId}&originTab=${originTab.id}`;
      if (env.extra) {
        Object.keys(env.extra).forEach((key) => {
          url += `&${key}=${encodeURIComponent(env.extra[key])}`;
        });
      }
      if (errorMsg) {
        url += `&errorMsg=${encodeURIComponent(errorMsg)}`;
      }
      chrome.tabs.create({ url }, function (win) {
        console.log('newtab successful');
      });
    })();
  } else if (msg.action === GETINDEXEDDB) {
    const data = msg.data;
    chrome.tabs.sendMessage(
      parseInt(data.originTab as string),
      { action: GETINDEXEDDB, dataId: data.dataId },
      (response) => {
        sendResponse(response);
      },
    );
    return true;
  } else if (msg.action === SET_PAGE_ENV) {
    const data = msg.data;
    chrome.storage.local.set({ [data.origin]: data });
  } else if (msg.action === VIDEOSTART) {
    (async () => {
      const currentWindow = await chrome.windows.getCurrent();
      // videostatus = 1
      timer.reset();
      timer.start();
      // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      // currentTabId = tab.id
      currentTabId = msg.tabId;
      if (currentTabId) {
        const { tabs, id } = await chrome.windows.create({
          url: chrome.runtime.getURL('receiver.html'),
          focused: false,
          // state: 'minimized',
          width: 10,
          height: 10,
          left: 0,
          top: 0,
          type: 'popup',
        });
        globalCurrentWindowId = id;
        await chrome.windows.onRemoved.addListener(async (windowId) => {
          if (windowId === globalCurrentWindowId) {
            timer.stop();
            await chrome.action.setBadgeText({ text: '' });
          }
        });
        await chrome.windows.onFocusChanged.addListener(async (windowId) => {
          if (windowId === globalCurrentWindowId) {
            await chrome.windows.update(windowId, { focused: false, state: 'minimized' });
          }
        });

        if (tabs && tabs[0].id) {
          receiverTabId = tabs[0].id;
        }

        // Wait for the receiver tab to load
        await new Promise((resolve) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === receiverTabId && info.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);
              resolve('load complete');
            }
          });
        });

        if (receiverTabId) {
          chrome.tabs.sendMessage(receiverTabId, {
            action: VIDEOSTART,
            targetTabId: currentTabId,
            consumerTabId: receiverTabId,
            windowId: id,
          });
        }
      }
    })();
    return true;
  } else if (msg.action === CAPTURE_SECTION_DONE) {
    (async () => {
      chrome.runtime.sendMessage({ action: NEWTABLE, dataId: msg.dataId });
    })();
    return true;
  }
  // else if (msg.action === RECORDER) {
  //   (async () => {
  //     chrome.scripting.executeScript({
  //       target: { tabId: msg.tabId },
  //       func: () => {
  //         chrome.devtools.inspectedWindow.eval('chrome.devtools.recorder.record()');
  //         // 执行开始录制操作
  //       },
  //     });
  //   })();
  //   return true;
  // }
  else if (msg.action === VIDEOSTOP) {
    (async () => {
      timer.stop();
      await chrome.action.setBadgeText({ text: '' });
      const response =
        receiverTabId &&
        (await chrome.tabs.sendMessage(receiverTabId, {
          action: VIDEOSTOP,
        }));
      console.log(response);
      globalCurrentWindowId && (await chrome.windows.remove(globalCurrentWindowId));
    })();
    return true;
  }
  // else if (msg.action === POPSTATUS) {
  //   (async () => {
  //     const items = await chrome.storage.sync.set({
  //       popstatus: msg.status,
  //     });
  //     sendResponse(msg.status);
  //   })();
  //   return true;
  // }
  // else if (msg.action === VIDEOSTATUS) {
  //   (async () => {
  //     const items = await chrome.storage.sync.set({
  //       videostatus: msg.status,
  //     });
  //     sendResponse(msg.status);
  //   })();
  //   return true;
  // }
  // else if (msg.action === GETVIDEOSTATUS) {
  //   (async () => {
  //     const items = await chrome.storage.sync.get(['videostatus']);
  //     sendResponse({ videostatus: items.videostatus, timer: timerInstance.currentTime });
  //   })();
  //   // sendResponse({videostatus, timer: timerInstance.currentTime})
  //   return true;
  // }
  // else if (msg.action === GETPOPSTATUS) {
  //   (async () => {
  //     const items = await chrome.storage.sync.get(['popstatus']);
  //     sendResponse(items.popstatus);
  //   })();
  //   // sendResponse(popstatus)
  //   return true;
  // }
  else if (msg.action === VIDEORESUME) {
    timerInstance.start();
    sendResponse('RESUME');
    return true;
  } else if (msg.action === VIDEOPAUSE) {
    timerInstance.pause();
    sendResponse('PAUSE');
    return true;
  }
  // else if (msg.action === GETVIDEOTIMER) {
  //   sendResponse(timerInstance.currentTime);
  //   return true;
  // }
});
