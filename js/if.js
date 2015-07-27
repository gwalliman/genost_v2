/**
 * An IF statement conditionally executes a body of code depending on whether a linked CONDITIONLIST evaluates to true or not.
 * Note that IFs create a new scope for their code bodies, so any variables declared within the code body will be accessible only from within that body (and any child bodies).
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function If(body)
{
  this.body = body;
  this.codeBody = null;
  this.condition = null;
  this.elseif = null;
  this.else = null;
  
  var tokens = INTERPRETER.getCurrentLineTokens(); 
  
  //token[0] is "if", so token[1] should be the open paren to the CONDITIONLIST
  if(tokens[1] != TERMINALS.SYMBOLS.OPENPAREN)
  {
    INTERPRETER.error("IF", "IF must open with (");
  }
  
  //The last token should always be a closeparen.
  if(tokens[tokens.length - 1] != TERMINALS.SYMBOLS.CLOSEPAREN)
  {
    INTERPRETER.error("IF", "IF must close with )");
  }
  
  //PARSE CONDITIONLIST
  //If we have more than 3 tokens, then we have at least something in the CONDITIONLIST.
  if(tokens.length > 3)
  {
    cl = new CONDITIONLIST(interpreter, body, c, code.substring(4, code.length() - 1));
    var conditionTokens = tokens.slice(0);
    conditionTokens.splice(0, 2);
    conditionTokens.splice(conditionTokens.length - 1);
    this.condition = createCondition(this.body, conditionTokens);
  }
  else
  {
    INTERPRETER.error("IF", "IF must contain a condition list!");
  }

  //PARSE BODY
  //Move on to the next line and parse the BODY.
  INTERPRETER.goToNextLine();
  this.codeBody = new Body(body);
  INTERPRETER.goToNextLine();

  //PARSE ELSEIF
  //Get the next line. If we find an ELSEIF, parse it.
  tokens = INTERPRETER.getCurrentLineTokens();
  if(tokens[0] == TERMINALS.STMTTYPES.ELSEIF)
  {
    this.elseif = new ElseIf(this.body);
    INTERPRETER.goToNextLine();
    tokens = INTERPRETER.getCurrentLineTokens();
  }
  
  //PARSE ELSE
  if(tokens[0] == TERMINALS.STMTTYPES.ELSE)
  {
    if(tokens.length == 1)
    {
      this.else = new Else(this.body);
      INTERPRETER.goToNextLine();
    }
    else
    {
      INTERPRETER.error("IF", "Syntax error related to ELSE");
    }
  }

  INTERPRETER.goToPrevLine();
}

/**
 * @return  the first ELSEIF. If there are subsequent ones, must call the ELSEIF's own get function.
 */
If.prototype.getElseIf = function() {
  return this.elseif;
};

/**
 * @return  the ELSE, if there is one.
 */
If.prototype.getElse = function() {
  return this.else;
};

/**
 * @return  the code body for this statement
 */
If.prototype.getCodeBody = function() {
  return this.codeBody;
};

/**
 * Simple print function: prints the if, and the elseif / else if we have them.
 */
If.prototype.print = function() {
  INTERPRETER.write("parse", "if (");
  this.condition.print();
  INTERPRETER.writeln("parse", ")");
  this.codeBody.print();
  
  if(this.elseif !== null)
  {
    INTERPRETER.write("parse", '\n');
    this.elseif.print();
  }
  
  if(this.else !== null)
  {
    INTERPRETER.write("parse", '\n');
    this.else.print();
  }
};

/**
 * First, we validate the condition list.
 * Second, we validate the if body.
 * Third, we validate the elseif, if it exists.
 * Fourth, we validate the else, if it exists.
 */
/*public void validate() 
{
  interpreter.writeln("validate", "Validating IF");

  cl.validate();
  codeBody.validate();
  
  if(elseif != null)
  {
    elseif.validate();
  }
  
  if(els != null)
  {
    els.validate();
  }
}*/


/**
 * We get the result of executing the CONDITIONLIST.
 * If it is true, we execute the codeBody.
 * If it is not true, we execute the ELSEIF. This returns a boolean indicating whether it executed or not.
 * If the ELSEIF did not execute, then we execute the ELSE.
 * 
 * @param args  this should always be null
 * @return  this always returns null
 */
/*public Object execute(Object[] args) 
{
  boolean go = (Boolean) cl.execute(null); 
  if(go)
  {
    codeBody.execute(null);
  }
  else
  {
    //The ELSEIF may have multiple ELSEIFs embedded.
    //Therefore, we have to check a returned value to see if any of those ELSEIFs did, in fact, execute.
    boolean elsEx = false;
    if(elseif != null)
    {
      elsEx = (Boolean) elseif.execute(null);
    }
  
    //If the ELSEIFs did not execute (or if there is no ELSEIFs) and we have an ELSE, execute the ELSE.
    if(!elsEx && els != null)
    {
      els.execute(null);
    }
  }
  
  return null;
}*/
