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
  let scrollInterval = null;
  let scrollCount = 1;
  const goToNextUrl = () => {
    // clearInterval(scrollInterval);
    scrollCount = 1;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      i = i >= urls.length ? 0 : i;
      const url = urls[i++];
      console.log("next url", url);
      const tab = tabs[0];
      chrome.tabs.update(tab.id, { url }, () => {
        // setTimeout(() => {
        // alert("BEFORE SCRIPTING!");
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: function () {
            const initiateScroll = () => {
              alert("SCROLL almost initiated!");
              const doScroll = () => {
                alert("BEFORE SCROLL!");
                const newTop =
                  (document.documentElement.clientHeight - 300) * scrollCount;
                const top = Math.min(newTop, document.body.scrollHeight);
                window.scrollTo({ left: 0, top, behavior: "smooth" });
                scrollCount++;
              };
              scrollInterval = setInterval(doScroll, 5000);
              alert("SCROLL initiated!");
            };
            debugger;
            setTimeout(initiateScroll, 5000);
            alert("AFTER TIMEOUT!");
          },
        });
        // .then(() => {
        //   alert("SCRIPTING DONE!");
        // });
        // }, 1000);
      });
    });
  };
  interval = setInterval(goToNextUrl, request.rotateInterval);
  goToNextUrl();
});
