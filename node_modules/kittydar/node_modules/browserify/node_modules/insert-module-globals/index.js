var parseScope = require('lexical-scope');
var commondir = require('commondir');
var through = require('through');

var path = require('path');
var fs = require('fs');

var processModulePath = require.resolve('process/browser.js');
var processModuleSrc = fs.readFileSync(processModulePath, 'utf8');

var bufferModulePath = path.join(__dirname, 'buffer.js');
var bufferModuleSrc = fs.readFileSync(bufferModulePath, 'utf8');

var varNames = [ 'process', 'global', '__filename', '__dirname', 'Buffer' ];

module.exports = function (files, opts) {
    if (!Array.isArray(files)) {
        opts = files;
        files = [];
    }
    if (!opts) opts = {};
    if (!files) files = [];
    
    var basedir = opts.basedir || (files.length
        ? commondir(files.map(function (x) {
            return path.resolve(path.dirname(x));
        }))
        : '/'
    );
    var resolved = { process: false, Buffer: false };
    
    return through(write, end);
    
    function write (row) {
        if (!opts.always
            && !/\bprocess\b/.test(row.source)
            && !/\bglobal\b/.test(row.source)
            && !/\bBuffer\b/.test(row.source)
            && !/\b__filename\b/.test(row.source)
            && !/\b__dirname\b/.test(row.source)
        ) return this.queue(row);
        
        var scope = opts.always
            ? { globals: { implicit: varNames } }
            : parseScope(row.source)
        ;
        var globals = {};
        
        if (scope.globals.implicit.indexOf('process') >= 0) {
            if (!resolved.process) {
                this.queue({
                    id: processModulePath,
                    source: processModuleSrc,
                    deps: {}
                });
            }
            
            resolved.process = true;
            row.deps.__browserify_process = processModulePath;
            globals.process = 'require("__browserify_process")';
        }
        if (scope.globals.implicit.indexOf('Buffer') >= 0) {
            if (!resolved.Buffer) {
                this.queue({
                    id: bufferModulePath,
                    source: bufferModuleSrc,
                    deps: {}
                });
            }
            
            resolved.Buffer = true;
            row.deps.__browserify_buffer = bufferModulePath;
            globals.Buffer = 'require("__browserify_buffer").Buffer';
        }
        if (scope.globals.implicit.indexOf('global') >= 0) {
            globals.global = 'window';
        }
        if (scope.globals.implicit.indexOf('__filename') >= 0) {
            var file = '/' + path.relative(basedir, row.id);
            globals.__filename = JSON.stringify(file);
        }
        if (scope.globals.implicit.indexOf('__dirname') >= 0) {
            var dir = path.dirname('/' + path.relative(basedir, row.id));
            globals.__dirname = JSON.stringify(dir);
        }
        
        row.source = closeOver(globals, row.source);
        this.queue(row);
    }
    
    function end () {
        this.ended = true;
        this.queue(null);
    }
};

function closeOver (globals, src) {
    var keys = Object.keys(globals);
    return '(function(' + keys + '){' + src + '\n})('
        + keys.map(function (key) { return globals[key] }).join(',') + ')'
    ;
}
