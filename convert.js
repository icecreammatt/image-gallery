var fs = require('fs'),
    path = require('path'),
    im = require('imagemagick');

var convertFolderToThumbnails = function(folderName, size) {
    var stats = fs.lstatSync(folderName),
        info = {
            path: folderName,
            name: path.basename(folderName)
        },
        thumbnailsFolderExists = false,
        fileList = [];

    if(stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(folderName).map(function(child) {
            fileList.push(child);
            if(child === "thumbnails") {
                thumbnailsFolderExists = true;
            }
        });
    }

    if(!thumbnailsFolderExists) {
        fs.mkdir('thumbnails');
    }

    console.log(fileList);
    fileList.forEach(function(file) {
        var fileName = file.split('.'),
            extension = fileName.pop().toLowerCase();

        if(extension.match('jpg|png')) {
            console.log('converting: ' + file);
            convertToThumbnail(file, size);
        }
    });
};

var convertToThumbnail = function(imageName, size) {
    size = size || '150';

    im.readMetadata(imageName, function(err, metadata) {
        if(err) throw err;

        im.resize({
            srcPath: __dirname + '/' + imageName,
            dstPath: __dirname + '/thumbnails/' + imageName,
            width: size
        }, function(err, stdout, stderr) {
            if (err) {
                console.log('Error resizing ' + imageName);
                throw err;
            }
        });
    });
};

convertFolderToThumbnails('.', '150');
