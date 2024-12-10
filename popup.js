chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: extractTextFromWikipedia
    }, (result) => {
        const summary = result[0].result;
        document.getElementById('summary-content').textContent = summary;
    });
});
