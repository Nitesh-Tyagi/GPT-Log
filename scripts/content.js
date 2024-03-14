console.log("CONTENT LOADED!");

function stripHtmlAttributes(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
  
    function processElement(element) {
      if (element.tagName.toLowerCase() === 'svg' || element.tagName.toLowerCase() === 'button') {
        element.parentNode.removeChild(element);
        return;
      }
  
      if (element.tagName.toLowerCase() === 'div') {
        while (element.attributes.length > 0) {
          element.removeAttribute(element.attributes[0].name);
        }
      }

      const children = Array.from(element.childNodes);
      children.forEach(child => {
        if (child.nodeType === 1) {
          processElement(child);
        }
      });
    }
  
    processElement(doc.body);
  
    return doc.body.innerHTML;
  }
  

function fetchMessages() {
    const div = document.querySelector('.flex.flex-col.text-sm.pb-9');
    let messages = [];

    if (div && div.children.length > 1) {
        for (let i = 1; i < div.children.length; i++) {
            try {
                let sender = "", message = "";
                // RUSHED, FIX LATER
                const senderElement = div.children[i].children[0]?.children[0]?.children[1]?.children[0];
                const messageElement = div.children[i].children[0]?.children[0]?.children[1]?.children[1];
                if (senderElement && messageElement) {
                    sender = senderElement.innerText;
                    message = messageElement.innerHTML;

                    const parsedMessage = stripHtmlAttributes(message);
                    messages.push({ sender: sender, message: parsedMessage });
                }
            } catch (error) {
                console.error('Error accessing nested elements for child ' + i + ':', error.message);
            }
        }
        console.log(messages);
    } else {
        console.log('NOT FOUND');
    }

    return messages;
}

document.addEventListener('click', function() {
    const messages = fetchMessages();

    chrome.runtime.sendMessage({action: "saveMessages", messages: messages}, function(response) {
        const url = window.location.href;
        const timestamp = new Date().toISOString();

        console.log("SAVED MESSAGES  ::  ",url,"  ::  ",timestamp);
    });
});

// const handleMutations = function(mutationsList, observer) {
//     var count = 0;
//     for(let mutation of mutationsList) {
//         if(mutation.type === 'childList' || mutation.type === 'attributes') {
//             count++;
//             break;
//         }
//     }
//     if(count > 0) {
//         console.log("OBSERVED : ",count);
//             const messages = fetchMessages();

//             chrome.runtime.sendMessage({action: "saveMessages", messages: messages}, function(response) {
//                 const url = window.location.href;
//                 const timestamp = new Date().toISOString();

//                 // console.log("SAVED MESSAGES  ::  ",url,"  ::  ",timestamp);
//                 // console.log(response);
//             });
//     }
// };

// const config = { attributes: true, childList: true, subtree: true };
// const observer = new MutationObserver(handleMutations);

const targetNode = document;

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

const throttledScrollListener = throttle(function(event) {
    console.log('SCROLL : ', event.target);

    const messages = fetchMessages();

    chrome.runtime.sendMessage({action: "saveMessages", messages: messages}, function(response) {
        const url = window.location.href;
        const timestamp = new Date().toISOString();
    });
}, 400); // THROTTLE 400

targetNode.addEventListener('scroll', throttledScrollListener, true);

setTimeout(function(){
    const messages = fetchMessages();
    chrome.runtime.sendMessage({action: "saveMessages", messages: messages}, function(response) {
        const url = window.location.href;
        const timestamp = new Date().toISOString();
    });
},500);
