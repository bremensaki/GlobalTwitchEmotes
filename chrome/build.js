'use strict';

var browserify = require('browserify'),
    fs = require('fs'),
    fsExtra = require('fs-extra'),
    root = require('root-path'),
    path = require('path'),
    zipdir = require('zip-dir');

var baseDirectory = 'chrome',
    scratchDirectory = root('bin', baseDirectory),
    buildDirectory = root('build', baseDirectory);

var version = require(root('common', 'metainfo.json')).version;

// BIN
// Copy common and browser-specific stuff to bin/browserName
if (fs.existsSync(scratchDirectory)) {
    fsExtra.removeSync(scratchDirectory);
}

fs.mkdirSync(scratchDirectory);

fsExtra.copySync(root('common'), scratchDirectory, {clobber: true}, function (err) {
    if (err) {
        return console.log(err);
    }
});

fsExtra.copySync(root(baseDirectory), scratchDirectory, {clobber: true}, function (err) {
    if (err) {
        return console.log(err);
    }
});
// END BIN

var contentScript = {
        src: root('bin', baseDirectory, 'contentScript', 'main.js'),
        dest: root('build', baseDirectory, 'script.js'),
        builder: browserify()
    },
    backgroundScript = {
        src: root('bin', baseDirectory, 'background', 'main.js'),
        dest: root('build', baseDirectory, 'background.js'),
        builder: browserify()
    },
    optionsScript = {
        src: root('bin', baseDirectory, 'options', 'main.js'),
        dest: root('build', baseDirectory, 'options.js'),
        builder: browserify()
    };

// Remake browser build folder
if (fs.existsSync(buildDirectory)) {
    fsExtra.removeSync(buildDirectory);
}

fs.mkdirSync(buildDirectory);

// Recreate browserified contentscript file
fsExtra.removeSync(contentScript.dest);
contentScript.builder.add(contentScript.src).bundle().pipe(fs.createWriteStream(contentScript.dest));


// Recreate browserified background file
fsExtra.removeSync(backgroundScript.dest);
backgroundScript.builder.add(backgroundScript.src).bundle().pipe(fs.createWriteStream(backgroundScript.dest));


// Options page
fsExtra.removeSync(optionsScript.dest);
optionsScript.builder.add(optionsScript.src).bundle().pipe(fs.createWriteStream(optionsScript.dest));

// Copy resources folder
fsExtra.copySync(root('bin', baseDirectory, 'resources'), root('build', baseDirectory, 'resources'), {clobber: true}, function (err) {
    if (err) {
        return console.log(err);
    }
});

// Create manifest file
require('./manifestGenerator')(root('build', baseDirectory, 'manifest.json'));

// Zip extension up for deployment
zipdir(root('build', baseDirectory), {saveTo: root('releases', baseDirectory, baseDirectory + '-' + version + '.zip')}, function (err, buffer) {
    if (err) {
        console.log(err);
    }
});