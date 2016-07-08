'use strict';

module.exports = function(type, url, callback) {
    var request = new XMLHttpRequest();

    request.open(type, url);

    request.onload = function() {
        callback.success(request.responseText);
    };
    request.onerror = function(event) {
        callback.error('Failed to load emotes.');
    };

    request.send();
};