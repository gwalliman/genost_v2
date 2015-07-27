/**
 * Represents a string literal.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function StringLiteral(body, callTokens)
{
  this.body = body;

  this.value = null;

  //Ensure that the value is wrapped in quotes. If it is, strip the quotes and adopt the result as the value.
  if(callTokens[1].substring(0, 1) == TERMINALS.SYMBOLS.QUOTE && callTokens[1].substring(callTokens[1].length - 1, callTokens[1].length == TERMINALS.SYMBOLS.QUOTE))
  {
    this.value = callTokens[1].substring(1, callTokens[1].length - 1);
  }
  else
  {
    INTERPRETER.error("STRING", "String must be wrapped in quotes");
  }
}

/**
 * Simple print function - prints the value.
 */
StringLiteral.prototype.print = function() {
  INTERPRETER.write("parse", "string \"" + this.value + "\"");
};

/**
 * We have nothing to validate here, but we must implement the function.
 */
StringLiteral.prototype.validate = function() {
  INTERPRETER.writeln("validate", "Validating STRING");
};

/**
 * Return the value.
 */
/*public Object execute(Object args[]) 
{
  return value;
}*/
