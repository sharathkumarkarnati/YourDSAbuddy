// Background service worker for Your DSA Buddy Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Your DSA Buddy extension installed successfully!');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openBuddyPopup') {
        // Open the popup programmatically
        chrome.action.openPopup();
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // Only open popup on LeetCode pages
    if (tab.url && tab.url.includes('leetcode.com')) {
        chrome.action.openPopup();
    } else {
        // Show notification for non-LeetCode pages
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Your DSA Buddy',
            message: 'This extension works best on LeetCode.com!'
        });
    }
});

// Handle tab updates to show/hide extension icon
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (tab.url.includes('leetcode.com')) {
            // Enable extension on LeetCode pages
            chrome.action.enable(tabId);
        } else {
            // Disable extension on non-LeetCode pages
            chrome.action.disable(tabId);
        }
    }
});

// Handle storage for user preferences
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        console.log('Storage changed:', changes);
    }
});

// Initialize default settings
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get(['apiKey', 'preferredLanguage'], (result) => {
        if (!result.apiKey) {
            // Set default language if not set
            if (!result.preferredLanguage) {
                chrome.storage.sync.set({ preferredLanguage: 'python' });
            }
        }
    });
}); 