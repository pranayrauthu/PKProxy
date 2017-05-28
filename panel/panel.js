const template = (e, i) => {
    return `<td>${e.filter}</td>
           <td>${e.redirect}</td>
           <td><button data-id="${i}" class="remove-entry-btn">remove</button></td>`;
};


//save the filter entry
function addEntry(e) {
    var filterUrl = qs("#filterUrl").value;
    var redirectUrl = qs("#redirectUrl").value;
    //grooming the entered filter
    if(filterUrl.charAt(filterUrl.length-1)=="/"){
        filterUrl+="*";
    }
    else{
        filterUrl+="/*";
    }
    var entry = {
        "filter": filterUrl,
        "redirect": redirectUrl
    }
    chrome.storage.local.get("proxy-urls", function(data) {
        var entries = data["proxy-urls"] || [];
        entries.push(entry);
        chrome.storage.local.set({
            "proxy-urls": entries
        });
        console.log(`added entry into listing`);
        loadEntries();
    });
}

//deleting an entry
function removeEntry(e) {
    var index = Number.parseInt(e.target.attr("data-id"));
    chrome.storage.local.get("proxy-urls", function(data) {
        var entries = data["proxy-urls"] || [];
        entries.splice(index, 1);
        chrome.storage.local.set({
            "proxy-urls": entries
        }, function() {
            console.log(arguments);
            console.log(`deleted entry from listing`);
            loadEntries();
        });
    });
}

//load all entries
function loadEntries() {
    chrome.storage.local.get("proxy-urls", function(data) {
        var entries = data["proxy-urls"] || [];
        var outputTable = qs("#intercepted-urls");
        outputTable.innerHTML = "";
        for (var i = 0, l = entries.length; i < l; i++) {
            let entry = entries[i];
            let trow = cel('tr');
            trow.innerHTML = template(entry, i);
            trow.querySelector(".remove-entry-btn").onclick = removeEntry;
            outputTable.appendChild(trow);
        }
    });
}

qs("#add-entry-btn").onclick = addEntry;
loadEntries();