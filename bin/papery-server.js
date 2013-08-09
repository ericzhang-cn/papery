#!/usr/bin/env node

var _ = require('underscore'),
    connect = require('connect'),
    winston = require('winston');

var showUsage = function () {
    console.log('usage: papery-server blog_root_directory');
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

winston.log('info', 'server已启动，请通过http://localhost:8001/访问您的blog');
