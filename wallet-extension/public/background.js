// listens for messages from the extension popup script and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Send a response back to the sending script
  // sendResponse("Message received from the background script!");

  // verify sender info
  // console.log("Sender info:", sender);
  const originUrl = sender.origin ?? sender.url;
  if (!sender.tab?.id || !originUrl) {
    return console.error("Missing data from sender tab.");
  }

  openPopupConfirmation({ message, sender });
});

// opens a popup confirmation window which
// triggers the Confirmation.vue component to open
async function openPopupConfirmation({ message, sender }) {
  return new Promise((resolve) => {
    chrome.windows.getCurrent({ populate: false }, async (currentWindow) => {
      if (sender.tab.windowId !== currentWindow.id) {
        return console.error("Sender tab is not the current window.");
      }

      let params = new URLSearchParams({
        tabId: String(sender.tab.id ?? 0),
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
          // console.log("New window created:", newWindow);
        }
      );

      resolve(popupConfirmation);
    });
  });
}
