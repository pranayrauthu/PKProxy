const template = (e, i) => {
    return `<tr>
                <td>${e.filter}</td>
                <td>${e.redirect}</td>
                <td><button data-id="${i}" class="remove-entry-btn">remove</button></td>
            </tr>`;
};


//save the filter entry
function addEntry(e) {
    var filterUrl = qs("#filterUrl").value;
    var redirectUrl = qs("#redirectUrl").value;
    var entry = {
        "filter": filterUrl,
        "redirect": redirectUrl
    }
    chrome.storage.local.get("proxy-urls", function (data) {
        var entries = data["proxy-urls"] || [];
        entries.push(entry);
        chrome.storage.local.set({ "proxy-urls": entries });
        console.log(`added entry into listing`);
        loadEntries();
    });
}

//deleting an entry
function removeEntry(e){
    var index = e.target.attr("data-id");
    chrome.storage.local.get("proxy-urls", function (data) {
        var entries = data["proxy-urls"] || [];
        entries.splice(index,1);
        chrome.storage.local.set({ "proxy-urls": entries });
        console.log(`deleted entry from listing`);
        loadEntries();
    });
}

//load all entries
function loadEntries() {
    chrome.storage.local.get("proxy-urls", function (data) {
        var entries = data["proxy-urls"] || [];
        var outputTable = qs("#intercepted-urls");
        for (var i=0, l = entries.length; i < l; i++) {
            let entry = entries[i];
            outputTable.innerHTML += (template(entry, i));
        }
    });
}

qs("#add-entry-btn").onclick = addEntry;
loadEntries();