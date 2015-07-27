function Assignment(body)
{
  this.body = body;
  
  this.id = null;
  this.call = null;
  this.lhs = null;

  var tokens = INTERPRETER.getCurrentLineTokens();
    
  this.id = validateId(tokens[1]) ? tokens[1] : null;

  //Equals should always be the second token.
  if(tokens[2] != TERMINALS.SYMBOLS.EQUALS)
  {
    INTERPRETER.error("ASSIGNMENT", "Assignment statement requires an =");
  }

  var rhsTokens = tokens.slice(3);
  rhsTokens.splice(rhsTokens.length - 1);

  //Parsing CALL
  this.call = createCall(body, rhsTokens);
}

Assignment.prototype.print = function() {
  INTERPRETER.write("parse", "assign " + this.id + " = ");
  this.call.print();
};

/**
 * IN THIS ORDER
 * 1. Validate call
 * 2. Ensure that lhs exists
 * 3. Ensure that lhs and rhs are of same type
 */
/*Assignment.prototype.validate() {
  this.interpreter.writeln("validate", "Validating ASSIGNMENT");
  
  //1. Validating CALL
  this.call.validate();
  
  //2. Ensure that lhs exists.
  this.lhs = this.interpreter.findVar(this.body, this.id);
  if(this.lhs == null)
  {
    this.interpreter.error("ASSIGNMENT", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "Variable " + this.id + " is not defined.");
  }
  
  //3. Ensure that lhs and rhs are of same type
  var lhsType = this.lhs.type();
  var rhsType = this.call.type();
  
  if(!lhsType.equals(rhsType))
  {
    this.interpreter.error("ASSIGNMENT", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "LHS and RHS of an assignment must be of same type, but LHS is " + lhsType + " and RHS is " + rhsType);
  }
}

Assignment.prototype.execute(Object args[]) {
{
  Object val = call.execute(null);
  
  //Note that we don't have to worry about types,
  //This was taken care of in Validation
  interpreter.setVar(lhs.id(), val);
  
  return null;
}*/
