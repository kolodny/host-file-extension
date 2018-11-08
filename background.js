let hostsMap = {};

window.buildHostMap = () => {
  hostsMap = {};
  const lines = (localStorage.hosts || '')
    .split('\n')
    .map(l => l.replace(/#.*$/, '').trim())
    .filter(l => l)
  ;
  for (const line of lines) {
    const [ip, ...hostnames] = line.split(/\s+/);
    for (const hostname of hostnames) {
      const trimmedHostname = hostname.trim();
      if (trimmedHostname) {
        hostsMap[trimmedHostname] = ip;
      }
    }
  }
}

window.buildHostMap();

chrome.webRequest.onBeforeRequest.addListener(details => {
    const url = new URL(details.url);
    const redirect = hostsMap[url.hostname];
    if (redirect) {
      url.hostname = redirect;
      return {
        redirectUrl : url.toString(),
      };
    }
  },
  {
    urls : ["<all_urls>"]
  },
  ["blocking"]
);
