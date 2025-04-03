// optional: use the worker.js script to handle heavy computations using Worker API

self.onmessage = async function (message) {
  console.log("Worker thread received message: ", message.data);

  self.postMessage("Worker thread is working...");
};
