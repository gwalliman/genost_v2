function Var(body, callTokens)
{
  this.body = body;

  this.id = null; 
  this.vardecl = null;
  
  this.id = validateId(callTokens[1]) ? callTokens[1] : null;
}

Var.prototype.getId = function() {
  return this.id;
};

Var.prototype.print = function() {
  if(this.id !== null)
  {
    INTERPRETER.write("parse", "var " + this.id);
  }
  else
  {
    INTERPRETER.write("parse", "Empty VARCALL");
  }
};

/**
 * Ensure that the var actually exists in the varTable.
 */
/*Var.prototype.validate = function() {
{
  this.interpreter.writeln("validate", "Validating VAR");

  var variable = this.interpreter.findVar(this.body, this.id);
  if(variable == null)
  {
    this.interpreter.error("VAR", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "Var " + this.id + " is not defined.");
  }
};*/

/**
 * We get the variable's current value from the varTable and return it.
 */
/*public Object execute(Object args[]) 
{
  return interpreter.getVar(id);
}*/
