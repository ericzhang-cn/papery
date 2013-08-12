require('chai').should();

var parser = require('../lib/parser');

describe('papery', function () {
    describe('parser', function () {
        it('should to be an object', function () {
            parser.should.to.be.an('object');
        });
    });
});
