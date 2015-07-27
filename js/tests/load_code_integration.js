require('co-mocha');
var fs = require('co-fs');
var should = require('should');
var production = require('../build/production.min.js');

describe("interpreter_load_test", function() {

  var INTERPRETER = production.interpreter;
  INTERPRETER.initialize();

  it("loads basic code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/correct_2.txt', 'utf-8');

    INTERPRETER.loadCode(testCode);
    var codeObj = INTERPRETER.code;
    var numLines = codeObj.codeLength;
    var loadedCode = codeObj.codeString;
    numLines.should.equal(2);
    loadedCode.should.equal(testCode);

  });
  it("loads moderately complex code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/correct_2.txt', 'utf-8');

    INTERPRETER.loadCode(testCode);
    var codeObj = INTERPRETER.code;
    var numLines = codeObj.codeLength;
    var loadedCode = codeObj.codeString;
    numLines.should.equal(10);
    loadedCode.should.equal(testCode);
  });

  it("loads complex code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/8_robotexecution/5.txt', 'utf-8');

    INTERPRETER.loadCode(testCode);
    var codeObj = INTERPRETER.code;
    var numLines = codeObj.codeLength;
    var loadedCode = codeObj.codeString;
    numLines.should.equal(18);
    loadedCode.should.equal(testCode);
  });

  it("loads very complex code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_6.txt', 'utf-8');

    INTERPRETER.loadCode(testCode);
    var codeObj = INTERPRETER.code;
    var numLines = codeObj.codeLength;
    var loadedCode = codeObj.codeString;
    numLines.should.equal(35);
    loadedCode.should.equal(testCode);
  });
});
