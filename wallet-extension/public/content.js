// the content.js script is responsible for injecting the `injection.js` into the document page
// and forwarding messages between the document page and the background script

const script = document.createElement("script");
script.src = chrome.runtime.getURL("injection.js");
script.type = "module";
document.head.prepend(script);

// Listen for messages directly from the document page
document.addEventListener("stackswallet_request", (event) => {
  // Forward message to the background script
  console.log("[StacksWallet] Received request from document page:", event.detail);

  chrome.runtime.sendMessage(event.detail);
});

// Listen for messages directly from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.jsonrpc === "2.0") {
    window.postMessage(message, window.location.origin);
  }
});
