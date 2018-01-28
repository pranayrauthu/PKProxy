/**
 * 
 * docs - https://developer.chrome.com/extensions/webRequest
 */


const beforeReqOptions = ["blocking"];

//following variables gets updated
//when "proxy-urls" in storage get updated
const filters = {
    urls: [
        "http://www.abc.com/*"
    ]
}

//array of objects({"filter":url<string>,"redirect":url<string>})
let redirections = [{
    filterUrl:"http://www.abc.com/*",
    redirectUrl: "http://www.github.com/pranayrauthu"
}];

function callback(info) {
    let url = info.url;

    redirections.forEach(function (redirection, i) {
        if(new RegExp(redirection.filterUrl).test(url)){
            url = redirection.redirectUrl
        }
    })

    return {
        redirectUrl: url
    }
};

function updateRedirections(e) {
    redirections.push({
        filter:e.filterUrl,
        redirect:e.redirectUrl
    });
}

chrome.storage.sync.get("proxy-urls", function(data) {
    const entries = data["proxy-urls"] ||[];
    redirections = [];
    for (var entry of entries) {
        redirections.push(entry);
        filters.urls.push(entry.filterUrl)
    }
    chrome.webRequest.onBeforeRequest.addListener(callback, filters, beforeReqOptions);
});

chrome.storage.onChanged.addListener(function(change, type) {
    //proxy-urls -> array of objects {"filter":"","redirect":""}
    //filter -> url to intercept
    //redirect -> redirect url
    var newFilters = change["proxy-urls"] ? change['proxy-urls']['newValue'] : [];
    if (newFilters.length > 0) {
        filters.urls = [];
        redirections = [];
        for (var entry of newFilters) {
            filters.urls.push(entry.filterUrl);
            updateRedirections(entry)
        }
        chrome.webRequest.onBeforeRequest.removeListener(callback);
        chrome.webRequest.onBeforeRequest.addListener(callback, filters, beforeReqOptions);
    }

});