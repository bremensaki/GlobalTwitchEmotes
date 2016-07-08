'use strict';

var fs = require('fs'),
    root = require('root-path');

module.exports = function(filePath) {
    var metainfo = require('../common/metainfo.json');

    var chromeManifest = {
        manifest_version: 2,
        "background": {
            "scripts": [
                "background.js"
            ],
            "persistent": false
        },
        content_scripts: [{
            js: [
                'script.js'
            ],
            run_at: 'document_start',
            matches: ['http://*/*', 'https://*/*']
        }],
        permissions: [
            'storage'
        ],
        web_accessible_resources: [
            'resources/*'
        ],
        icons: {
            // 128: 'resources/img/logo.png'
        },
        options_page: 'resources/html/options.html'
    };

    // Merge both manifest jsons into one for writing
    for (var key in metainfo) {
        if (metainfo.hasOwnProperty(key)) {
            chromeManifest[key] = metainfo[key];
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(chromeManifest, null, 4), 'utf-8');
};