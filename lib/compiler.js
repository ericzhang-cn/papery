var fs = require('fs'),
    ejs = require('ejs'),
    marked = require('marked'),
    parser = require('./parser');

var log4js = require('log4js'),
    logger = log4js.getLogger();

var loadTemplate = function (root, tpl) {
    var path = root + 'templates/' + tpl + '.ejs';
    if (!fs.existsSync(path)) {
        logger.error(path + ' can not be found!');
        process.exit(1);
    }

    var tplContent = fs.readFileSync(path, 'utf8');
    logger.info('Load ' + path + ' completed!');

    return tplContent;
};

exports.compileIndex = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'index');

    if (typeof opts !== 'object') {
        var opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/index.ejs';

    var html = ejs.render(tpl, opts);

    fs.writeFileSync(root + '/index.html', html);

    logger.info('Build index.html completed!');
};

exports.compileRss = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'rss');

    if (typeof opts !== 'object') {
        var opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/rss.ejs';

    var html = ejs.render(tpl, opts);

    fs.writeFileSync(root + '/rss.xml', html);

    logger.info('Build rss.xml completed!');
};

exports.compileTag = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'tag');

    if (typeof opts !== 'object') {
        var opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/tag.ejs';

    var html = ejs.render(tpl, opts);

    fs.writeFileSync(root + '/tag.html', html);

    logger.info('Build tag.html completed!');
};

exports.compilePages = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'pages');

    if (typeof opts !== 'object') {
        var opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/pages.ejs';

    opts.pages.forEach(function (page) {
        var path = root + 'pages/' + page.id + '.md';
        if (!fs.existsSync(path)) {
            logger.warn(path + ' can not be found!');
            return;
        }

        var content = marked(fs.readFileSync(path, 'utf8'));
        opts.page = {
            title: page.title,
            content: content
        };

        var html = ejs.render(tpl, opts);
        var output = root + 'pages/' + page.id + '.html';
        fs.writeFileSync(output, html);
        logger.info('Build ' + output + ' completed!');
    });
};

exports.compileArticles = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'articles');

    if (typeof opts !== 'object') {
        var opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/articles.ejs';

    opts.articles.forEach(function (ar) {
        var pathMd = root + 'articles/' + ar.id + '.md',
            pathHt = root + 'articles/' + ar.id + '.ht';
        if (!fs.existsSync(pathMd) && !fs.existsSync(pathHt)) {
            logger.warn(pathMd + ' can not be found!');
            return;
        }
        var path = fs.existsSync(pathMd) ? pathMd : pathHt;

        var content = fs.readFileSync(path, 'utf8');
        if (path.slice(-2) === 'md') {
            content = marked(content);
        }
        ar.content = content;
        opts.article = ar;

        var html = ejs.render(tpl, opts);
        var output = root + 'articles/' + ar.id + '.html';
        fs.writeFileSync(output, html);
        logger.info('Build ' + output + ' completed!');
    });
};

exports.compile = function (root) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var opts = parser.parseYaml(root);

    this.compileIndex(root, opts);
    this.compileRss(root, opts);
    this.compileTag(root, opts);
    this.compilePages(root, opts);
    this.compileArticles(root, opts);
};
