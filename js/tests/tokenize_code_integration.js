require('co-mocha');
var fs = require('co-fs');
var should = require('should');
var production = require('../build/production.min.js');

describe("tokenize_code_test", function() {
  var interpreter = production.interpreter;
  interpreter.initialize();

  it("properly tokenizes code", function* () {

    var testCode = yield fs.readFile('./codeTest/body_stmt_vardecl/correct_2.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.getCurrentLineTokens().length.should.equal(1);
    interpreter.getCurrentLineTokens()[0].should.equal('{');
    interpreter.goToNextLine();
    interpreter.getCurrentLineTokens().length.should.equal(1);
    interpreter.getCurrentLineTokens()[0].should.equal('}');
  });

  it("loads moderately complex code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/assignment/correct_2.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.setCurrentLineNum(2);
    interpreter.getCurrentLineTokens().length.should.equal(4);
    interpreter.getCurrentLineTokens()[0].should.equal('vardecl');
    interpreter.getCurrentLineTokens()[1].should.equal('int');
    interpreter.getCurrentLineTokens()[2].should.equal('QWERTY');
    interpreter.getCurrentLineTokens()[3].should.equal(';');
    interpreter.setCurrentLineNum(7);
    interpreter.getCurrentLineTokens().length.should.equal(6);
    interpreter.getCurrentLineTokens()[0].should.equal('assign');
    interpreter.getCurrentLineTokens()[2].should.equal('=');
    interpreter.getCurrentLineTokens()[4].should.equal('\"AWESOMENESS\"');
  });
});

/*describe("#interpreter_load_test_3", function() {
  it("loads the code correctly", function() {

    var testCode = 
      "loopfor -1\n" +
      "{\n" +
        'method drive(string "f");\n' +
        "waituntil ([method getSonars(int 1) < int 20] or [method getSonars(int 3) > int 50]);\n" +
        "if ([method getSonars(int 3) > int 50])\n" +
        "{\n" +
          "waitfor 500;\n" +
          "method turnAngle(int 90);\n" +
          'method drive(string "f");\n' +
          "waitfor 2000;\n" +
        "}\n" +
        "elseif ([method getSonars(int 1) < int 20])\n" +
        "{\n" +
          "method turnAngle(int -90);\n" +
        "}\n" +
      "}";

    var INTERPRETER = getInterpreter();

    INTERPRETER.initialize();
    INTERPRETER.loadCode(testCode);
    var codeObj = INTERPRETER.code;
    var numLines = codeObj.codeLength;
    var loadedCode = codeObj.codeString;
    expect(numLines).toBe(16);
    expect(loadedCode).toBe(testCode);
  });
});

describe("#interpreter_load_test_4", function() {
  it("loads the code correctly", function() {

    var testCode = 
      "{\n" +
        "methoddefine int testMethod()\n" +
        "{\n" +
          "return int 0;\n" +
        "}\n" +
        "methoddefine int testMethod2(int x)\n" +
        "{\n" +
          "assign ADSF = int 20;\n" +
          "assign garret1 = bool false;\n" +
          "return int 0;\n" +
        "}\n" +
        "methoddefine int testMethod3(int x, bool y, string z)\n" +
        "{\n" +
          "assign ADSF = int 20;\n" +
          "assign garret1 = bool false;\n" +
          "return int 0;\n" +
        "}\n" +
        "vardecl int ADSF;\n" +
        "vardecl int QWERTY;\n" +
        "vardecl string naomi;\n" +
        "vardecl bool garret1;\n" +
        "assign ADSF = int 10;\n" +
        "assign QWERTY = var ADSF;\n" +
        "assign naomi = string \"AWESOMENESS\";\n" +
        "assign garret1 = bool true;\n" +
        "method testMethod();\n" +
        "method testMethod2(var QWERTY);\n" +
        "method testMethod3(var ADSF, var garret1, var naomi);\n" +
        "method testMethod3(int 15, bool false, string \"cool\");\n" +
        "method testMethod2(method testMethod());\n" +
        "method testMethod3(method testMethod2(method testMethod()), bool true, string \"12345\");\n" +
        "method print(string \"Test\");\n" +
        "assign ADSF = method add(int 2, int 2);\n" +
        "method print(method intToString(var ADSF));\n" +
      "}";

    var INTERPRETER = getInterpreter();

    INTERPRETER.initialize();
    INTERPRETER.loadCode(testCode);
    var codeObj = INTERPRETER.code;
    var numLines = codeObj.codeLength;
    var loadedCode = codeObj.codeString;
    expect(numLines).toBe(35);
    expect(loadedCode).toBe(testCode);
  });
});*/
