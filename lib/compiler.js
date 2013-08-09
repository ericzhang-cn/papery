var fs = require('fs'),
    ejs = require('ejs'),
    winston = require('winston'),
    marked = require('marked'),
    parser = require('./parser');

var loadTemplate = function (root, tpl) {
    var path = root + 'templates/' + tpl + '.ejs';
    if (!fs.existsSync(path)) {
        winston.log('error', '无法读取模板文件 %s', path);
        process.exit(1);
    }

    var tplContent = fs.readFileSync(path, 'utf8');
    winston.log('info', '读取模板文件 %s 完成', path);

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

    winston.log('info', '%s 编译完成', 'index.html');
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

    winston.log('info', '%s 编译完成', 'rss.xml');
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

    winston.log('info', '%s 编译完成', 'tag.html');
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
            winston.log('warn', '%s 不存在', path);
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
        winston.log('info', '%s 编译完成', output);
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
            winston.log('warn', '%s 和 %s 均不存在', pathMd, pathHt);
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
        winston.log('info', '%s 编译完成', output);
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
