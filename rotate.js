const DEFAULT_URLS = [
  "http://www.example.com/",
  "https://google.com/",
  "https://www.youtube.com/",
];

const getInitialUrls = ({ urls }) => {
  if (!urls) {
    return DEFAULT_URLS;
  }
  return urls.split("\n");
};

const textArea = document.querySelector("#urls-list");
const button = document.querySelector("#submit-button");
const select = document.querySelector("#rotate-interval");

chrome.storage.sync.get("rotate-urls", (value) => {
  const urls = getInitialUrls({ urls: value["rotate-urls"] });
  textArea.value = urls.join("\n");
  console.log("Rotate urls are", urls);
});

let rotationInProcess = false;
chrome.storage.sync.get("rotate-in-process", (value) => {
  console.log("rotate in process", value);
  rotationInProcess = !!value["rotate-in-process"];
  if (rotationInProcess) {
    button.textContent = "Stop rotation";
    textArea.disabled = true;
    select.disabled = true;
  }
});

const ROTATION_INTERVALS_MAP = {
  "30sec": 30000,
  "1min": 60000,
  "3min": 180000,
  "5min": 300000,
  "10min": 600000,
};

button.addEventListener("click", () => {
  console.log("main action button clicked", textArea.value);

  const newUrls = textArea.value.split("\n");
  if (!newUrls.length) {
    return;
  }

  rotationInProcess = !rotationInProcess;
  textArea.disabled = rotationInProcess;
  select.disabled = rotationInProcess;

  if (rotationInProcess) {
    button.textContent = "Stop rotation";
    chrome.storage.sync.set({ "rotate-in-process": true });
    chrome.storage.sync.set({ "rotate-urls": textArea.value });
    chrome.storage.sync.set({ "rotate-interval": textArea.value });
    chrome.runtime.sendMessage(
      { urls: newUrls, rotateInterval: ROTATION_INTERVALS_MAP[select.value] },
      (response) => {
        console.log("urls response", response);
      }
    );
    window.close();
    return;
  }

  button.textContent = "Start rotation";
  chrome.storage.sync.set({ "rotate-in-process": false });
  chrome.runtime.sendMessage({ stopRotation: true }, (response) => {
    console.log("stop rotation response", response);
  });
});
