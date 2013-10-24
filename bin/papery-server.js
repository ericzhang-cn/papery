#!/usr/bin/env node

var _ = require('underscore'),
    connect = require('connect');

var log4js = require('log4js'),
    logger = log4js.getLogger();

var showUsage = function () {
    console.log('usage: pap-server blog_root_directory');
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

connect.createServer(
    connect.static(args[1])
).listen(8001);

logger.info('Server started at http://localhost:8001/');
