
let EXT_SWITCH = true;

chrome.storage.sync.get('globalOnOffSwitch', ({globalOnOffSwitch}) => {
  EXT_SWITCH = globalOnOffSwitch ?? true;
});

chrome.storage.onChanged.addListener((changes, _) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'globalOnOffSwitch') {
      EXT_SWITCH = newValue;
    }
  }
});

/* CONNECTION */

const WS_IP = 'localhost';
const WS_PORT = 40022;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeWSConnection = async () => {
  const ws = new WebSocket(`ws://${WS_IP}:${WS_PORT}/`);
  ws.onopen = e => console.log(`Connected to ${e.target.url}`);
  ws.onclose = e => console.log(`Disconnected from ${e.target.url}`);

  while (ws.readyState != WebSocket.OPEN)
    await sleep(5);

  return ws
}

let WS = (async () => await makeWSConnection())();

const sendToOpener = async cmd => {
	if (WS.readystate != WebSocket.OPEN)
    WS = await makeWSConnection();
	WS.send(cmd);
}

/* URL INTERCEPTION */

const URLS = [
	"*://*.youtube.com/watch*"
];

const interceptLink = details => {
  if (!EXT_SWITCH)
    return {};

  try {
	  console.log(details);
	  sendToOpener(`mpv '${details.url}'`);
  }
  catch (e) {
    console.error(e);
  }
  finally {
	  return {redirectUrl: 'javascript:'};
  }
}

chrome.webRequest.onBeforeRequest.addListener(
	interceptLink,
	{
		urls: URLS,
		types: ['main_frame']
	},
  ["blocking", "requestBody"]
);