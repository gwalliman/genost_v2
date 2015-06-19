/**
 * A STMT is a single unit of functional code. One STMT performs one function.
 * STMT types are:
 * 1. Variable declarations (VARDECLs)
 * 2. Assigning some value to a variable (ASSIGNs)
 * 3. Method definitions, including definition of return type, parameters, and the code body (METHODDEFINEs)
 * 4. Method calls, including the parameters (METHODs)
 * 5. Return statements, which exit a method call (RETURNs)
 * 6. Conditional statements, including the condition, the body, and any ELSEIFs or ELSEs associated with it (IFs)
 * 7. Sections of code which loop until a certain condition is met (LOOPUNTILs)
 * 8. Sections of code which loop for a certain number of times (LOOPFORs)
 * 9. Statements which halt execution until a certain condition is met (WAITUNTILs)
 * 10. Statements which halt execution for a certain amount of time (WAITFORs)
 * 
 * @author Garret
 *
 */

/**
 * Determines what type of statement we have, and calls that corresponding type's parse function on the statement code.
 * 
 * @param b the parent body
 * @param c the Code object
 */
function Stmt(interpreter, body)
{
  this.interpreter = interpreter;
  this.body = body;
  this.lineNum = this.interpreter.getCurrentLineNum();
  this.codeLine = this.interpreter.getCurrentLine();
  this.tokenizedCode = this.interpreter.getCurrentLineTokens();

  //The STMT itself.
  this.stmt = {};
  //The type of statement
  this.stmtType = null;
    
  //All valid statements will have, as their first token, the statement type, separated from the rest of the code by a space.
  this.stmtType = TERMINALS.searchForTerminal(type[0], "STMTTYPES");
  if(this.stmtType)
  {
    if (this.stmtType == TERMINALS.STMTTYPES.VARDECL)
    {
      this.stmt = new Vardecl(this.interpreter, this.body);
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.ASSIGN)
    {
      this.stmt = new Assignment(this.interpreter, this.body);
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.METHODDEFINE)
    {
      this.stmt = new MethodDefine(this.interpreter, this.body);
    }
    //A METHOD is the only STMT which can be both a standalone STMT and a CALL.
    //Therefore the METHOD code expects there to be no ending semicolon, and so we process that semicolon here.
    else if (this.stmtType == TERMINALS.STMTTYPES.METHOD)
    {
      //Ensure that the semicolon exists. If it does, remove it and call the METHOD parser.
      var lastchar = this.code.substring(this.code.length - 1);
      if(lastchar != TERMINALS.STMTTYPES.SEMICOLON)
      {
        this.interpreter.error("METHOD", this.lineNum, this.codeLine, "Missing Semicolon");
      }
      this.stmt = new Method(this.interpreter, this.body, this.codeLine.substring(0, this.code.length - 1));
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.RETURN)
    {
      this.stmt = new Return(this.interpreter, this.body);
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.IF)
    {
      this.stmt = new If(this.interpreter, this.body);
    }
    //ELSEIFs and ELSEs should be handled in the IF code.
    //If we find a separate statement beginning with ELSEIF or ELSE, we must halt.
    else if (this.stmtType == TERMINALS.STMTTYPES.ELSEIF)
    {
      this.interpreter.error("STMT", this.lineNum, this.code, "ELSEIF must follow IF");
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.ELSE)
    {
      this.interpreter.error("STMT", this.lineNum, this.code, "ELSE must follow IF or ELSEIF");
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.LOOPUNTIL)
    {
      this.stmt = new LoopUntil(this.interpreter, this.body);
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.LOOPFOR)
    {
      this.stmt = new LoopFor(this.interpreter, this.body);
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.WAITUNTIL)
    {
      this.stmt = new WaitUntil(this.interpreter, this.body);
    }
    else if (this.stmtType == TERMINALS.STMTTYPES.WAITFOR)
    {
      this.stmt = new WaitFor(this.interpreter, this.body);
    }
  }
  else
  {
    this.interpreter.error("STMT", this.lineNum, this.code, "STMT type is not valid.");
  }
}
  
/**
 * Simple getter function, returns the statement type.
 * 
 * @return  the statement type
 */
Stmt.prototype.type = function() {
  return this.stmtType;
};

/**
 * @return  the stmt object itself.
 */
Stmt.prototype.getStmt = function() {
  return this.stmt;
};

/**
 * Printing function, determines what type of stmt this is ands calls that type's print function.
 */
Stmt.prototype.print = function() {
  stmt.print();
};

/**
 * Simple validation function, determines what kind of statement we have, and calls that type's validation function.
 */
/*public void validate() 
{
  interpreter.writeln("validate", "Validating STMT");
  if (stmtType.equals(TERMINALS.STMTTYPES.VARDECL))
    ((VARDECL)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.ASSIGN))
    ((ASSIGNMENT)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.METHODDEFINE))
    ((METHODDEFINE)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.METHOD))
    ((METHOD)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.RETURN))
    ((RETURN)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.IF))
    ((IF)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.LOOPUNTIL))
    ((LOOPUNTIL)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.LOOPFOR))
    ((LOOPFOR)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.WAITUNTIL))
    ((WAITUNTIL)stmt).validate();
  else if (stmtType.equals(TERMINALS.STMTTYPES.WAITFOR))
    ((WAITFOR)stmt).validate();
}

/**
 * Determines what type of statement we have, and calls that statement's execute function.
 * Note that we do not execute METHODDEFINE, as this will execute the METHODDEFINE's code body, which should not happen until that method is actually called!
 * 
 * @param args  any arguments passed to the statement. Only a METHOD stmt will have any valid arguments; otherwise, this should be null
 * @return  no STMT should ever return any values, so this should always be null (though ultimately what is returned is handled by the statement types themselves)
 */
/*public Object execute(Object args[]) 
{
  if(Thread.interrupted())
  {
    Interpreter.halt();
    return null;
  }
  else
  {
    if (stmtType.equals(TERMINALS.STMTTYPES.VARDECL))
      return ((VARDECL)stmt).execute(null);
    else if (stmtType.equals(TERMINALS.STMTTYPES.ASSIGN))
      return ((ASSIGNMENT)stmt).execute(null);
    else if (stmtType.equals(TERMINALS.STMTTYPES.METHODDEFINE))
      //We don't execute the METHODDEFINE, as this will execute the actual method!
      return null;
    else if (stmtType.equals(TERMINALS.STMTTYPES.METHOD))
      return ((METHOD)stmt).execute(args);
    else if (stmtType.equals(TERMINALS.STMTTYPES.RETURN))
      return ((RETURN)stmt).execute(null);
    else if (stmtType.equals(TERMINALS.STMTTYPES.IF))
      return ((IF)stmt).execute(null);
    else if (stmtType.equals(TERMINALS.STMTTYPES.LOOPUNTIL))
      return ((LOOPUNTIL)stmt).execute(null);
    else if (stmtType.equals(TERMINALS.STMTTYPES.LOOPFOR))
      return ((LOOPFOR)stmt).execute(null);
    else if (stmtType.equals(TERMINALS.STMTTYPES.WAITUNTIL))
      return ((WAITUNTIL)stmt).execute(null);
    else if (stmtType.equals(TERMINALS.STMTTYPES.WAITFOR))
      return ((WAITFOR)stmt).execute(null);
    else
      return null;
  }
}*/
