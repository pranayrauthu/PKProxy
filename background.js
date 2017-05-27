async function callback(info) {
    var url = null;
    //proxy-urls -> array of objects {"filter":"","redirect":""}
    //filter -> url to intercept
    //redirect -> redirect url
    await chrome.storage.local.get("proxy-urls", function (data) {
        var entries = data["proxy-urls"];
        for (var entry of entries) {
            if (entry.filter === info.url) {
                url = entry.redirect;
            }
        }
    });
    url = url || info.url;
    return { redirectUrl: url }
};




const filters = {
    urls: [
        "http://www.abc.com/*"
    ]
}

const beforeReqOptions = ["blocking"];

chrome.storage.local.get("proxy-urls", function (data) {
    var entries = data["proxy-urls"];
    for (var entry of entries) {
        filters.urls.push(entry.filter)
    }
});

chrome.storage.onChanged.addListener(function (change, type) {
    var newFilters = change["proxy-urls"] || [];
    if (newFilters.length > 0) {
        filters.urls = [];
        for (var entry of newFilters) {
            filters.urls.push(entry.filter);
        }
    }

});


chrome.webRequest.onBeforeRequest.addListener(callback, filters, beforeReqOptions);
