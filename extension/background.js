chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, "toggleTray");
});
// Engine ends
