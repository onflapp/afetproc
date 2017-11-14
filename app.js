var express = require('express');
var fs = require('fs-extra');
var proc = require('child_process');
var fileUpload = require('express-fileupload');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function (req, res, next) {

    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === 'POST') {
        var upload = fileUpload();
        upload(req, res, next);
    }
    else {
        var handler = express.static(__dirname);
        handler (req, res, next);
    }
});

// views is directory for all template files
app.set('views', __dirname + '/pages');
app.set('view engine', 'ejs');

app.get('/*', function (req, res) {
    var name = req.params[0];
    var ctx = {
        __dirname:__dirname,
        query:req.query,
        proc:proc,
        fs:fs
    };

    if (name == '') name = 'index';

    res.render(name, ctx);
});

app.post('/*', function (req, res) {
    var rv = {};
    var dir = req.url;
    var destination = __dirname + dir;

    fs.ensureDirSync(destination);

    if (req.files) {
        var ls = req.files;

        for (var f in ls) {
            var file = ls[f];
            if (file.name) {
                rv[f] = destination + '/' + file.name;
                
                file.mv(destination + '/' + file.name, function (err) {
                });
            }
        }
    }
    if (req.body) {
        for (var k in req.body) {
            rv[k] = req.body[k];
        }
        fs.writeFile(destination + '/fields.json', JSON.stringify(rv), function(err) {
        });
    }

    if (req.body && req.body[':forward']) {
        res.redirect(req.body[':forward']);
    }
    else {
        res.send('File uploaded!');
    }
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
