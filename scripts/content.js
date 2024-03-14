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
                var sender = "", message = "";
                sender = div.children[i].children[0].children[0].children[1].children[0].innerText;
                message = div.children[i].children[0].children[0].children[1].children[1].innerHTML;

                var parsedMessage = "";
                parsedMessage = stripHtmlAttributes(message);

                messages.push({ sender: sender, message: parsedMessage });
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


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchMessages") {
      const messages = fetchMessages();
      sendResponse({messages: messages});
    }
    
    return true;
});