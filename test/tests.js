var fs = require('fs');

var fse = require('fs-extra');
var should = require('chai').should();

var createRunner = require('../bin/create_runner');
var buildRunner = require('../bin/build_runner');
var serverRunner = require('../bin/server_runner');

var ex = fs.existsSync;

describe('Papery', function () {
    var tmpDir = './_test_tmp';
    var blogDir = tmpDir + '/blog';

    before(function () {
        if (fs.existsSync(tmpDir)) {
            fse.removeSync(tmpDir);
        }
        fs.mkdir(tmpDir);
    });

    describe('Create', function () {
        before(function () {
            createRunner.run([ blogDir ]);
        });

        it('should create root directory', function () {
            ex(blogDir).should.to.be.true;
        });
        it('should create sub-directories', function () {
            ex(blogDir + '/articles').should.to.be.true;
            ex(blogDir + '/assets').should.to.be.true;
            ex(blogDir + '/pages').should.to.be.true;
            ex(blogDir + '/templates').should.to.be.true;
        });
        it('should create yaml config files', function () {
            ex(blogDir + '/articles.yml').should.to.be.true;
            ex(blogDir + '/ext.yml').should.to.be.true;
            ex(blogDir + '/navbar.yml').should.to.be.true;
            ex(blogDir + '/pages.yml').should.to.be.true;
            ex(blogDir + '/site.yml').should.to.be.true;
        });
    });

    describe('Build', function () {
        before(function () {
            buildRunner.run([ blogDir ]);
        });

        it('should build index page', function () {
            ex(blogDir + '/index.html').should.to.be.true;
        });
        it('should build tag page', function () {
            ex(blogDir + '/tag.html').should.to.be.true;
        });
        it('should build RSS feed', function () {
            ex(blogDir + '/rss.xml').should.to.be.true;
        });
        it('should build articles', function () {
            ex(blogDir + '/articles/papery-quickstart.html').should.to.be.true;
            ex(blogDir + '/articles/code-and-math.html').should.to.be.true;
        });
        it('should build pages', function () {
            ex(blogDir + '/pages/about-me.html').should.to.be.true;
        });
    });

    after(function() {
        if (fs.existsSync(tmpDir)) {
            fse.removeSync(tmpDir);
        }
    });
});
