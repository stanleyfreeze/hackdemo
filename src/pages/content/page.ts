let fixedElements_: [string, HTMLElement][] = [];

function decidePositionOfFixedElement(elem: HTMLElement) {
  var docElement = document.documentElement;
  var viewPortHeight = docElement.clientHeight;
  var offsetTop = elem.offsetTop;
  var result: string = '';

  // 简单粗暴，左上角在中轴以上的归为第一页
  // 以下的归于最后一页
  if (offsetTop <= viewPortHeight / 2) {
    result = 'top';
  } else {
    result = 'bottom';
  }

  return result;
}

function restoreFixedElements(position?: string) {
  const fn = (item: [string, HTMLElement]) => {
    item[1].style.visibility = 'visible';
    item[1].classList.remove('za_page_audit_hide');
  };
  if (position) {
    fixedElements_.filter((item) => item[0] === position).forEach(fn);
  } else {
    fixedElements_.forEach(fn);
    fixedElements_ = [];
  }
}

function isVisibleFixedElement(ele: HTMLElement) {
  var nodeComputedStyle = window.getComputedStyle(ele as HTMLElement);
  // Skip nodes which don't have computeStyle or are invisible.
  if (
    nodeComputedStyle &&
    nodeComputedStyle.position == 'fixed' &&
    nodeComputedStyle.display != 'none' &&
    nodeComputedStyle.visibility != 'hidden'
  ) {
    return true;
  }
  return false;
}

// Handle fixed-position elements for capture.
function handleFixedElements(capturePosition: string) {
  var docElement = document.documentElement;
  var body = document.body;

  // If page has no scroll bar, then return directly.
  if (docElement.clientHeight == body.scrollHeight && docElement.clientWidth == body.scrollWidth) {
    return;
  }

  var nodeIterator = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT, null);
  var currentNode: HTMLElement;
  while ((currentNode = nodeIterator.nextNode() as HTMLElement)) {
    if (isVisibleFixedElement(currentNode as HTMLElement)) {
      var position = decidePositionOfFixedElement(currentNode);
      if (position && position != capturePosition) {
        currentNode.style.visibility = 'hidden';
        currentNode.classList.add('za_page_audit_hide');
        fixedElements_.push([position, currentNode]);
      }
    }
  }
}

export default {
  handleFixedElements,
  restoreFixedElements,
};
