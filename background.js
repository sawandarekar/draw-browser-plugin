chrome.runtime.onInstalled.addListener(() => {
  console.log('Drawing Extension installed');
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.startsWith('http')) {
    // Inject the content script
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(err => console.log('Script injection failed:', err));
  }
});
