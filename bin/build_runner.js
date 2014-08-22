/**
 * 编译整个站点
 */

var _ = require('underscore');
var compiler = require('../lib/compiler');

function _help() {
    console.log('Usage: papery build <root>');
    console.log('    root - Root directory of blog');
}

exports.help = function () {
    _help();
};

exports.run = function (options) {
    var root;
    if (_.size(options) >= 1) {
        root = options[0];
    } else {
        _help();
        return;
    }

    compiler.compile(root);
};

