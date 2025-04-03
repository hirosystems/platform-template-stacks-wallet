// listen for connections from the content.js script
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "content<>background") {
    port.onMessage.addListener((message, port) => {
      // todo: handle the message from the content script

      // verify port info
      console.log("Port info:", port);
      const originUrl = port.sender?.origin ?? port.sender?.url;
      if (!port.sender?.tab?.id || !originUrl) {
        return console.error("Missing data from sender tab.");
      }

      // optional: send a message back to the content script
      // port.postMessage({ data: "background script received data!" });

      openPopupConfirmation({ message, port });
    });
  }
});

// opens a popup confirmation window which
// triggers the Confirmation.vue component to open
async function openPopupConfirmation({ message, port }) {
  return new Promise((resolve) => {
    chrome.windows.getCurrent({ populate: false }, async (currentWindow) => {
      console.log("Current window:", currentWindow);

      if (port.sender.tab.windowId !== currentWindow.id) {
        return console.error("Sender tab is not the current window.");
      }

      let params = new URLSearchParams({
        tabId: String(port.sender?.tab?.id ?? 0),
        payload: encodeURIComponent(JSON.stringify(message)),
      });

      const popupConfirmation = await chrome.windows.create(
        {
          url: chrome.runtime.getURL("../index.html") + `?${params.toString()}`,
          type: "popup",
          width: 390,
          height: 600,
          focused: true,
        },
        (newWindow) => {
          console.log("New window created:", newWindow);
        }
      );

      resolve(popupConfirmation);
    });
  });
}

// listens for messages from the extension popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle the message from the popup script
  console.log("Message from popup script:", message.data);

  // Send a response back to the popup script
  sendResponse({ data: "Hello from background script!" });

  return true;
});
