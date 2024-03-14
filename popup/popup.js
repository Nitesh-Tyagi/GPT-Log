// Function to display a single message in the popup.
// It creates HTML elements to show the sender and the cleaned message.
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

// Function to clean the HTML of a message.
// Removes unwanted tags and attributes to sanitize the content.
function cleanMessageHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  function processElement(element) {
    // Remove <svg> and <button> elements entirely.
    if (element.tagName.toLowerCase() === 'svg' || element.tagName.toLowerCase() === 'button') {
      element.parentNode.removeChild(element);
      return;
    }

    // Strip all attributes from <div> elements.
    if (element.tagName.toLowerCase() === 'div') {
      while (element.attributes.length > 0) {
        element.removeAttribute(element.attributes[0].name);
      }
    }

    // Process child elements recursively.
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

// Holds the last batch of fetched messages to detect changes.
let lastFetchedMessages = [];

// Function to request and fetch messages from the background script.
// If new messages are different from the last fetched ones, updates the display.
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

                // If new message is recieved, double fetch messages after 2 seconds.
                setTimeout(fetchMessages, 2000);
            }
        }
    });
}

// Initially fetch messages when the DOM content is fully loaded.
document.addEventListener('DOMContentLoaded', fetchMessages);

// Set up a repeating fetch every 10 seconds to keep the message display updated.
setInterval(fetchMessages, 10000);
