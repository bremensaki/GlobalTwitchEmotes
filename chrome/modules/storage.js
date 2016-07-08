'use strict';

module.exports = {
    loadAll: function(callback) {
        chrome.storage.sync.get(null, callback);
    },
    load: function(varName, callback) {
        chrome.storage.sync.get(varName, callback);
    },
    saveAll: function(data, callback) {
        chrome.storage.sync.set(data, callback);
    },
    save: function(varName, callback) {
        // TODO
    }
};