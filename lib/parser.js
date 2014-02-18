/**
 * 解析YAML配置文件信息
 * @module lib/parser
 */

var _ = require('underscore');
var fs = require('fs');
var moment = require('moment');
var yaml = require('js-yaml');
var log4js = require('log4js');
var logger = log4js.getLogger();

/**
 * 所有YAML配置文件名称
 * @type {Array}
 */
var yamls = ['site', 'articles', 'pages', 'navbar', 'ext'];

/**
 * 根据articles配置生成标签
 * @param  {Object} obj 配置对象
 * @return {Object}     生成标签后的对象
 */
var generateTags = function (obj) {
    var m = {};
    obj.articles.forEach(function (article) {
        article.tags.forEach(function (tag) {
            if (! _.has(m, tag)) {
                m[tag] = [];
            }
            m[tag].push(article);
        });
    });
    obj.tags = [];
    obj.coreTags = [];
    _.keys(m).forEach(function (tag) {
        obj.tags.push({
            label: tag,
            count: m[tag].length,
            articles: m[tag]
        });
        if (m[tag].length > 1) {
            obj.coreTags.push({
                label: tag,
                count: m[tag].length
            });
        }
    });

    obj.tags = _.sortBy(obj.tags, function (tag) {
        return -tag.count;
    });
    obj.coreTags = _.sortBy(obj.coreTags, function (tag) {
        return -tag.count;
    });

    return obj;
};

/**
 * 生成RSS内容
 * @param  {Object} obj 配置对象
 * @return {Object}     生成RSS后的配置对象
 */
var generateRss = function (obj) {
    obj.site.rss.lastBuildDate = moment().format('ddd, DD MMM YYYY HH:mm:ss') + ' +0800';
    obj.site.rss.items = [];
    obj.articles.slice(0, obj.site.rss.max).forEach(function (article) {
        obj.site.rss.items.push({
            id: article.id,
            title: article.title,
            link: obj.site.link + '/articles/' + article.id + '.html?utm_source=rss&amp;utm_medium=rss&amp;utm_campaign=rss',
            guid: obj.site.link + '/articles/' + article.id + '.html',
            author: obj.site.master.email + ' ' + obj.site.master.name,
            pubDate: moment(article.postedOn).format('ddd, DD MMM YYYY HH:mm:ss') + ' +0800',
            description: ''
        });
    });

    return obj;
}

/**
 * 读取YAML配置并生成配置对象
 * @param  {String} root papery根目录
 * @return {Object}      配置对象
 */
exports.parseYaml = function (root) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var obj = {};
    yamls.forEach(function (y) {
        var path = root + y + '.yml';

        if (!fs.existsSync(path)) {
            logger.error(path + ' can not be found!');
            process.exit(1);
        }

        obj[y] = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
        logger.info('Load ' + path + ' completed!');
    });

    obj = generateTags(obj);
    obj = generateRss(obj);

    return obj;
};
