/**
 * Represents a literal integer, which can be positive or negative.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function IntegerLiteral(body, callTokens)
{
  this.body = body;
  this.value = null; 
  
  /**
   * Takes the provided value and ensures that it is an integer.
   * If so, adopts it as a value.
   */

  //We should only have one token here, the literal itself
  if(callTokens.length == 2)
  {
    //Every valid integer should be of this format
    if(!isNaN(callTokens[1])) //TODO: This seems dangerous
    {
      this.value = parseInt(callTokens[1]);
    }
    else 
    {
      INTERPRETER.error("INTEGER", "Provided integer is of invalid format");
    }
  }
  else
  {
    INTERPRETER.error("INTEGER", "Syntax error in integer.");
  }
}

/**
 * Simple print function - prints the value.
 */
IntegerLiteral.prototype.print = function() {
  INTERPRETER.write("parse", "int " + this.value);
};

/**
 * We have nothing to validate here, but we must implement the function.
 */
IntegerLiteral.prototype.validate = function() {
  INTERPRETER.writeln("validate", "Validating INTEGER");
};

/**
 * Return the value.
 */
/*public Object execute(Object args[]) 
{
  return value;
}*/
