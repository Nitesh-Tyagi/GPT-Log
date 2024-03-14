chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "saveMessages") {
        console.log('Received messages:', request.messages);

        chrome.storage.local.set({'GPTLog_LastMessage': request.messages}, function() {
            const timestamp = new Date().toISOString();
            console.log('Data saved to GPTLog_LastMessage : ',timestamp);
        });

        sendResponse({status: "Success", detail: "Messages received and saved."});
    }

    return true;
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchMessages") {
        chrome.storage.local.get(['GPTLog_LastMessage'], function(result) {
            if (result.GPTLog_LastMessage) {
                sendResponse({status: "success", messages: result.GPTLog_LastMessage});
            } else {
                sendResponse({status: "error", messages: "No messages found."});
            }
        });
        return true; 
    }
});
