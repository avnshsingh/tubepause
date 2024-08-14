chrome.tabs.onActivated.addListener(async activeInfo => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url?.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(activeInfo.tabId, { action: "focus" });
  }

  // Pause video on other tabs
  const allTabs = await chrome.tabs.query({});
  allTabs.forEach(t => {
    if (t.id !== activeInfo.tabId && t.url?.includes("youtube.com/watch")) {
      chrome.tabs.sendMessage(t.id!, { action: "blur" });
    }
  });
});

chrome.windows.onFocusChanged.addListener(async windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // All Chrome windows are unfocused, pause all YouTube videos
    const allTabs = await chrome.tabs.query({ url: "*://www.youtube.com/*" });
    allTabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id!, { action: "blur" });
    });
  } else {
    // A Chrome window is focused, resume video in the active tab
    const [activeTab] = await chrome.tabs.query({ active: true, windowId });
    if (activeTab?.url?.includes("youtube.com/watch")) {
      chrome.tabs.sendMessage(activeTab.id!, { action: "focus" });
    }
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.includes("youtube.com/watch")
  ) {
    chrome.tabs.sendMessage(tabId, { action: "focus" });
  }
});

chrome.windows.onRemoved.addListener(async () => {
  // When a window is closed, pause all YouTube videos
  const allTabs = await chrome.tabs.query({ url: "*://www.youtube.com/*" });
  allTabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id!, { action: "blur" });
  });
});
