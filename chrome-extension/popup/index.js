
chrome.storage.sync.get('globalOnOffSwitch', ({globalOnOffSwitch}) => {
  document.getElementById('onOffSwitch').checked = globalOnOffSwitch ?? true;
});

document
  .getElementById('onOffSwitch')
  .addEventListener(
    'change',
    e => chrome.storage.sync.set({'globalOnOffSwitch': e.target.checked})
  );