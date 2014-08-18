/**
 * 生成编译后的静态页面文件
 * @module lib/compiler
 */

var fs = require('fs');
var ejs = require('ejs');
var marked = require('marked');
var parser = require('./parser');
var log4js = require('log4js');
var toc = require('marked-toc');
var logger = log4js.getLogger();

// 自定义Render
var renderer = new marked.Renderer();
// 原始marked生成anchor时不支持中文，这里加入中文支持，以便与TOC相匹配
renderer.heading = function (text, level) {
    return '<h'
        + level
        + ' id="'
        + this.options.headerPrefix
        + text.toLowerCase().replace(/\./g, '').replace(/[^[\w\u0100-\uffff\]]+/g, '-')
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
}

// 开启GFM并支持代码高亮
marked.setOptions({
    gfm: true,
    langPrefix: 'prettyprint linenums lang-',
    renderer: renderer
});

/**
 * 读取ejs模板文件
 * @param  {String} root papery根目录
 * @param  {String} tpl  ejs模板文件名称
 * @return {String}      模板文件内容
 */
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

/**
 * 生成首页
 * @param  {String} root papery根目录
 * @param  {Object} opts 配置对象
 */
exports.compileIndex = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'index');

    if (typeof opts !== 'object') {
        opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/index.ejs';

    var html = ejs.render(tpl, opts);

    fs.writeFileSync(root + '/index.html', html);

    logger.info('Build index.html completed!');
};

/**
 * 生成RSS
 * @param  {String} root papery根目录
 * @param  {Object} opts 配置对象
 */
exports.compileRss = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'rss');

    if (typeof opts !== 'object') {
        opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/rss.ejs';

    opts.site.rss.items.forEach(function (item) {
        var pathMd = root + 'articles/' + item.id + '.md',
            pathHt = root + 'articles/' + item.id + '.ht';
        if (!fs.existsSync(pathMd) && !fs.existsSync(pathHt)) {
            logger.warn(pathMd + ' can not be found!');
            return;
        }
        var path = fs.existsSync(pathMd) ? pathMd : pathHt;

        var content = fs.readFileSync(path, 'utf8');
        if (path.slice(-2) === 'md') {
            content = marked(content);
            content = content.replace(/<pre><code/g, '<pre');
            content = content.replace(/<\/code>/g, '');
        }
        item.description = content;
    });

    var html = ejs.render(tpl, opts);

    fs.writeFileSync(root + '/rss.xml', html);

    logger.info('Build rss.xml completed!');
};

/**
 * 生成标签页
 * @param  {String} root papery根目录
 * @param  {Object} opts 配置对象
 */
exports.compileTag = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'tag');

    if (typeof opts !== 'object') {
        opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/tag.ejs';

    var html = ejs.render(tpl, opts);

    fs.writeFileSync(root + '/tag.html', html);

    logger.info('Build tag.html completed!');
};

/**
 * 生成独立页面
 * @param  {String} root papery根目录
 * @param  {Object} opts 配置对象
 */
exports.compilePages = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'pages');

    if (typeof opts !== 'object') {
        opts = parser.parseYaml(root);
    }
    opts.filename = root + 'templates/pages.ejs';

    opts.pages.forEach(function (page) {
        var path = root + 'pages/' + page.id + '.md';
        if (!fs.existsSync(path)) {
            logger.warn(path + ' can not be found!');
            return;
        }

        var content = marked(fs.readFileSync(path, 'utf8'));
        content = content.replace(/<pre><code/g, '<pre');
        content = content.replace(/<\/code>/g, '');
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

/**
 * 生成文章页面
 * @param  {String} root papery根目录
 * @param  {Object} opts 配置对象
 */
exports.compileArticles = function (root, opts) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var tpl = loadTemplate(root, 'articles');

    if (typeof opts !== 'object') {
        opts = parser.parseYaml(root);
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
            content = toc.insert(content);
            content = marked(content);
            content = content.replace(/<pre><code/g, '<pre');
            content = content.replace(/<\/code>/g, '');
        }
        ar.content = content;
        ar.link = '/articles/' + ar.id + '.html';
        opts.article = ar;

        var html = ejs.render(tpl, opts);
        var output = root + 'articles/' + ar.id + '.html';
        fs.writeFileSync(output, html);
        logger.info('Build ' + output + ' completed!');
    });
};

/**
 * 生成整个网站
 * @param  {String} root papery根目录
 */
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
