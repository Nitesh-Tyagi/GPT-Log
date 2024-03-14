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
    if (element.tagName.toLowerCase() === 'svg' || element.tagName.toLowerCase() === 'button') {
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

let lastFetchedMessages = [];

function fetchMessages() {
    chrome.runtime.sendMessage({action: "fetchMessages"}, function(response) {
        if (response && response.messages) {
            console.log(response.messages);

            const isNewMessageDifferent = JSON.stringify(lastFetchedMessages) !== JSON.stringify(response.messages);
            
            lastFetchedMessages = response.messages;

            if (isNewMessageDifferent) {
                const container = document.getElementById('container');
                container.innerHTML = '';

                response.messages.forEach(msg => displayMessage(msg.sender, msg.message));

                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });

                setTimeout(fetchMessages, 2000);
            }
        }
    });
}

// document.getElementById('fetchMessages').addEventListener('click', fetchMessages);

document.addEventListener('DOMContentLoaded', fetchMessages);

setInterval(fetchMessages, 10000);
