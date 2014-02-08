var express = require('express'),
    stylus = require('stylus'),
    fs = require('fs'),
    path = require('path');

var readFiles = function(p, callback) {
    var images = [];
    p = p || '/';
    fs.readdir(p, function(error, files) {
        if(error) {
            throw error;
        }
        files.map(function(file) {
            return path.join(p, file);
        }).filter(function(file) {
            return fs.statSync(file).isFile();
        }).forEach(function(file) {
            var filePath = file.split('/');
            filePath.splice(0, 1); // Remove public
            filePath = filePath.join('/');
            images.push(filePath);
        });
        if(!!callback) {
            callback(images);
        }
    });
};

var cache = {};
var loadJsonFile = function(fileName, callback) {
    if(!!cache[fileName]) {
        console.log('Read from cache' + fileName);
        callback(cache[fileName]);
    } else {
        console.log('Reading file' + fileName);
        fs.readFile(fileName, 'utf8', function(err, data) {
            if(err) {
                console.log('error reading file');
                return;
            }
            data = JSON.parse(data);
            if(!!callback) {
                cache[fileName] = data;
                callback(data);
            }
        });
    }
};

var app = express();

function compile(str, path) {
    return stylus(str).set('filename',path);
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware({ 
    src: __dirname + '/public' , compile: compile 
}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    loadJsonFile('listing.json', function(galleries) {
        var nav = [];
        galleries.children.forEach(function(child){
            nav.push(child.name);
        });
        res.render('index', { title: 'Home', images: galleries, nav: nav });
    });

    // readFiles('public/images', function(images) {
    //     res.render('index', { title: 'Home', images: images });
    // });
});

app.listen(3000);
