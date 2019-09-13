(() => {
  let slackToken = '';

  const now = new Date(),
      today = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map(d => d.toString().padStart(2, '0')).join('');

  chrome.storage.sync.get([
    "slackToken"
  ], (items) => {
    slackToken = items.slackToken;
  });

  console.log("injected.");
})();