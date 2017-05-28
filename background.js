const beforeReqOptions = ["blocking"];

//following variables gets updated
//when "proxy-urls" in storage get updated
var filters = {
    urls: [
        "http://www.abc.com/*"
    ]
}
//array of objects({"filter":url<string>,"redirect":url<string>})
var redirections = [{
    filter:"http://www.abc.com",
    redirect: "http://www.github.com/pranayrauthu"
}];

function callback(info) {
    var url = info.url;
    
    for (var i = redirections.length - 1; i >= 0; i--) {
        if(url.includes(redirections[i]["filter"])){
            url = redirections[i]["redirect"];
        }
    }

    return {
        redirectUrl: url
    }
};

function updateRedirections(e) {
    var filterUrl = e.filter;
    // trimming '/*' at the end
    filterUrl = filterUrl.substr(0,filterUrl.length-2);
    redirections.push({
        filter:filterUrl,
        redirect:e.redirect
    });
}

chrome.storage.local.get("proxy-urls", function(data) {
    var entries = data["proxy-urls"];
    redirections = [];
    for (var entry of entries) {
        redirections.push(entry);
        filters.urls.push(entry.filter)
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
            filters.urls.push(entry.filter);
            updateRedirections(entry)
        }
        chrome.webRequest.onBeforeRequest.removeListener(callback);
        chrome.webRequest.onBeforeRequest.addListener(callback, filters, beforeReqOptions);
    }

});