import { GETINDEXEDDB, SET_PAGE_ENV } from '@/utils/enum';

export default function initMessage() {
  window.addEventListener('message', async (e) => {
    //@ts-ignore
    // console.log(e.detail); // 'hi'
    if (e.data) {
      console.log('received message =>', e.data);
      const { type, data } = e.data;
      if (type === 'ZA_PAGE_AUDIT_IMG_PING') {
        // 用于页面取截图
        chrome.runtime.sendMessage({ action: GETINDEXEDDB, data }, (response) => {
          window.postMessage({ type: 'ZA_PAGE_AUDIT_IMG_PANG', data: response });
          return true;
        });
      } else if (type === 'ZA_PAGE_AUDIT_SET_ENV') {
        // data: { origin: '截图页面的origin', sysOrigin: '后管系统origin', extra: Record<string, string | number>}
        chrome.runtime.sendMessage({ action: SET_PAGE_ENV, data });
      }
    }
  });
  // window.dispatchEvent(new CustomEvent('message', { detail: 'hello' }));
}
