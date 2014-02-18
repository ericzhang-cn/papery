#!/usr/bin/env node

/**
 * 生成一个新的papery站点
 */

var _ = require('underscore');
var fs = require('fs');
var ncp = require('ncp').ncp;
var log4js = require('log4js');
var logger = log4js.getLogger();

var showUsage = function () {
    console.log('usage: pap-create blog_root_directory');
};

var checkArgs = function (args) {
    if (args.length !== 2) {
        return false;
    }
    return true;
};

var args = process.argv[0] === 'node' ? _.last(process.argv, process.argv.length - 1) : process.argv;

if (!checkArgs(args)) {
    showUsage();
    process.exit(1);
}

var startup = __dirname + '/../startup';
if (!fs.existsSync(startup)) {
    logger.error('Startup templates can not be found! Please reinstall your papery');
    process.exit(1);
}

var src = startup,
    dest = args[1];

ncp(src, dest, function (err) {
    if (err) {
        logger.error('Create blog failed!');
        logger.error(err);
        process.exit(1);
    }

    logger.info('Woo! A new blog was born in ' + dest);
});
