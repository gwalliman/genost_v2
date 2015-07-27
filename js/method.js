/**
 * The METHOD class is used to call and execute a method.
 * When we parse the METHOD, we get its id and its parameters in the form of a CALLPARAMLIST.
 * When we validate the METHOD, we link the call up to the method definition.
 * When we execute the METHOD, we get the values of the parameters, and send them to the METHODDEFINE for execution.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function Method(body, methodTokens)
{
  this.body = body;
  
  this.id = null;
  this.paramCalls = [];
  this.methodDefine = null;
  
  this.id = validateId(methodTokens[1]) ? methodTokens[1] : null;
  
  //The third token should always be an OPENPAREN
  if(methodTokens[2] != TERMINALS.SYMBOLS.OPENPAREN)
  {
    INTERPRETER.error("METHOD", "ID must be followed by (");
  }
  
  //The last token should always be a CLOSEPAREN
  if(methodTokens[methodTokens.length - 1] != TERMINALS.SYMBOLS.CLOSEPAREN)
  {
    INTERPRETER.error("METHOD", "METHOD header must end with )");
  }
  
  //If the CLOSEPAREN is not the fourth token, then we must have parameters.
  if(methodTokens[3] != TERMINALS.SYMBOLS.CLOSEPAREN)
  {
    var paramCallsTokens = methodTokens.slice(0);
    paramCallsTokens.splice(0, 3);
    paramCallsTokens.splice(paramCallsTokens.length - 1);

    //We send the right half of the split above minus the last character, which is the CLOSEPAREN
    this.paramCalls = createParamCalls(body, paramCallsTokens);
  }
}

/**
 * @return  the METHOD id
 */
Method.prototype.getId = function() {
  return id;
};

/**
 * @return  the METHODDEFINE that this METHOD is calling
 */
Method.prototype.getMethDef = function() {
  return method;
};

/**
 * Simple print function
 */
Method.prototype.print = function() {
  INTERPRETER.write("parse", "method " + this.id + "(");
  if(this.paramCalls !== null)
  {
    for(var x = 0, length = paramCalls.length; x < length; x++)
    {
      paramCalls[x].print();
    }
  }
  INTERPRETER.write("parse", ")");
};

/**
 * First, ensure that the METHOD we are calling actually exists.
 * Second, validate the CALLPARAMLIST, if we have one.
 */
/*public void validate() 
{
  interpreter.writeln("validate", "Validating METHOD");

  //Look the method up in the method table. If it does not exist, we have a problem.
  method = interpreter.findMethod(id);
  if(method == null)
  {
    interpreter.error("METHOD", lineNum, code, "Method " + id + " is not defined.");
  }
  
  //Validate the CALLPARAMLIST if we have one.
  if(params != null)
  {
    params.validate();
  }
}*/

/**
 * If we have parameters, we must execute the CALLPARAMLIST to get the arguments for the function.
 * Either way, we call the execute function of the METHODDEFINE this METHOD is referencing.
 */
/*public Object execute(Object[] args) 
{
  if(params != null)
  {
    return method.execute((Object[]) params.execute(null));
  }
  else 
  {
    return method.execute(null);
    }
  }
}*/

