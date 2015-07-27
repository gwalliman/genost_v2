require('co-mocha');
var fs = require('co-fs');
var should = require('should');
var production = require('../build/production.min.js');


describe("tokenize_code_test", function() {
  var interpreter = production.interpreter;
  interpreter.initialize();
  //interpreter.setMessageMask('tokenize', true);

  it("tokenizes simple code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/correct_2.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.setCurrentLineNum(0);
    interpreter.getCurrentLineTokens().length.should.equal(1);
    interpreter.getCurrentLineTokens()[0].should.equal('{');
    interpreter.goToNextLine();
    interpreter.getCurrentLineTokens().length.should.equal(1);
    interpreter.getCurrentLineTokens()[0].should.equal('}');
  });

  it("tokenizes moderately complex code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/correct_2.txt', 'utf-8');

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

  it("tokenizes complex code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_6.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.setCurrentLineNum(1);
    interpreter.getCurrentLineTokens().length.should.equal(5);
    interpreter.getCurrentLineTokens()[0].should.equal('methoddefine');
    interpreter.getCurrentLineTokens()[2].should.equal('testMethod');
    interpreter.getCurrentLineTokens()[4].should.equal(')');
    interpreter.setCurrentLineNum(11);
    interpreter.getCurrentLineTokens().length.should.equal(13);
    interpreter.getCurrentLineTokens()[0].should.equal('methoddefine');
    interpreter.getCurrentLineTokens()[1].should.equal('int');
    interpreter.getCurrentLineTokens()[3].should.equal('(');
    interpreter.getCurrentLineTokens()[5].should.equal('x');
    interpreter.getCurrentLineTokens()[6].should.equal(',');
    interpreter.getCurrentLineTokens()[7].should.equal('bool');
    interpreter.getCurrentLineTokens()[10].should.equal('string');
    interpreter.getCurrentLineTokens()[12].should.equal(')');
    interpreter.setCurrentLineNum(27);
    interpreter.getCurrentLineTokens().length.should.equal(13);
    interpreter.getCurrentLineTokens()[0].should.equal('method');
    interpreter.getCurrentLineTokens()[1].should.equal('testMethod3');
    interpreter.getCurrentLineTokens()[3].should.equal('var');
    interpreter.getCurrentLineTokens()[5].should.equal(',');
    interpreter.getCurrentLineTokens()[6].should.equal('var');
    interpreter.getCurrentLineTokens()[7].should.equal('garret1');
    interpreter.getCurrentLineTokens()[10].should.equal('naomi');
    interpreter.getCurrentLineTokens()[12].should.equal(';');
    interpreter.goToNextLine();
    interpreter.getCurrentLineTokens().length.should.equal(13);
    interpreter.getCurrentLineTokens()[0].should.equal('method');
    interpreter.getCurrentLineTokens()[1].should.equal('testMethod3');
    interpreter.getCurrentLineTokens()[3].should.equal('int');
    interpreter.getCurrentLineTokens()[5].should.equal(',');
    interpreter.getCurrentLineTokens()[6].should.equal('bool');
    interpreter.getCurrentLineTokens()[7].should.equal('false');
    interpreter.getCurrentLineTokens()[10].should.equal('"cool"');
    interpreter.getCurrentLineTokens()[12].should.equal(';');
    interpreter.setCurrentLineNum(30);
    interpreter.getCurrentLineTokens().length.should.equal(19);
    interpreter.getCurrentLineTokens()[1].should.equal('testMethod3');
    interpreter.getCurrentLineTokens()[3].should.equal('method');
    interpreter.getCurrentLineTokens()[4].should.equal('testMethod2');
    interpreter.getCurrentLineTokens()[5].should.equal('(');
    interpreter.getCurrentLineTokens()[6].should.equal('method');
    interpreter.getCurrentLineTokens()[7].should.equal('testMethod');
    interpreter.getCurrentLineTokens()[9].should.equal(')');
    interpreter.getCurrentLineTokens()[10].should.equal(')');
    interpreter.getCurrentLineTokens()[13].should.equal('true');
    interpreter.getCurrentLineTokens()[16].should.equal('"12345"');
    interpreter.getCurrentLineTokens()[17].should.equal(')');
    interpreter.getCurrentLineTokens()[18].should.equal(';');
  });

  it("tokenizes very complex code correctly", function* () {

    var testCode = yield fs.readFile('./codeTest/8_robotexecution/5.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.setCurrentLineNum(1);
    interpreter.getCurrentLineTokens().length.should.equal(2);
    interpreter.getCurrentLineTokens()[0].should.equal('loopfor');
    interpreter.getCurrentLineTokens()[1].should.equal('-1');
    interpreter.setCurrentLineNum(3);
    interpreter.getCurrentLineTokens().length.should.equal(7);
    interpreter.getCurrentLineTokens()[0].should.equal('method');
    interpreter.getCurrentLineTokens()[1].should.equal('drive');
    interpreter.getCurrentLineTokens()[3].should.equal('string');
    interpreter.setCurrentLineNum(4);
    interpreter.getCurrentLineTokens().length.should.equal(27);
    interpreter.getCurrentLineTokens()[0].should.equal('waituntil');
    interpreter.getCurrentLineTokens()[1].should.equal('(');
    interpreter.getCurrentLineTokens()[3].should.equal('method');
    interpreter.getCurrentLineTokens()[6].should.equal('int');
    interpreter.getCurrentLineTokens()[9].should.equal('<');
    interpreter.getCurrentLineTokens()[12].should.equal(']');
    interpreter.getCurrentLineTokens()[13].should.equal('or');
    interpreter.getCurrentLineTokens()[16].should.equal('getSonars');
    interpreter.getCurrentLineTokens()[19].should.equal('3');
    interpreter.getCurrentLineTokens()[22].should.equal('int');
    interpreter.getCurrentLineTokens()[23].should.equal('50');
    interpreter.getCurrentLineTokens()[26].should.equal(';');
    interpreter.setCurrentLineNum(5);
    interpreter.getCurrentLineTokens().length.should.equal(14);
    interpreter.getCurrentLineTokens()[0].should.equal('if');
    interpreter.getCurrentLineTokens()[2].should.equal('[');
    interpreter.getCurrentLineTokens()[4].should.equal('getSonars');
    interpreter.getCurrentLineTokens()[9].should.equal('>');
    interpreter.getCurrentLineTokens()[11].should.equal('50');
    interpreter.getCurrentLineTokens()[13].should.equal(')');
    interpreter.setCurrentLineNum(10);
    interpreter.getCurrentLineTokens().length.should.equal(3);
    interpreter.getCurrentLineTokens()[0].should.equal('waitfor');
    interpreter.getCurrentLineTokens()[1].should.equal('2');
    interpreter.setCurrentLineNum(12);
    interpreter.getCurrentLineTokens().length.should.equal(14);
    interpreter.getCurrentLineTokens()[0].should.equal('elseif');
  });
});
