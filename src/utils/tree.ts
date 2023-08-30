//@ts-nocheck
var array = [];
var allText = "责任"
function getText (str) {
    // let b = document.createElement('b')
    // b.innerText = str
    return str
}

function tree(dom) {
        if(dom.getElementsByTagName){
            var tags = dom.getElementsByTagName('*');
            for (var i = 0; i < tags.length; i++) {
                let nodeName = tags[i].nodeName.toLowerCase()
                if (nodeName != "SCRIPT" && nodeName != "STYLE" && nodeName != "TEXTAREA") {
                //过滤script、style和textarea标签
                    tags[i].childNodes.forEach((child, idx) => {
                        if (child.nodeType === 3) {
                            // child.dispatchEvent(et)
                            let result = child.nodeValue.indexOf(allText)
                            if (result >= 0) {
                                child.parentElement.style = 'border: 2px solid #f00;'
                            }
                        } else {
                            tree(child)
                        }
                    });
            }
        }
        
    }
}

// document.querySelector('a').addEventListener('click', function(event) {
//     event.preventDefault();
//   });
export default tree