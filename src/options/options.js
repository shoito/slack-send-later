const applySlackOptions = () => {
  const slackToken = document.getElementById('slackToken').value;
  chrome.storage.sync.set({
    slackToken: slackToken
  }, () => {
    const button = document.getElementById('slackApply');
    button.classList.add("is-loading")
    setTimeout(() => {
      button.classList.remove("is-loading")
    }, 750);
  });
};

const restoreSlackOptions = () => {
  chrome.storage.sync.get([
    "slackToken",
  ], (items) => {
    document.getElementById('slackToken').value = items.slackToken ? items.slackToken : "";
  });
};

document.addEventListener('DOMContentLoaded', restoreSlackOptions);

document.getElementById('slackApply').addEventListener('click', applySlackOptions);