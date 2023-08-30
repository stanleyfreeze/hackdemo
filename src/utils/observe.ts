//@ts-nocheck
import tree from './tree'
function observe (target: any) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('A child node has been added or removed.');
                debugger
                tree(mutation.target)
            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    let ob = observer.observe(target, {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: true
    });
}
export default observe