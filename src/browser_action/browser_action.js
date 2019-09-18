bulmaCalendar.attach('[type="date"]', {
  type: 'datetime',
  lang: 'en',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  minuteSteps: 1,
  showClearButton: false,
  validateLabel: 'Apply',
  todayLabel: 'Now',
  cancelLabel: 'Close'
});

const timeField = document.getElementById('time');
const sendButton = document.getElementById('send-button');
sendButton.addEventListener('click', (event) => {
  if (sendButton.disabled) {
    return;
  }

  const startTime = new Date(timeField.bulmaCalendar.startTime);
  const postAt = startTime.getTime() / 1000;
  const channel = document.getElementById('channel').value;
  const message = document.getElementById('message-text').value;

  if (!(channel.length > 1 && message.length > 0 && postAt > 0)) {
    console.log('Request data is invalid.');
    return;
  }

  chrome.storage.sync.get([
    "slackToken",
  ], (items) => {
    const token = items.slackToken ? items.slackToken : "";
    if (!token) {
      console.log('Slack token is emplty.');
      return;
    }

    scheduleMessage(token, channel, message, postAt);
  });
});

function scheduleMessage(token, channel, message, postAt) {
  sendButton.classList.add('is-loading');
  sendButton.disabled = true;
  fetch('https://slack.com/api/chat.scheduleMessage', {
    method: 'POST',
    body: JSON.stringify({
      channel: channel,
      post_at: postAt,
      text: message,
      link_names: true,
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token,
    }
  }).then(res => res.json())
    .then(response => {
      handleResponse(response);
    })
    .catch(error => {
      handleErrors(error);
    })
    .finally(() => {
      sendButton.classList.remove('is-loading');
    });
}

function handleResponse(response) {
  console.log(JSON.stringify(response));
  sendButton.classList.add('is-success');
  sendButton.innerHTML = '完了';
}

function handleError(error) {
  console.error(error);
  sendButton.classList.add('is-danger');
  sendButton.innerHTML = '失敗';
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  sendResponse(true);
});
