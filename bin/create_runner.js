/**
 * 生成一个新的papery站点
 */

var _ = require('underscore');
var fs = require('fs');
var fse = require('fs-extra');
var log4js = require('log4js');
var logger = log4js.getLogger();

function _help() {
    console.log('Usage: papery create <root>');
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

    var startup = __dirname + '/../startup';
    if (!fs.existsSync(startup)) {
        logger.error('Startup templates can not be found! Please reinstall your papery');
        process.exit(1);
    }

    var src = startup;
    var dest = root;
    fse.copySync(src, dest);

    logger.info('Woo! A new blog was born in ' + dest);
};

