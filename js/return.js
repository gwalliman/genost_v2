/**
 * A return statement will stop execution of a body and return a certain value, defined by a CALL.
 * Note that the RETURN class itself just returns the value. It is up to the BODY/STMTLIST/STMT execution to actually stop execution once a RETURN is executed and returns.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function Return(body)
{
  this.body = body;

  this.type = null;
  this.call = null;

  var callTokens = INTERPRETER.getCurrentLineTokens().slice(0);

  //Get rid of the "return" and the semicolon
  callTokens.splice(0, 1);
  callTokens.splice(callTokens.length - 1);
  
  //Parsing CALL
  this.call = createCall(body, callTokens);
}

/**
 * Simple print function.
 */
Return.prototype.print = function() {
  INTERPRETER.write("parse", "return ");
  this.call.print();
};

/**
 * Ensure that the CALL type is the same as the parent method's type.
 * We also ensure here that the RETURN statement is actually within a method body.
 */
/*public void validate() 
{
  interpreter.write("validate", "Validating RETURN");
  
  //Get the type
  //We must wait until validation to determine type, since, if the call is a variable, the vartables may not have been fully populated in parsing.
  type = call.type();
  
  //Validate the CALL
  call.validate();
  
  //Ensure that the RETURN stmt appears in a method body.
  if(body.method == null) interpreter.error("RETURN", lineNum, code, "RETURN statement may only appear in a method!");
  
  //Ensure that the RETURN type is proper.
  if(!body.method.type().equals(type)) interpreter.error("RETURN", lineNum, code, "Method " + body.method.id() + " returns type " + body.method.type() + ", but RETURN statement is of type " + type);
}*/

/**
 * Execute the CALL and return the value.
 * 
 * @param args  should always be null
 * @return  returns the CALL's return value.
 */
/*public Object execute(Object[] args) 
{
  return call.execute(null);
}*/
