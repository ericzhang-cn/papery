#!/usr/bin/env node

/**
 * 程序入口
 */

var _ = require('underscore');

var cmds = [ 'create', 'build', 'server' ];
var runners = [];
_.each(cmds, function (cmd) {
    runners[cmd] = require('./' + cmd + '_runner');
});

var showUsage = function () {
    console.log('usage: papery command [options]');
    console.log('');
    console.log('commands:');
    console.log('  create - Create a new blog');
    console.log('  build  - Build all site or some components from config and meta-text');
    console.log('  server - Start a new local web server for test and debug');
    console.log('');
    console.log('"papery help command" for detail');
};

var showHelp = function (cmd) {
    runners[cmd].help();
};

var checkArgs = function (args) {
    if (args.length <= 2) {
        showUsage();
        return false;
    }

    if ((args[1] === 'help') && (! _.contains(cmds, args[1]))) {
        showHelp(args[2]);
        return false;
    }

    return true;
};

var args = (process.argv[0] === 'node' || process.argv[0] === 'nodejs')
         ? _.last(process.argv, process.argv.length - 1)
         : process.argv;

if (checkArgs(args) === false) {
    process.exit(1);
}

var cmd = args[1];
var options = _.last(args, args.length - 2);

runners[cmd].run(options);

