# GPT-Log

## Description

This Chrome extension asynchronously reads the active chat log through a content script, processes it, and saves it as a local Chrome variable. It also enables the popup to call the service worker, request the saved messages, process the HTML received, and display it.

## How to Install

1. Download the ZIP file of the extension from the GitHub repository.
2. Unzip the file to your desired location.
3. Open Chrome and navigate to `chrome://extensions/`.
4. Enable Developer Mode by toggling the switch at the top right.
5. Click on "Load unpacked" and select the unzipped extension folder. Make sure the folder contains `Manifest.json`.
6. The extension is now installed and should be visible in your extensions list.

## Content Script

The content script gathers chat logs through scroll actions, clicks, and initial loading (500ms delay). It extracts HTML content, processes it - stripping attributes and removes some tags (SVG & buttons), and sends the processed data to the service worker.

### Listeners:

- **Throttled Scroll Event Listener:** Activated every 400ms to efficiently capture new messages.
- **Click Event Listener:** Captures chat logs that are loaded as a result of user interactions.

### Data Structure Example:

```json
{
  "Messages": [
    {
      "sender": "John Doe",
      "message": "<div><h2>Hello, World!</h2></div>"
    }
  ]
}
```

## Service Worker:

- **Listen for Content Script:** The service worker listens for messages from the content script, receiving and storing the chat logs as a local variable. It's important to manage these messages efficiently to ensure the extension remains responsive.

- **Listen for Popup Requests:** Upon a request from the popup, the service worker sends the stored chat logs. This interaction is crucial for displaying the processed logs to the user in real-time.

## Popup

The popup script is tasked with displaying the processed chat logs. It employs a self-update mechanism to refresh the displayed content, ensuring users have access to the most recent messages.

### Function:

- **Self-Update:** The popup automatically updates the displayed chat logs every 10 seconds, ensuring that the information is always current.

- **OnLoadUpdate:** Immediately upon opening, the popup fetches and displays the latest chat logs, providing instant access to the information.

- **Double Fetch:** This mechanism is implemented to ensure the integrity and freshness of the data being displayed, making two consecutive requests if necessary to obtain the most up-to-date information.

### Display Cases:

The popup can render a variety of content types to ensure that the chat logs are presented in a user-friendly manner. These include:

- **Text (Paragraph):** For plain text messages.
- **Code (Preformatted Text):** To display code snippets or preformatted text.
- **Table:** For information presented in tabular form.
- **List (Bullet Points):** To display unordered lists.
- **List (Numbered):** For ordered lists.
- **Mathematical Equations:** Displaying complex formulas or equations.
- **ASCII Art (Preformatted Text):** For art and designs made using ASCII characters.
- **Links:** Hyperlinks to external resources.
- **Citations:** For quoted or referenced material.

## Future Scope

This section outlines potential areas of improvement and expansion for the extension. Our roadmap includes:

- **Content Script Double Listener:** Implementing a more robust listening strategy in the content script to enhance data capture capabilities.

- **Error Log Improvements:** I plan to improve error logging and debugging to make the extension more reliable and easier to maintain.

- **DALL-E Integration:** Exploring the possibility of integrating with DALL-E chats to enhance the usability of the extension.

- **Message Size:** Future versions will have a big focus on managing the message sizes and timings to ensure quick and efficient functioning.

