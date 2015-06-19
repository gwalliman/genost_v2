var interpreter = require('../interpreter.js');
describe("#interpreter_load_test", function() {
  it("loads the code correctly", function() {
    var code = 

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
"}\n";

    interpreter.INTERPRETER.initialize();
    interpreter.INTERPRETER.loadCode(code);
    var numLines = interpreter.INTERPRETER.code.codeLength;
    var loadedCode = interpreter.INTERPRETER.code.codeString;
    expect(numLines).toBe();
    expect(loadedCode).toBe(code);
  });
});
