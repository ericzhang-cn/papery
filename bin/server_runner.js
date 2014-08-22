/**
 * 在本地启动一个调试服务器
 */

var _ = require('underscore');
var connect = require('connect');
var log4js = require('log4js');
var logger = log4js.getLogger();

function _help () {
    console.log('Usage: papery server <root> <[port]>');
    console.log('    root - Root directory of blog');
    console.log('    port - Port to start web server, must greater than 3000, default is 8001');
}

exports.help = function () {
    _help();
};

exports.run = function (options) {
    var port = 8001;
    var root;
    if (_.size(options) >= 2) {
        root = options[0];
        port = parseInt(options[1], 10);
    } else if (_.size(options) === 1) {
        root = options[0];
    } else {
        _help();
        return;
    }

    if (port < 3000) {
        log.error('Port number must greater than 3000');
        return;
    }

    connect.createServer(
        connect.static(root)
    ).listen(port);

    logger.info('Server started at http://localhost:' + port + '/');
}
