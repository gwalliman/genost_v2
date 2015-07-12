require('co-mocha');
var fs = require('co-fs');
var should = require('should');
var production = require('../build/production.min.js');

var testCodeObject = { 
  getCodeLength: function() { 
    return 16; 
  },

  getLine: function(lineNum) {
    return lineNum;
  },
};

describe("line_number_test", function() {

  var INTERPRETER = production.interpreter;
  INTERPRETER.initialize();

  it("allows us to set the line number properly", function() {

    INTERPRETER.getCurrentLineNum().should.equal(0);
    INTERPRETER.code = testCodeObject;

    INTERPRETER.setCurrentLineNum(14);
    INTERPRETER.getCurrentLineNum().should.equal(14);

    INTERPRETER.setCurrentLineNum(3);
    INTERPRETER.getCurrentLineNum().should.equal(3);

    INTERPRETER.setCurrentLineNum(-5);
    INTERPRETER.getCurrentLineNum().should.equal(3);

    INTERPRETER.setCurrentLineNum(50);
    INTERPRETER.getCurrentLineNum().should.equal(3);
  });

  it("allows us to advance the code properly", function() {

    INTERPRETER.setCurrentLineNum(3);

    INTERPRETER.goToNextLine();
    INTERPRETER.getCurrentLineNum().should.equal(4);

    INTERPRETER.goToNextLine();
    INTERPRETER.getCurrentLineNum().should.equal(5);
  });

  it("allows us to retreat the code properly", function() {

    INTERPRETER.setCurrentLineNum(2);
    INTERPRETER.getCurrentLineNum().should.equal(2);

    INTERPRETER.goToPrevLine();
    INTERPRETER.getCurrentLineNum().should.equal(1);

    INTERPRETER.goToPrevLine();
    INTERPRETER.getCurrentLineNum().should.equal(0);

  });

  it("does not allow us to advance the code out of bounds", function() {

    INTERPRETER.setCurrentLineNum(14);
    INTERPRETER.getCurrentLineNum().should.equal(14);

    INTERPRETER.goToNextLine();
    INTERPRETER.getCurrentLineNum().should.equal(15);

    INTERPRETER.goToNextLine();
    INTERPRETER.getCurrentLineNum().should.equal(15);
  });

  it("does not allow us to retreat the code out of bounds", function() {

    INTERPRETER.setCurrentLineNum(0);
    INTERPRETER.getCurrentLineNum().should.equal(0);

    INTERPRETER.goToPrevLine();
    INTERPRETER.getCurrentLineNum().should.equal(0);
  });
});

describe("message_mask", function() {

  it("sets message mask properly", function() {
    var INTERPRETER = production.interpreter;
    INTERPRETER.initialize();

    INTERPRETER.canShowMessage('test').should.equal(false);
    INTERPRETER.setMessageMask('test', true);
    INTERPRETER.canShowMessage('test').should.equal(true);
    INTERPRETER.setMessageMask('test', false);
    INTERPRETER.canShowMessage('test').should.equal(false);
  });
});

describe("console_write", function() {

  it("writes properly to the console", function() {
    var INTERPRETER = production.interpreter;
    INTERPRETER.initialize();
    INTERPRETER.setMessageMask('test', true);
    INTERPRETER.write("test", "asdf").should.equal("asdf");
    INTERPRETER.writeln("test", "asdf").should.equal("asdf\n");

    INTERPRETER.setMessageMask('test', false);
    var write_und = INTERPRETER.write("test", "asdf");
    should.not.exist(write_und);
    var writeln_und = INTERPRETER.writeln("test", "asdf");
    should.not.exist(writeln_und);
  });
});
