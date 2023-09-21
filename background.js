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
  let timeout = null;
  let scrollCount = 1;
  const goToNextUrl = () => {
    scrollCount = 1;
    clearTimeout(timeout);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      i = i >= urls.length ? 0 : i;
      const url = urls[i++];
      console.log("next url", url);
      const tab = tabs[0];
      chrome.tabs.update(tab.id, { url }, () => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          console.log("tab updated", tabId, info);
          if (info.status != "complete") {
            return;
          }
          chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              const scheduleScroll = () => {
                timeout = setTimeout(() => {
                  alert("INSIDE TIMEOUT");
                  const doScroll = () => {
                    alert("INSIDE SCROLL");
                    const newTop =
                      (document.documentElement.clientHeight - 300) *
                      scrollCount;
                    const top = Math.min(newTop, document.body.scrollHeight);
                    window.scrollTo({ left: 0, top, behavior: "smooth" });
                    scrollCount++;
                    scheduleScroll();
                  };
                  doScroll();
                }, 5000);
              };
              scheduleScroll();
            },
          });
        });
      });
    });
  };
  interval = setInterval(goToNextUrl, request.rotateInterval);
  goToNextUrl();
});
