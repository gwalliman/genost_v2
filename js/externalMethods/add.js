INTERPRETER.extMethodTable.push({
  id: 'add',
  type: TERMINALS.INT,
  paramTypes: [TERMINALS.INT, TERMINALS.INT],
  execute: function() {
    return arguments[0] + arguments[1];
  }
});
