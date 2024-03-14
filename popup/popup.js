function displayMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    const senderSpan = document.createElement('span');
    senderSpan.classList.add('sender');
    senderSpan.textContent = sender + ':';

    const messageHtml = document.createElement('div');
    messageHtml.classList.add('message-html');

    const cleanedMessage = cleanMessageHTML(message);

    messageHtml.innerHTML = cleanedMessage;

    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(messageHtml);

    container.appendChild(messageDiv);
}

function cleanMessageHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  function processElement(element) {
    if (element.tagName.toLowerCase() === 'svg') {
      element.parentNode.removeChild(element);
      return;
    }

    if (element.tagName.toLowerCase() === 'div') {
      while (element.attributes.length > 0) {
        element.removeAttribute(element.attributes[0].name);
      }
    }

    const children = [].slice.call(element.childNodes);
    children.forEach(child => {
      if (child.nodeType === 1) {
        processElement(child);
      }
    });
  }

  processElement(doc.body);

  return doc.body.innerHTML;
}


document.getElementById('fetchMessages').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "fetchMessages"}, function(response) {
            console.log(response.messages);


            const container = document.getElementById('container');
            container.innerHTML = '';

            response.messages.forEach(msg => displayMessage(msg.sender, msg.message));

            container.scrollTop = container.scrollHeight;
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "fetchMessages"}, function(response) {
            if (response && response.messages) {
                console.log(response.messages);

                const container = document.getElementById('container');
                container.innerHTML = '';

                response.messages.forEach(msg => displayMessage(msg.sender, msg.message));

                // container.scrollTop = container.scrollHeight;
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                  });
            }
        });
    });
});


