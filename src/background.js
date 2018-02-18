/**
 *
 * docs - https://developer.chrome.com/extensions/webRequest
 */


const beforeReqOptions = ['blocking'];

// following variables gets updated
// when "proxy-urls" in storage get updated
const filters = {
  urls: [
    'http://www.abc.com/*',
  ],
};

// array of objects({"filter":url<string>,"redirect":url<string>})
let redirections = [{
  filterUrl: 'http://www.abc.com/*',
  redirectUrl: 'http://www.github.com/pranayrauthu',
}];

function callback(info) {
  let url = info.url;

  redirections.forEach((redirection, i) => {
    if (new RegExp(redirection.filterUrl).test(url)) {
      url = redirection.redirectUrl;
    }
  });

  return {
    redirectUrl: url,
  };
}

function updateRedirections(e) {
  redirections.push({
    filterUrl: e.filterUrl,
    redirectUrl: e.redirectUrl,
  });
}

chrome.storage.sync.get('proxy-urls', (data) => {
  const entries = data['proxy-urls'] || [];
  redirections = [];
  entries.forEach((entry) => {
    redirections.push(entry);
    filters.urls.push(entry.filterUrl);
  });
  chrome.webRequest.onBeforeRequest.addListener(callback, filters, beforeReqOptions);
});

chrome.storage.onChanged.addListener((change) => {
  // proxy-urls -> array of objects {"filterUrl":"","redirectUrl":""}
  // filter -> url to intercept
  // redirect -> redirect url
  const newFilters = change['proxy-urls'] ? change['proxy-urls'].newValue : [];
  if (newFilters.length > 0) {
    filters.urls = [];
    redirections = [];
    newFilters.forEach((entry) => {
      filters.urls.push(entry.filterUrl);
      updateRedirections(entry);
    });
    chrome.webRequest.onBeforeRequest.removeListener(callback);
    chrome.webRequest.onBeforeRequest.addListener(callback, filters, beforeReqOptions);
  }
});
