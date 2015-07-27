require('co-mocha');
var fs = require('co-fs');
var should = require('should');
var production = require('../build/production.js');


describe("Integration testing for methoddefine, method, params", function() {
  var interpreter = production.interpreter;
  interpreter.initialize();
  //interpreter.setMessageMask('tokenize', true);

  it("correctly parses code containing methoddefines", function* () {

    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_1.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();

    interpreter.methodTable.length.should.equal(1);
    var method = interpreter.methodTable[0];

    method.type.should.equal('int');
    method.methodType.should.equal('internal');
    method.id.should.equal('testMethod');
    method.params.length.should.equal(0);

    var codeBody = method.codeBody;
    codeBody.stmts.length.should.equal(3);
    codeBody.stmts[0].constructor.name.should.equal('Assignment');
    codeBody.stmts[1].constructor.name.should.equal('Assignment');
    codeBody.stmts[2].constructor.name.should.equal('Return');
    codeBody.stmts[2].call.constructor.name.should.equal('IntegerLiteral');
    codeBody.stmts[2].call.value.should.equal(0);
  });

  it("correctly parses code containing methoddefines (and params)", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_2.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();

    interpreter.methodTable.length.should.equal(3);
    var method = interpreter.methodTable[2];

    method.type.should.equal('int');
    method.methodType.should.equal('internal');
    method.id.should.equal('testMethod3');
    method.params.length.should.equal(3);

    method.params[0].type.should.equal('int');
    method.params[0].id.should.equal('x');
    method.params[1].type.should.equal('bool');
    method.params[1].id.should.equal('y');
    method.params[2].type.should.equal('string');
    method.params[2].id.should.equal('z');

    var codeBody = method.codeBody;
    codeBody.stmts.length.should.equal(3);
    codeBody.stmts[0].constructor.name.should.equal('Assignment');
    codeBody.stmts[1].constructor.name.should.equal('Assignment');
  });

  it("correctly parses code containing method calls of different types (with params)", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_3.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();

    var body = interpreter.body;

    body.stmts.length.should.equal(15);
    var method1 = body.stmts[11];
    method1.constructor.name.should.equal('Method');
    method1.id.should.equal('testMethod');
    method1.paramCalls.length.should.equal(0);

    var method2 = body.stmts[12];
    method2.constructor.name.should.equal('Method');
    method2.id.should.equal('testMethod2');
    method2.paramCalls.length.should.equal(1);
    method2.paramCalls[0].constructor.name.should.equal('Var');
    method2.paramCalls[0].id.should.equal('QWERTY');

    var method3 = body.stmts[13];
    method3.constructor.name.should.equal('Method');
    method3.id.should.equal('testMethod3');
    method3.paramCalls.length.should.equal(3);
    method3.paramCalls[0].constructor.name.should.equal('Var');
    method3.paramCalls[0].id.should.equal('ADSF');
    method3.paramCalls[1].constructor.name.should.equal('Var');
    method3.paramCalls[1].id.should.equal('garret1');
    method3.paramCalls[2].constructor.name.should.equal('Var');
    method3.paramCalls[2].id.should.equal('naomi');

    var method4 = body.stmts[14];
    method4.constructor.name.should.equal('Method');
    method4.id.should.equal('testMethod3');
    method4.paramCalls.length.should.equal(3);
    method4.paramCalls[0].constructor.name.should.equal('IntegerLiteral');
    method4.paramCalls[0].value.should.equal(15);
    method4.paramCalls[1].constructor.name.should.equal('BooleanLiteral');
    method4.paramCalls[1].value.should.equal(false);
    method4.paramCalls[2].constructor.name.should.equal('StringLiteral');
    method4.paramCalls[2].value.should.equal('cool');
 
  });

  it("correctly parses code containing method calls with methods calls as parameters", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_4.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();

    var body = interpreter.body;
    body.stmts.length.should.equal(17);

    var method1 = body.stmts[15];
    method1.constructor.name.should.equal('Method');
    method1.id.should.equal('testMethod2');
    method1.paramCalls.length.should.equal(1);
    method1.paramCalls[0].constructor.name.should.equal('Method');
    method1.paramCalls[0].id.should.equal('testMethod');
    method1.paramCalls[0].paramCalls.length.should.equal(0);

    var method2 = body.stmts[16];
    method2.constructor.name.should.equal('Method');
    method2.id.should.equal('testMethod3');
    method2.paramCalls.length.should.equal(3);
    method2.paramCalls[0].constructor.name.should.equal('Method');
    method2.paramCalls[0].id.should.equal('testMethod2');
    method2.paramCalls[0].paramCalls.length.should.equal(1);
    method2.paramCalls[0].paramCalls[0].constructor.name.should.equal('Method');
    method2.paramCalls[0].paramCalls[0].id.should.equal('testMethod');
    method2.paramCalls[0].paramCalls[0].paramCalls.length.should.equal(0);
  });

  it("correctly parses code containing a basic external method call", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_5.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();

    var body = interpreter.body;
    body.stmts.length.should.equal(18);
    
    var extMethod = body.stmts[17];
    extMethod.constructor.name.should.equal('Method');
    extMethod.id.should.equal('print');
    extMethod.paramCalls.length.should.equal(1);
    extMethod.paramCalls[0].constructor.name.should.equal('Var');
    extMethod.paramCalls[0].id.should.equal('naomi');
  });

  it("correctly parses code containing complex external method calls", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/correct_6.txt', 'utf-8');

    interpreter.loadCode(testCode);
    interpreter.parseCode();

    var body = interpreter.body;
    body.stmts.length.should.equal(20);

    var assign = body.stmts[18];
    assign.constructor.name.should.equal('Assignment')
    assign.id.should.equal('ADSF');
    assign.call.constructor.name.should.equal('Method');
    assign.call.id.should.equal('add');
    assign.call.paramCalls.length.should.equal(2);
    assign.call.paramCalls[0].constructor.name.should.equal('IntegerLiteral');
    assign.call.paramCalls[0].value.should.equal(2);
    assign.call.paramCalls[1].constructor.name.should.equal('IntegerLiteral');
    assign.call.paramCalls[1].value.should.equal(4);

    var extMethod = body.stmts[19];
    extMethod.constructor.name.should.equal('Method');
    extMethod.id.should.equal('print');
    extMethod.paramCalls.length.should.equal(1);
    extMethod.paramCalls[0].constructor.name.should.equal('Method');
    extMethod.paramCalls[0].id.should.equal('intToString');
    extMethod.paramCalls[0].paramCalls.length.should.equal(1);
    extMethod.paramCalls[0].paramCalls[0].constructor.name.should.equal('Var');
    extMethod.paramCalls[0].paramCalls[0].id.should.equal('ADSF');
  }); 

  it("correctly responds to a malformed methoddefine opening statement", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_1.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      //TODO: I don't like the error message this gives
      err.lineNum.should.equal(1);
      err.error.should.equal('Missing Semicolon');
    }
  });

  it("correctly responds to a methoddefine without a return type", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_2.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.error.should.equal('Invalid METHODDEFINE data type. Must be void, int, string, or bool');
    }
  });


  it("correctly responds to a methoddefine with a missing open paren", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_3.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.error.should.equal('ID must be followed by (');
    }
  });


  it("correctly responds to a methoddefine without an open brace opening the body", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_4.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(2);
      err.error.should.equal('Body must begin with {');
    }
  });

  it("correctly responds to a methoddefine without a close brace closing the body", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_5.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(29);
      err.error.should.equal('Body must end with }');
    }
  });

  it("correctly responds to a methoddefine without a close paren closing the header", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_6.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.error.should.equal('METHODDEFINE header must end with )');
    }
  });


  it("correctly responds to a methoddefine with the same name as an external method", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_7.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(1);
      err.error.should.equal('Cannot create method of the name print, this is a reserved method');
    }
  });

  it("correctly responds to a method call without an id", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_8.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      //TODO: I don't like the error message this gives
      err.lineNum.should.equal(24);
      err.error.should.equal('ID must be alphanumeric.');
    }
  });


  it("correctly responds to a method call without an openparen", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_9.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      //TODO: I don't like the error message this gives
      err.lineNum.should.equal(24);
      err.error.should.equal('ID must be followed by (');
    }
  });


  it("correctly responds to a method call without a closeparen", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_10.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(25);
      err.error.should.equal('METHOD header must end with )');
    }
  });


  it("correctly responds to a method call with a double comma (missing argument) in the param list", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_11.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(26);
      err.error.should.equal('Invalid type for variable / method / data literal call');
    }
  });


  it("correctly responds to a method call with a parameter missing its datatype", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_12.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(27);
      err.error.should.equal('Invalid type for variable / method / data literal call');
    }
  });

  it("correctly responds to a methoddefine with a vardecl in the body whose id is the same as a parameter id", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_13.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(7);
      err.error.should.equal('Cannot declare VARDECL with same name as method parameter!');
    }
  });

  it("correctly responds to a CALLPARAMLIST with a method call missing its open paren", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_14.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(29);
      err.error.should.equal('METHOD argument must have open paren following ID!');
    }
  });

  it("correctly responds to a CALLPARAMLIST with a method call missing its close paren", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_15.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(30);
      err.error.should.equal('METHOD header must end with )');
    }
  });

  it("correctly responds to a methoddefine with a missing param datatype in its paramlist", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_16.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(11);
      err.error.should.equal('Invalid DEFPARAMLIST data type. Must be int, string, or bool');
    }
  });

  it("correctly responds to a methoddefine with a missing comma in its defparamlist", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_17.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(11);
      err.error.should.equal('There must be a comma between each parameter in a DEFPARAMLIST');
    }
  });

  it("correctly responds to a defparamlist with malformed tokens", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_18.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(11);
      err.error.should.equal('Syntax error in DEFPARAMLIST');
    }
  });

  it("correctly responds to a defparamlist with malformed tokens", function* () {
    var testCode = yield fs.readFile('./codeTest/2_methoddefine_and_method/incorrect_19.txt', 'utf-8');

    try
    {
      interpreter.loadCode(testCode);
      interpreter.parseCode();
    }
    catch(err)
    {
      err.lineNum.should.equal(11);
      err.error.should.equal('Syntax error in DEFPARAMLIST');
    }
  });


});

