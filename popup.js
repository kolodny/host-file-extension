const hosts = document.getElementById('hosts');
const backgroundPage = chrome.extension.getBackgroundPage();

hosts.value = backgroundPage.localStorage.hosts || '';
hosts.focus();
hosts.oninput = () => backgroundPage.setHosts(hosts.value);
