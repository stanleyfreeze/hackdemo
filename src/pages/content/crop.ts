import { TSection } from './types';

export function appendElement(parent: HTMLElement, className: string, tag?: string) {
  const div = document.createElement(tag || 'div');
  div.className = className;
  parent.appendChild(div);
  return div;
}

const isTouchDevice = /android|iphone|ipad/i.test(navigator.userAgent);

export function prepareCropElements({ onOk }: { onOk: (e: TSection) => any }) {
  const existMask = document.querySelector('.za_page_audit_mask');
  if (existMask) return;

  let startX: number, startY: number, top: number, left: number, width: number, height: number;
  let isMouseDown: boolean, target: string | undefined;

  const handleMouseDown = (e: any, _target?: string) => {
    if (_target === 'rb') {
      startX = left;
      startY = top;
    } else if (_target === 'rt') {
      startX = left;
      startY = top + height;
    } else if (_target === 'lt') {
      startX = left + width;
      startY = top + height;
    } else if (_target === 'lb') {
      startX = left + width;
      startY = top;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
    isMouseDown = true;
    target = _target;
    e.stopPropagation();
  };

  const root = appendElement(document.body, 'za_page_audit_mask');
  const crop = appendElement(root, 'za_page_audit_crop');
  const btnBox = appendElement(root, 'za_page_audit_btn');
  const btnCancel = appendElement(btnBox, '', 'img') as HTMLImageElement;
  btnCancel.src = chrome.runtime.getURL('images/cancel.png');
  const btnReset = appendElement(btnBox, '', 'img') as HTMLImageElement;
  btnReset.src = chrome.runtime.getURL('images/reset.png');
  const btnOk = appendElement(btnBox, '', 'img') as HTMLImageElement;
  btnOk.src = chrome.runtime.getURL('images/ok.png');
  const $size = appendElement(root, 'za_page_audit_size');
  const $tip = appendElement(root, 'za_page_audit_tip');

  const corners = ['lt', 'lb', 'rt', 'rb'].map((item) => {
    const div = appendElement(crop, 'za_page_audit_r ' + item);
    div.addEventListener('pointerdown', function (e) {
      handleMouseDown(e, item);
    });
    div.addEventListener('click', () => {});
    return div;
  });

  crop.addEventListener('pointerdown', function (e) {
    handleMouseDown(e, 'move');
  });

  root.addEventListener('pointerdown', (e) => {
    handleMouseDown(e);
    $tip.style.display = 'none';
  });

  root.addEventListener(isTouchDevice ? 'touchmove' : 'pointermove', function (e: any) {
    if (isMouseDown) {
      const eventTarget = e.touches ? e.touches[0] : e;
      const currentX = eventTarget.clientX;
      const currentY = eventTarget.clientY;
      const deltX = currentX - startX;
      const deltY = currentY - startY;
      if (target === 'move') {
        crop.style.top = top + deltY + 'px';
        crop.style.left = left + deltX + 'px';
      } else {
        const _startX = currentX < startX ? currentX : startX;
        const _startY = currentY < startY ? currentY : startY;
        crop.style.left = _startX + 'px';
        crop.style.top = _startY + 'px';
        crop.style.width = Math.abs(deltX) + 'px';
        crop.style.height = Math.abs(deltY) + 'px';
      }

      $size.innerText = `${parseInt(crop.style.width)} X ${parseInt(crop.style.height)}`;
      $size.style.left = crop.style.left;
      $size.style.top = crop.style.top;
      $size.style.display = 'block';

      let rbTop = parseInt($size.style.top) + parseInt(crop.style.height);
      if (parseInt($size.style.top) < 30) {
        $size.style.top = rbTop + 40 + 'px';
      }

      btnBox.style.display = 'none';
      btnBox.style.left = crop.style.left;
      btnBox.style.top = rbTop + 'px';

      if (!target) {
        corners.forEach((ele) => {
          ele.style.display = 'none';
        });
      }
    }
    e.stopPropagation();
    e.preventDefault();
  });

  root.addEventListener('pointerup', function (e) {
    isMouseDown = false;
    target = '';
    width = parseInt(crop.style.width) || 0;
    height = parseInt(crop.style.height) || 0;
    top = parseInt(crop.style.top) || 0;
    left = parseInt(crop.style.left) || 0;
    if (width) {
      btnBox.style.display = 'block';
      corners.forEach((ele) => {
        ele.style.display = 'block';
      });
    } else {
      destroy();
    }
    e.stopPropagation();
  });

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      destroy();
    } else if (e.code === 'Enter') {
      hanleOk();
    }
  };

  const destroy = () => {
    root.remove();
    window.removeEventListener('keyup', onKeyUp);
  };

  const hanleOk = () => {
    destroy();
    setTimeout(() => {
      onOk({ x: left, y: top, width, height });
    }, 0);
  };

  btnCancel.addEventListener('click', destroy);
  btnOk.addEventListener('click', hanleOk);
  btnReset.addEventListener('click', function (e) {
    crop.style.top = '';
    crop.style.left = '';
    crop.style.width = '';
    crop.style.height = '';
    btnBox.style.display = 'none';
    $size.style.display = 'none';
  });

  window.addEventListener('keyup', onKeyUp);
}
