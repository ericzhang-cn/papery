require('chai').should();

var parser = require('../lib/parser');

describe('papery', function () {
    describe('parser', function () {
        it('should be a object', function () {
            parser.should.be.a('object');
        });
    });
});
