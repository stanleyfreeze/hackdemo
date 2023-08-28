import { CAPTURE_IMG } from '../../utils/enum';
import { TSection, IImageItem } from './types';
import page from './page';

let __forceStopCapture = false;

export const captureCurrentVisibleContent = () => {
  return new Promise<string>((resolve) => {
    chrome.runtime.sendMessage({ action: CAPTURE_IMG }, function (response) {
      resolve(response.dataURI);
    });
  });
};

export const sleep = function (time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const stopCapture = () => {
  __forceStopCapture = true;
};

export const doCapture = async ({ onProgress }: { onProgress: (current: number, total: number) => void }) => {
  // const transformDefault = document.body.style.transform;
  // const oldPaddingBottom = document.body.style.paddingBottom;
  // const oldBodyClassName = document.body.className;
  const oldScrollTop = window.scrollY;
  __forceStopCapture = false;

  // document.body.style.transform = 'translate3d(0px, 0px, 0px)';
  document.body.classList.add('___no-scroll-bar');

  onProgress(0, 1);

  window.scrollTo(0, 0);
  await sleep(500); // 等待页面准备完成
  page.handleFixedElements('top');
  await sleep(100); // 等待页面准备完成

  const sampleDataURI = await captureCurrentVisibleContent();
  const imageLoader = createImage(sampleDataURI);
  const img = await imageLoader;

  const imageHeight = img.naturalHeight;
  const imageWidth = img.naturalWidth;
  const ratio = imageWidth / window.innerWidth;
  const visibleHeight = imageHeight / ratio; // 截取的宽高和实际宽高不一致

  console.log({
    imageWidth,
    imageHeight,
    visibleHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    ratio,
    scrollHeight: document.body.scrollHeight,
  });

  let imageCount = Math.ceil(document.body.scrollHeight / visibleHeight);

  const images: IImageItem[] = [
    {
      dataURI: sampleDataURI,
      width: imageWidth,
      height: imageHeight,
      offset: 0,
      ratio,
      imgLoader: imageLoader,
    },
  ];

  onProgress(1, imageCount);

  for (let i = 1; i < imageCount; i++) {
    if (__forceStopCapture) {
      onProgress(imageCount, imageCount);
      break;
    }
    const nextTop = visibleHeight * i + 1;
    window.scrollTo(0, nextTop);
    await sleep(500); // 等待页面准备完成
    if (i === imageCount - 1) {
      page.restoreFixedElements('bottom');
    } else {
      page.handleFixedElements('none');
    }
    await sleep(100); // 等待页面准备完成
    imageCount = Math.ceil(document.body.scrollHeight / visibleHeight); // 从新计算数量，并触发页面强制渲染

    const dataURI = await captureCurrentVisibleContent();
    images.push({
      dataURI,
      width: imageWidth,
      height: imageHeight,
      offset: 0,
      ratio,
      imgLoader: createImage(dataURI),
    });

    onProgress(i + 1, imageCount);
  }

  const deltTop = visibleHeight * images.length - document.body.scrollHeight;
  if (deltTop > 0) {
    images[images.length - 1].offset = deltTop * ratio;
  }

  console.log({
    imageCount,
    deltTop,
    scrollHeight: document.body.scrollHeight,
  });

  document.body.classList.remove('___no-scroll-bar');
  // document.body.className = oldBodyClassName;
  // document.body.style.paddingBottom = oldPaddingBottom;
  // document.body.style.transform = transformDefault;
  window.scrollTo(0, oldScrollTop);
  page.restoreFixedElements();

  return images;
};

export const createImage = function (dataURI: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = document.createElement('img');
    img.src = dataURI;
    img.onload = () => {
      resolve(img);
    };
  });
};

export const concatImages = async (images: IImageItem[]) => {
  const createImgTasks = images.map((item) => item.imgLoader);

  const imgs = await Promise.all(createImgTasks);
  const canvas = document.createElement('canvas');

  canvas.width = images[0].width;
  canvas.height = images[0].height * images.length - images[images.length - 1].offset;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    images.forEach((item, index) => {
      const img = imgs[index];
      const imgHeight = item.height - item.offset;
      // ctx.beginPath();
      // ctx.moveTo(0, item.height * index);
      // ctx.lineTo(img.width, item.height * index);
      // ctx.strokeStyle = 'red';
      // ctx.stroke();
      // ctx.closePath();
      ctx.drawImage(img, 0, item.offset, item.width, imgHeight, 0, item.height * index + 1, item.width, imgHeight);
    });
  }

  const dataURL = canvas.toDataURL();
  return dataURL;
};

export async function clipImage(dataURI: string, section: TSection) {
  const img = await createImage(dataURI);
  const canvas = document.createElement('canvas');

  const ratio = img.naturalWidth / window.innerWidth;

  const width = section.width * ratio;
  const height = section.height * ratio;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, section.x * ratio, section.y * ratio, width, height, 0, 0, width, height);

  return canvas.toDataURL('image/png', 1);
}
