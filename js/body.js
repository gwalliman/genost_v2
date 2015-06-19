/**
 * Every BODY variable contains a series of statements and a scope for variables.
 * 
 * BODY variables are nestable: bodies may appear within other bodies, in which case the former is the parent body of the latter.
 * In a nested (child) body, newly declared variables will override variables declared in a parent body, if the variables have the same ID.
 * However, no two variables may have the same name within a single body.
 * 
 * Note that all BODYs should be linked to their parent BODY by passing the parent BODY in via the constructor.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */

/** 
 * Links the body to its parent body, creates a var table,
 * finds the bounds of the body and creates the stmtList within the body's bounds.
 * 
 * @param b the parent body, or null if this is the main body.
 * @param c the Code object
 */
function Body(interpreter, body, code)
{
  this.interpreter = interpreter;

  //The parent body of the nonterminal. Note that this will only be different from the main body for nonterminals within METHODDEFINE code bodies.
  this.body = body;
  this.code = code;
  
  //The list of statements associated with the body.
  this.stmtList = null;

  //The code lines on which the body starts and ends.
  this.startLine = null;
  this.lineNum = null;
  this.finishLine = null;
  
  //If the BODY is the body of a method, we link to the methoddefine stmt here.
  this.method = null;
  
  //This table contains the list of variables specifically defined within this BODY's scope
  this.varTable = [];

  var currentLineTokens = this.interpreter.getCurrentLineTokens();

  //If we are at the beginning of a body (i.e. the current line is an open brace)
  if(currentLineTokens.length == 1 && currentLineTokens[0] == TERMINALS.SYMBOLS.OPENBRACE)
  {
    //Set the opening and closing lines
    this.lineNum = this.startLine = this.interpreter.getCurrentLineNum();
    this.findCloseBrace();
    
    //Move to first statement.
    this.interpreter.goToNextLine();

    //If this is not an empty body, create a StmtList
    if(this.interpreter.getCurrentLineNum() != this.finishLine)
    {
      this.stmtList = new StmtList(this.interpreter, this, this.code);
    }
  }
  //If we're not at the beginning of a body, then we have a problem
  else 
  {
    this.interpreter.error("BODY", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "Body must begin with {");
    this.findCloseBrace();
    this.interpreter.setCurrentLineNum(finishLine);
    this.interpreter.goToNextLine();
  }
}

/**
 * Goes through the code trying to find a matching closeBrace for the body.
 * Accounts for the existence of subbodies within the body we are searching.
 * 
 * @param c the Code object
 */
Body.prototype.findCloseBrace = function() {

  //We know we have one open brace.
  var numOpens = 1;
  while(numOpens !== 0 && this.interpreter.goToNextLine() !== null)
  {
    var currentLineTokens = this.interpreter.getCurrentLineTokens();
    if(currentLineTokens.length == 1 && currentLineTokens[0] == TERMINALS.SYMBOLS.OPENBRACE)
    {
      numOpens++;
    }
    else if(currentLineTokens.length == 1 && currentLineTokens[0] == TERMINALS.SYMBOLS.CLOSEBRACE)
    {
      numOpens--;
    }
  }

  if(numOpens === 0)
  {
    this.finishLine = this.interpreter.getCurrentLineNum();
    this.interpreter.setCurrentLineNum(this.startLine);
  }
  else 
  {
    this.interpreter.error("BODY", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "Body must end with }");
  }
};

/**
 * Getter for the stmtlist variable.
 * 
 * @return the body's stmtlist
 */
Body.prototype.getStmtList = function() {
  return this.stmtList;
};

/**
 * Getter for the startLine (the line which contains the body's open brace)
 * 
 * @return the starting line for the body
 */
Body.prototype.getStartLine = function() {
  return this.startLine;
};

/**
 * Getter for the finishLine (the line which contains the body's close brace)
 * 
 * @return the finishing line for the body
 */
Body.prototype.getFinishLine = function() {
  return this.finishLine;
};

/**
 * Prints the body and its stmts.
 * Also prints a line indicating the body's open and close line numbers.
 */
Body.prototype.print = function() {
  if(this.stmtList !== null)
  {
    this.interpreter.writeln("parse", "BODY: Start Line " + this.startLine + ", Finish Line " + this.finishLine);
    this.interpreter.writeln("parse", "{");
    if(this.stmtList !== null)
    {
      this.stmtList.print();
    }
    else
    {
      this.interpreter.write("parse", "EMPTY BODY");
    }
    this.interpreter.write("parse", "}");
  }
  else 
  {
    this.interpreter.write("parse", "EMPTY BODY");
  }
};

/**
 * Validation function for the body.
 * Validates the stmtlist, if it exists.
 */
/*public void validate() 
{
  interpreter.writeln("validate", "Validating BODY");
  if(stmtList != null)
  {
    stmtList.validate();
  }
}*/

/**
 * Execution function for the body.
 * We first add a layer to the varStack and populate it with entries for each vardecl in this body's scope.
 * We then execute the stmtList, if there is one.
 * After the stmtList has returned, we remove the top layer of the varStack, as we no longer care about those variables' values.
 * Finally, we return whatever value the stmtList returned.
 * 
 * @param args  If this is a method's codebody, then the method params will be passed in via args. Entries for these args will be made in the varStack.
 */
/*public Object execute(Object[] args) 
{
  //Create map for holding variable values.
  //This includes any variables declared in the body scope and any method parameters, if this is a method body.
  Map<String, Object> varMap = new HashMap<String, Object>();
  
  //Add entries for all vars in the varTable
  //We set default values here.
  for(VARDECL v : varTable)
  {
    if(v.type().equals(Terminals.INT))
      varMap.put(v.id(), 0);
    else if(v.type().equals(Terminals.STRING))
      varMap.put(v.id(), "");
    else if(v.type().equals(Terminals.BOOL))
      varMap.put(v.id(), false);
  }
  interpreter.getVarStack().add(varMap);
  
  //If this is a method codebody and it has parameters, set the value for the param vars in the varstack to those params.
  if(method != null && args != null)
  {
    for(int x = 0; x < args.length; x++)
    {
      String id = method.getParam(x).id();
      interpreter.setVar(id, args[x]);
    }
  }
  
  //Execute the body statements.
  Object retVal = null;
  if(stmtList != null)
  {
    retVal = stmtList.execute(args);
  }
  
  //Remove this map from the top of the stack
  interpreter.getVarStack().remove(interpreter.getVarStack().size() - 1);
  
  return retVal;
}*/
