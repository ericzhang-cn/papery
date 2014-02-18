#!/usr/bin/env node

/**
 * 编译整个站点
 */

var _ = require('underscore');
var compiler = require('../lib/compiler');

var cmds = ['index', 'rss', 'tag', 'pages', 'articles', 'all'];

var showUsage = function () {
    console.log('usage: pap-build command [blog_root_directory]');
    console.log('commands:');
    console.log('  help     - show help');
    console.log('  index    - build index.html');
    console.log('  rss      - build rss.xml');
    console.log('  tag      - build tag.html');
    console.log('  pages    - build pages');
    console.log('  articles - build articles');
    console.log('  all      - build all above');
};

var checkArgs = function (args) {
    if (args.length !== 3) {
        return false;
    }

    if (! _.contains(cmds, args[1])) {
        return false;
    }

    return true;
};

var args = process.argv[0] === 'node' ? _.last(process.argv, process.argv.length - 1) : process.argv;

if (!checkArgs(args)) {
    showUsage();
    process.exit(1);
}

var cmd = args[1],
    root = typeof args[2] !== 'undefined' ? args[2] : '';

switch (cmd) {
    case 'help':
        showUsage();
        break;
    case 'index':
        compiler.compileIndex(root);
        break;
    case 'rss':
        compiler.compileRss(root);
        break;
    case 'tag':
        compiler.compileTag(root);
        break;
    case 'pages':
        compiler.compilePages(root);
        break;
    case 'articles':
        compiler.compileArticles(root);
        break;
    case 'all':
        compiler.compile(root);
        break;
    default:
}
