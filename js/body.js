function Body(body)
{
  //The parent body of the nonterminal. Note that this will only be different from the main body for nonterminals within METHODDEFINE code bodies.
  this.body = body;
  
  //The list of statements associated with the body.
  this.stmts = [];

  //The code lines on which the body starts and ends.
  this.startLine = null;
  this.lineNum = null;
  this.finishLine = null;
  
  //If the BODY is the body of a method, we link to the methoddefine stmt here.
  this.method = null;
  
  //This table contains the list of variables specifically defined within this BODY's scope
  this.varTable = [];

  var currentLineTokens = INTERPRETER.getCurrentLineTokens();

  //If we are at the beginning of a body (i.e. the current line is an open brace)
  if(currentLineTokens.length == 1 && currentLineTokens[0] == TERMINALS.SYMBOLS.OPENBRACE)
  {
    //Set the opening and closing lines
    this.lineNum = this.startLine = INTERPRETER.getCurrentLineNum();
    this.findCloseBrace();
    
    //Move to first statement.
    INTERPRETER.goToNextLine();

    //If this is not an empty body, create a StmtList
    while(INTERPRETER.getCurrentLineNum() != this.finishLine)
    {
      this.stmts.push(createStmt(this));
      INTERPRETER.goToNextLine();
    }
  }
  //If we're not at the beginning of a body, then we have a problem
  else 
  {
    INTERPRETER.error("BODY", "Body must begin with {");
  }
}

Body.prototype.findCloseBrace = function() {

  //We know we have one open brace.
  var numOpens = 1;
  var lastLine = null;
  while(numOpens !== 0 && INTERPRETER.goToNextLine() !== lastLine)
  {
    lastLine = INTERPRETER.getCurrentLine();
    var currentLineTokens = INTERPRETER.getCurrentLineTokens();
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
    this.finishLine = INTERPRETER.getCurrentLineNum();
    INTERPRETER.setCurrentLineNum(this.startLine);
  }
  else 
  {
    INTERPRETER.error("BODY", "Body must end with }");
  }
};

Body.prototype.getStartLine = function() {
  return this.startLine;
};

Body.prototype.getFinishLine = function() {
  return this.finishLine;
};

Body.prototype.print = function() {
  if(this.stmts !== null)
  {
    INTERPRETER.writeln("parse", "BODY: Start Line " + this.startLine + ", Finish Line " + this.finishLine);
    INTERPRETER.writeln("parse", "{");
    INTERPRETER.write("parse", "}");
  }
  else 
  {
    INTERPRETER.write("parse", "EMPTY BODY");
  }
};

/*public void validate() 
{
  interpreter.writeln("validate", "Validating BODY");
  if(stmtList != null)
  {
    stmtList.validate();
  }
}*/

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
