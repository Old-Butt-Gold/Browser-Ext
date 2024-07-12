chrome.runtime.onMessage.addListener((request) => {
    if (request.language) {
        window.location.href = `https://translate.google.com/translate?hl=${request.language}&sl=auto&tl=${request.language}&u=${window.location.href}`;
    }
});