// builtin
var fs = require('fs');
var path = require('path');

// vendor
var resv = require('resolve');

// core modules replaced by their browser capable counterparts
var core = {};

// load core modules from builtin dir
fs.readdirSync(__dirname + '/builtin/').forEach(function(file) {
    core[path.basename(file, '.js')] = path.join(__dirname, '/builtin/', file);
});

// manually add core which are provided by modules
core['http'] = require.resolve('http-browserify');
core['vm'] = require.resolve('vm-browserify');
core['crypto'] = require.resolve('crypto-browserify');
core['console'] = require.resolve('console-browserify');
core['zlib'] = require.resolve('zlib-browserify');
core['buffer'] = require.resolve('buffer-browserify');

// given a path, create an array of node_module paths for it
// borrowed from substack/resolve
function nodeModulesPaths (start, cb) {
    var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\/+/;
    var parts = start.split(splitRe);

    var dirs = [];
    for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === 'node_modules') continue;
        var dir = path.join(
            path.join.apply(path, parts.slice(0, i + 1)),
            'node_modules'
        );
        if (!parts[0].match(/([A-Za-z]:)/)) {
            dir = '/' + dir;
        }
        dirs.push(dir);
    }
    return dirs;
}

// paths is mutated
// load shims from first package.json file found
function load_shims(paths, cb) {
    // identify if our file should be replaced per the browser field
    // original filename|id -> replacement
    var shims = {};

    (function next() {
        var cur_path = paths.shift();
        if (!cur_path) {
            return cb(null, shims);
        }

        var pkg_path = path.join(cur_path, 'package.json');

        fs.readFile(pkg_path, 'utf8', function(err, data) {
            if (err) {
                // ignore paths we can't open
                // avoids an exists check
                if (err.code === 'ENOENT') {
                    return next();
                }

                return cb(err);
            }

            try {
                var info = JSON.parse(data);
            }
            catch (err) {
                return cb(err);
            }

            // no replacements, skip shims
            if (!info.browser) {
                return cb(null, shims);
            }

            // if browser field is a string
            // then it just replaces the main entry point
            if (typeof info.browser === 'string') {
                var key = path.resolve(cur_path, info.main || 'index.js');
                shims[key] = path.resolve(cur_path, info.browser);
                return cb(null, shims);
            }

            // http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
            Object.keys(info.browser).forEach(function(key) {
                if (info.browser[key] === false) {
                    return shims[key] = __dirname + '/empty.js';
                }
                var val = path.resolve(cur_path, info.browser[key]);

                // if does not begin with / ../ or ./ then it is a module
                if (key[0] !== '/' && key[0] !== '.') {
                    return shims[key] = val;
                }

                var key = path.resolve(cur_path, key);
                shims[key] = val;
            });
            return cb(null, shims);
        });
    })();
};

function resolve(id, parent, cb) {

    if (resv.isCore(id)) {
        // return path to browser capable version if we have it
        return cb(null, core[id]);
    }

    var base = path.dirname(parent.filename);
    var paths = nodeModulesPaths(base);

    if (parent && parent.paths) {
        paths.push.apply(paths, parent.paths);
    }

    paths = paths.map(function(p) {
        return path.dirname(p);
    });

    // we must always load shims because the browser field could shim out a module
    load_shims(paths, function(err, shims) {
        if (err) {
            return cb(err);
        }

        if (shims[id]) {
            return cb(null, shims[id]);
        }

        // our browser field resolver
        // if browser field is an object tho?
        var full = resv(id, {
            paths: parent.paths,
            basedir: base,
            packageFilter: function(info) {
                if (parent.packageFilter) info = parent.packageFilter(info);

                // no browser field, keep info unchanged
                if (!info.browser) {
                    return info;
                }

                // replace main
                if (typeof info.browser === 'string') {
                    info.main = info.browser;
                    return info;
                }

                var replace_main = info.browser[info.main || './index.js'];
                info.main = replace_main || info.main;
                return info;
            }
        }, function(err, full) {
            var resolved = (shims) ? shims[full] || full : full;
            cb(null, resolved);
        });
    });
};

module.exports = resolve;

