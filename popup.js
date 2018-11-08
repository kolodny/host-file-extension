const hosts = document.getElementById('hosts');
const backgroundPage = chrome.extension.getBackgroundPage();

hosts.value = backgroundPage.localStorage.hosts || '';
hosts.focus();
hosts.oninput = () => {
  backgroundPage.hosts = hosts.value;
  backgroundPage.localStorage.hosts = hosts.value;
  backgroundPage.buildHostMap();
};
