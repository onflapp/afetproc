 //app.project.item(3).numLayers

function enumeratePlaceholders(func) {
    var items = app.project.items;
    for (var i = 1; i <= items.length; i++) {
        var it = items[i];
        if (it.layers) {
            for (var z = 1; z <= it.layers.length; z++) {
                var lit = it.layers[z];
                var src = lit.property("Source Text");
                if (src) {
                    var val = src.value;
                    var txt = val.text;
                    if (txt.indexOf("{") != -1) {
                        func(10, lit.name, txt, src);
                    }
                }
            }
        }
        else if (it.file) {
            func(20, it.name, it.file.toString(), it);
        }
    }
}

function readConfigData(cfg) {
    var f = new File(cfg);
    f.open();
    var content = f.read();
    f.close();

    return JSON.parse(content);
}

function replacePlaceholders(file, cfg) {
    var config = readConfigData(cfg);

    if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    app.open(new File(file));

    enumeratePlaceholders(function (type, name, txt, src) {
        if (type == 10) {
            var ls = txt.match(/\{.*?\}/g);
            var nval = txt;
            for (var i = 0; i < ls.length; i++) {
                var n = ls[i];
                n = n.substr(1, n.length-2);
                var val = config[n];
                if (val) {
                    nval = nval.replace('{'+n+'}', val);
                }
            }
            src.setValue(new TextDocument(nval));
        }
        else if (type == 20) {
            var val = config[name];
            if (val) {
                src.replace(new File(val));
            }
        }
    });

    var f = new File(cfg.substr(0, cfg.lastIndexOf('/'))+'/result.aep');
    app.project.save(f);

    returnValue('done');

    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
}

function listPlaceholders(file) {
    if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);

    app.open(new File(file));

    var done = {};
    var rv = [];
    enumeratePlaceholders(function (type, name, txt, src) {
        rv.push({
            t:type,
            n:name,
            v:txt
        });

        if (type == 10) {
            var ls = txt.match(/\{.*?\}/g);
            for (var i = 0; i < ls.length; i++) {
                var v = ls[i];
                if (!done[v]) {
                    rv.push({
                        t:11,
                        n:v.substr(1, v.length-2)
                    });
                    done[v] = "y";
                }
			}
        }
    });

    returnValue(JSON.stringify(rv));

    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
}

function returnValue(val) {
    var f = new File("/tmp/ae_process.txt");
    f.open("w");
    f.write(val);
    f.close();
}