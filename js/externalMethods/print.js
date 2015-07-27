INTERPRETER.extMethodTable.push({
  id: 'print',
  type: TERMINALS.VOID,
  paramTypes: [TERMINALS.STRING],
  execute: function() {
    INTERPRETER.writeln("message", arguments[0]);
    return null;
  }
});
