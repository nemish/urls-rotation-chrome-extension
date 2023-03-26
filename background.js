let interval = null;
let i = 0;
let urls = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("got message", request, interval);

  if (request.stopRotation) {
    console.log("clearing interval", interval);
    i = 0;
    urls = [];
    sendResponse({ message: "stop rotation success" });
    clearInterval(interval);
    return;
  }

  if (request.urls) {
    console.log("request urls", request.urls, request.rotateInterval);
    urls = request.urls;
  }

  if (interval) {
    console.log("clearing interval", interval);
    clearInterval(interval);
  }

  sendResponse({ message: "rotation started" });
  const goToNextUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      i = i >= urls.length ? 0 : i;
      const url = urls[i++];
      console.log("next url", url);
      const tab = tabs[0];
      chrome.tabs.update(tab.id, { url });
    });
  };
  interval = setInterval(goToNextUrl, request.rotateInterval);
  goToNextUrl();
});
