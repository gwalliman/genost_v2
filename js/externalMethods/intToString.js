INTERPRETER.extMethodTable.push({
  id: "intToString",
  type: TERMINALS.STRING,
  paramTypes: [TERMINALS.INT],
  execute: function() {
    return '' + arguments[0];
  }
});
