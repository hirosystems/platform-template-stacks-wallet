// the content.js script is responsible for injecting the `injection.js` into the document page
// and forwarding messages between the document page and the background script

const script = document.createElement("script");
script.src = chrome.runtime.getURL("injection.js");
script.type = "module";
document.head.prepend(script);

// Create a connection to the background script with the name "content<>background"
const port = chrome.runtime.connect({ name: "content<>background" });

// Listen for messages directly from the extension popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.jsonrpc === "2.0") {
    window.postMessage(message, window.location.origin);
  }
});

// Listen for messages from the document page
document.addEventListener("laserwallet_request", (event) => {
  // Forward message to the background script
  port.postMessage(event.detail);

  return true;
});

// Listen for messages from the background script
port.onMessage.addListener((message) => {
  console.log("Message from background script back to content script:", message.data);
});
