require('co-mocha');
var fs = require('co-fs');
var should = require('should');
var production = require('../build/production.js');


describe("Integration testing for assignment, basic call, vars, literals", function() {
  var interpreter = production.interpreter;
  interpreter.initialize();
  //interpreter.setMessageMask('tokenize', true);

  it("correctly parses moderately complex code with assignments, and calls of types var and int literal", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/correct_1.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();
    var body = interpreter.body;

    body.startLine.should.equal(0);
    body.finishLine.should.equal(5);
    body.stmts.length.should.equal(4);
    body.stmts[2].constructor.name.should.equal('Assignment');
    body.stmts[3].constructor.name.should.equal('Assignment');
    var assignment1 = body.stmts[2];
    assignment1.id.should.equal('ASDF');
    should.not.exist(assignment1.lhs); //We haven't validated yet so this should be null
    assignment1.call.constructor.name.should.equal("IntegerLiteral");
    assignment1.call.value.should.equal(10);
    var assignment2 = body.stmts[3];
    assignment2.id.should.equal('QWERTY');
    should.not.exist(assignment2.lhs); //We haven't validated yet so this should be null
    assignment2.call.constructor.name.should.equal("Var");
    assignment2.call.id.should.equal("ASDF");
  });

  it("correctly parses complex code with assignments, and calls of all types", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/correct_2.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();
    var body = interpreter.body;

    body.stmts[4].constructor.name.should.equal('Assignment');
    body.stmts[5].constructor.name.should.equal('Assignment');
    body.stmts[6].constructor.name.should.equal('Assignment');
    body.stmts[7].constructor.name.should.equal('Assignment');

    body.varTable[1].type.should.equal("int");
    body.varTable[2].type.should.equal("string");
    body.varTable[3].type.should.equal("bool");

    var assignment1 = body.stmts[4];
    assignment1.id.should.equal('ASDF');
    assignment1.call.constructor.name.should.equal("IntegerLiteral");
    assignment1.call.value.should.equal(10);

    var assignment2 = body.stmts[5];
    assignment2.id.should.equal('QWERTY');
    assignment2.call.constructor.name.should.equal("Var");
    assignment2.call.id.should.equal("ASDF");
 
    var assignment2 = body.stmts[6];
    assignment2.id.should.equal('naomi');
    assignment2.call.constructor.name.should.equal("StringLiteral");
    assignment2.call.value.should.equal("AWESOMENESS");
 
    var assignment2 = body.stmts[7];
    assignment2.id.should.equal('garret1');
    assignment2.call.constructor.name.should.equal("BooleanLiteral");
    assignment2.call.value.should.equal(true);
  });

  it("correctly parses complex code with assignments, and calls of all types, with different values", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/correct_4.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();
    var body = interpreter.body;

    var assignment2 = body.stmts[6];
    assignment2.id.should.equal('naomi');
    assignment2.call.constructor.name.should.equal("StringLiteral");
    assignment2.call.value.should.equal("SO COOL");

    var assignment2 = body.stmts[7];
    assignment2.id.should.equal('garret1');
    assignment2.call.constructor.name.should.equal("BooleanLiteral");
    assignment2.call.value.should.equal(false);
  });

  it("correctly parses a string call with a space in the string", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/correct_3.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();
    var body = interpreter.body;

    var assignment2 = body.stmts[6];
    assignment2.id.should.equal('naomi');
    assignment2.call.constructor.name.should.equal("StringLiteral");
    assignment2.call.value.should.equal(" SO COOL");
  });

  it("correctly responds to an int literal without a value", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_1.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(5);
      err.error.should.equal('Syntax error in integer.');
    }
  });
 
  it("correctly responds to a call without a valid type", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_2.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(5);
      err.error.should.equal('Invalid type for variable / method / data literal call');
    }

  });
 
  it("correctly responds to an assign statement without a lhs", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_3.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      //TODO: this should be handled better
      err.lineNum.should.equal(5);
      err.error.should.equal('ID must be alphanumeric.');
    }

  });
 
  it("correctly responds to an assign statement without the assign keyword", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_4.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(5);
      err.error.should.equal('STMT type is not valid.');
    }

  });
 
  it("correctly responds to an assignment with an RHS missing the var keyword", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_5.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(6);
      err.error.should.equal('Invalid type for variable / method / data literal call');
    }

  });
 
  it("correctly responds to an assignment with an RHS missing the string keyword", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_6.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(7);
      err.error.should.equal('Invalid type for variable / method / data literal call');
    }

  });
 
  it("correctly responds to an assignment with a malformed string in the RHS", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_7.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(7);
      err.error.should.equal('String must be wrapped in quotes');
    }

  });
 
  it("correctly responds to a malformed bool in the RHS", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_8.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(8);
      err.error.should.equal('Boolean value must be either true or false');
    }

  });
 
  it("correctly responds to an assign statement with a malformed var in the RHS", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_9.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(6);
      err.error.should.equal('ID must be alphanumeric.');
    }

  });
 
  it("correctly responds to a malformed bool in the RHS", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_10.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(8);
      err.error.should.equal('Boolean value must be either true or false');
    }

  });
 
  it("correctly responds to an assign statement missing an =", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_13.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(5);
      err.error.should.equal('Assignment statement requires an =');
    }
  });

  it("correctly responds to an assign with a boolean missing its value", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_14.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(8);
      err.error.should.equal('Syntax error in boolean.');
    }
  });

  it("correctly responds to an assign with a integer that is not a number", function* () {

    var testCode = yield fs.readFile('./codeTest/1_assignment/incorrect_15.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(5);
      err.error.should.equal('Provided integer is of invalid format');
    }
  });
 
});
