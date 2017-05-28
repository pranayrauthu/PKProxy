var panels = chrome && chrome.devtools && chrome.devtools.panels;
var elementsPanel = panels && panels.elements;

// devtools panel
panels.create('PKProxy', 'img/panel-logo.png', 'panel/app.html', function(panel) {
    console.log(panel);
    return page_getProperties();
});

// The function below is executed in the context of the inspected page.
var page_getProperties = function() {
    var windowProps = window;

    return windowProps;
}