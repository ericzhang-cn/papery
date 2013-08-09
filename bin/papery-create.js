#!/usr/bin/env node

var _ = require('underscore'),
    fs = require('fs'),
    winston =  require('winston'),
    ncp = require('ncp').ncp;

var showUsage = function () {
    console.log('usage: papery-create blog_root_directory');
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
    winston.log('error', '找不到startup模板，重新安装papery可修复此问题');
    process.exit(1);
}

var src = startup,
    dest = args[1];

ncp(src, dest, function (err) {
    if (err) {
        winston.log('error', '无法创建blog');
        winston.log('error', err);
        process.exit(1);
    }

    winston.log('info', '恭喜！在 %s 成功诞生了一个新的blog', dest);
});
