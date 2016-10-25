'use strict';

var storage = require('../modules/storage'),
    emoteParser = require('../modules/emoteParser');

var settings = null;
var emotes = null;
var initializationCallbacks = [];

var settingsSchema = function() {
    return {
        channels: {
            twitchTV: {
                globals: true,
                subscribers: true,
                smileys: false,
                filterMode: 'blacklist',
                filterList: [],
                priority: 2
            },
            betterTwitchTV: {
                globals: false,
                channelList: [],
                filterMode: 'blacklist',
                filterList: [],
                renderAnimatedEmotes: true,
                priority: 3
            },
            frankerFaceZ: {
                globals: false,
                channelList: [],
                filterMode: 'blacklist',
                filterList: [],
                priority: 4
            },
            userDefined: {
                emoteKeyPairs: {},
                priority: 1
            }
        },
        urlFilter: {
            filterMode: 'blacklist',
            list: []
        },
        flags: {
            dynamicallyReplaceEmotes: true,
            localEmoteStorage: false,
            emoteHoverBox: true,
            hitboxKappaSupport: false
        }
    }
};

storage.loadAll(function(data) {
    // TODO: Actually load settings
    // TODO: Do not refresh emotes if they are newer than 14 days old
    settings = settingsSchema();
    emoteParser.parseJabberzacEmotes({
        success: function(list) {
            emotes = list;
        }, error: function(response) {
            console.error(response);
        }
    });

    firePendingCallbacks();
});

function firePendingCallbacks() {
    for (var i = 0; i < initializationCallbacks.length; ++i) {
        initializationCallbacks[i]();
    }

    initializationCallbacks = [];
}

module.exports = {
    settings: function() {
        return settings;
    },
    emotes: function() {
        return emotes;
    },
    onLoad: function(callback) {
        if (settings === null) {
            initializationCallbacks.push(callback);
        } else {
            callback();
        }
    }
};
