var _ = require('underscore'),
    fs = require('fs'), 
    winston = require('winston'),
    moment = require('moment'),
    yaml = require('js-yaml');

var yamls = ['site', 'articles', 'pages', 'navbar', 'pages'];

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

    obj.site.meta.keywords = _.keys(m).join(',');

    return obj;
};

var generateRss = function (obj) {
    obj.site.rss.lastBuildDate = moment().format('ddd, DD MMM YYYY HH:mm:ss') + ' +0800';
    obj.site.rss.items = [];
    obj.articles.slice(0, obj.site.rss.max).forEach(function (article) {
        obj.site.rss.items.push({
            title: article.title,
            link: obj.site.link + '/articles/' + article.id + '.html?utm_source=rss&amp;utm_medium=rss',
            guid: obj.site.link + '/articles/' + article.id + '.html',
            author: obj.site.master.email + ' ' + obj.site.master.name,
            pubDate: moment(article.postedOn).format('ddd, DD MMM YYYY HH:mm:ss') + ' +0800',
            description: article.abstract
        });
    });

    return obj;
}

exports.parseYaml = function (root) {
    if (root.slice(-1) !== '/') {
        root += '/';
    }

    var obj = {};
    yamls.forEach(function (y) {
        var path = root + y + '.yml';

        if (!fs.existsSync(path)) {
            winston.log('error', '无法读取配置文件 %s', path);
            process.exit(1);
        }

        obj[y] = require(path);
        winston.log('info', '读取配置文件 %s 完成', path);
    });

    obj = generateTags(obj);
    obj = generateRss(obj);

    return obj;
};
