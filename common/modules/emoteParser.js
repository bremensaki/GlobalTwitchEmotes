'use strict';

var httpRequest = require('../modules/httpRequest');

function parseTwitchTVGlobalEmotes(callbacks) {
    httpRequest('GET', 'https://twitchemotes.com/api_cache/v2/global.json', {
        success: function(responseText) {
            var json = JSON.parse(responseText);
            var emotes = json.emotes;
            var templateURL = json.template.small;

            var emotePairs = {};

            for (var key in emotes) {
                if (emotes.hasOwnProperty(key)) {
                    var emoteURL = templateURL.replace('{image_id}', emotes[key].image_id);

                    emotePairs[key] = generateEmote(key, emoteURL, '');
                }
            }

            callbacks.success(emotePairs);
        },
        error: callbacks.error
    })
}

function generateEmote(emoteName, emoteURL, emoteChannel) {
    return 'img class="GTEEmote" data-gtenode="true" title="' + emoteName + '" alt="' + emoteName + '" src="' + emoteURL + '" data-GTEChannel="' + emoteChannel + '"';
}

module.exports = {
    parseTwitchTVGlobalEmotes: parseTwitchTVGlobalEmotes
};