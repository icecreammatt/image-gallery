#!/usr/local/bin/node

// From http://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js

var fs = require('fs');
var path = require('path');

process.chdir('public');

function dirTree(filename) {
    var stats = fs.lstatSync(filename),
    info = {
        path: filename,
        name: path.basename(filename)
    };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }
    return info;
}

if (module.parent === undefined) {
    // node dirTree.js ~/foo/bar
    var util = require('util');
    console.log(util.inspect(dirTree(process.argv[2]), false, null));
}

var tree = dirTree('images'); 
console.log(JSON.stringify(tree));
