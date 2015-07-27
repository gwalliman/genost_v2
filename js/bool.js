/**
 * Represents a literal boolean object.
 * Can be either true or false.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function BooleanLiteral(body, callTokens)
{
  this.body = body;
  
  this.value = null;
  
  if(callTokens.length == 2)
  {
    if(TERMINALS.booleanVals.indexOf(callTokens[1] > -1))
    {
      this.value = (callTokens[1] === "true");
    }
    else
    {
      INTERPRETER.error("BOOLEAN", "Boolean value must be either true or false");
    }
  }
  else
  {
    INTERPRETER.error("BOOLEAN", "Syntax error in boolean.");
  }
}

/**
 * Simple print function - prints the value.
 */
BooleanLiteral.prototype.print = function() {
  INTERPRETER.write("parse", "bool " + this.value);
};

/**
 * We have nothing to validate here, but we must implement the function.
 */
BooleanLiteral.prototype.validate = function() { 
  INTERPRETER.writeln("validate", "Validating BOOLEAN");
};

/**
 * Return the value.
 * 
 * @param args  always null
 * @return  the boolean value
 */
/*public Object execute(Object args[]) 
{
  return value;
}*/
