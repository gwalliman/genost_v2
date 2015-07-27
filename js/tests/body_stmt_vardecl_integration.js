require('co-mocha');
var fs = require('co-fs');
var should = require('should');
var production = require('../build/production.js');


describe("Integration testing for body, basic statements, vardecl", function() {
  var interpreter = production.interpreter;
  interpreter.initialize();
  //interpreter.setMessageMask('tokenize', true);

  it("correctly parses moderately complex body_stmt_vardecl code", function* () {

    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/correct_1.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();
    var body = interpreter.body;
    body.startLine.should.equal(0);
    body.finishLine.should.equal(3);
    body.stmts.length.should.equal(2);
    body.stmts[0].constructor.name.should.equal('Vardecl');
    body.stmts[1].constructor.name.should.equal('Vardecl');
    body.varTable.length.should.equal(2);
    body.varTable[0].type.should.equal('int');
    body.varTable[0].id.should.equal('x');
    body.varTable[1].type.should.equal('int');
    body.varTable[1].id.should.equal('y');
  });

  it("correctly parses simple body_stmt_vardecl code", function* () {

    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/correct_2.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();
    var body = interpreter.body;
    body.startLine.should.equal(0);
    body.finishLine.should.equal(1);
    body.stmts.length.should.equal(0);
  });

  it("correctly responds to a body with a missing open brace", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_1.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(0);
      err.error.should.equal('Body must begin with {');
      err.code.toString().should.equal('vardecl int x;');
    }
  });

  it("correctly responds to a body with a missing close brace", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_2.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(2);
      err.error.should.equal('Body must end with }');
      err.code.toString().should.equal('vardecl int y;');
    }
  });

  it("correctly responds to a statement without a valid first token (vardecl, if, waituntil, etc.)", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_3.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.code.toString().should.equal('int x;');
      err.error.should.equal('STMT type is not valid.');
    }
  });

  it("correctly responds to a vardecl without a datatype", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_4.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(2);
      err.code.toString().should.equal('vardecl y;');
      err.error.should.equal('Invalid VARDECL data type. Must be int, string, or bool');
    }
  });

  it("correctly responds to a vardecl without a valid variable", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_5.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.code.toString().should.equal('vardecl int ;');
      err.error.should.equal('ID must be alphanumeric.');
    }
  });

  it("correctly responds to a statement with a missing semicolon", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_6.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.code.toString().should.equal('vardecl int x');
      err.error.should.equal('Missing Semicolon');
    }
  });

  it("correctly responds to a vardecl with a reserved variable name", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_7.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.code.toString().should.equal('vardecl bool if;');
      err.error.should.equal('ID cannot be reserved word');
    }
  });

  it("correctly responds to a vardecl with a non-alphanumeric variable name", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_8.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.code.toString().should.equal('vardecl int a0-;');
      err.error.should.equal('ID must be alphanumeric.');
    }
  });

  it("correctly responds to a vardecl with a void datatype", function* () {
    var testCode = yield fs.readFile('./codeTest/0_body_stmt_vardecl/incorrect_9.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.code.toString().should.equal('vardecl void asdf;');
      err.error.should.equal('Invalid VARDECL data type. Must be int, string, or bool');
    }
  });
});
