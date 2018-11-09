let hostsMap;

function buildHostMap(hosts) {
  hostsMap = {};
  const lines = hosts
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
  setPacScript();
}

function setPacScript() {
  chrome.proxy.settings.set({
    value: {
      mode: 'pac_script',
      pacScript: {
        data: function() {
          const parser = /^((?<protocol>\w+):)?(\/\/((\w+)?(:(\w+))?@)?([^\/\?:]+)(:(?<port>\d+))?)/;
          const hostsMap = '@@'
          function FindProxyForURL(url, host) {
            if (hostsMap[host]) {
              let {protocol, port} = parser.exec(url).groups;
              if (!port) {
                port = protocol === 'https' ? 443 : 80;
              }
              return `PROXY ${hostsMap[host]}:${port}`;
            }
            return 'DIRECT';
          }
        }.toString().split('\n').slice(1, -1).join('\n').replace("'@@'", JSON.stringify(hostsMap)),
      },
    },
  });
}

window.setHosts = hosts => {
  localStorage.hosts = hosts;
  buildHostMap(hosts);
}

window.buildHostMap(localStorage.hosts || '');
