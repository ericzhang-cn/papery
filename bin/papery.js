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

var help = function () {
    console.log('Usage:');
    console.log('    papery -v or --version');
    console.log('    papery -h or --help');
    console.log('    papery command [options]');
    console.log('    papery help command');
    console.log('');
    console.log('Commands:');
    console.log('    create - Create a new blog');
    console.log('    build  - Build all site from config and meta-text');
    console.log('    server - Start a new local web server for test and debug');
};

var version = function () {
    var pack = require('../package.json');
    console.log('Version: ' + pack.version);
}

var showHelp = function (cmd) {
    runners[cmd].help();
};

var checkArgs = function (args) {
    if (args.length >= 2) {
        if (args[1] === '-v' || args[1] === '--version') {
            version();
            return false;
        }
        if (args[1] === '-h' || args[1] === '--help') {
            help();
            return false;
        }
        if (args.length >= 3 && args[1] === 'help' && _.contains(cmds, args[2])) {
            showHelp(args[2]);
            return false;
        }
        if (!_.contains(cmds, args[1])) {
            return false;
        }
        return true;
    } else {
        return false;
    }

};

var args = !(process.argv[0] === 'node' ||
    process.argv[0] === 'nodejs' ||
    process.argv[0].match(/node.exe$/)) ? process.argv : _.last(process.argv, process.argv.length - 1);

if (checkArgs(args) === false) {
    help();
    process.exit(1);
}

var cmd = args[1];
var options = _.last(args, args.length - 2);

runners[cmd].run(options);

