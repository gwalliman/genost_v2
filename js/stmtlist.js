
/**
 * A STMTLIST is simply a linked-list interpretation for statements.
 * Each STMTLIST node is one node in the linked list and has a reference to its consitituant STMT, along with various helper functions.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */

/**
 * Gets the next STMT, parses it, and moves on to the next one, if it exists.
 * 
 * @param b the parent body
 * @param c the code object
 */
function StmtList(interpreter, body)
{
  this.interpreter = interpreter;
  this.body = body;

  this.stmt = {};
  this.nextStmt = {};

  //Skip over any empty lines (i.e. whitespace only)
  while(this.interpreter.getCurrentLine().trim().length === 0) 
  { 
    this.interpreter.goToNextLine();
  }
  
  //If we are not at the end of the parent body, make a new STMT
  if(this.interpreter.getCurrentLineNum() != this.body.getFinishLine())
  {
    this.stmt = new Stmt(this.interpreter, this.body, this.code);
  }
  
  interpreter.goToNextLine();
  
  //If we are not at the end of the parent body or the end of the code, itself, add a new STMTLIST to the linked list
  if(this.interpreter.getCurrentLine() !== null && this.interpreter.getCurrentLineNum() != this.body.getFinishLine())
  {
    this.nextStmt = new StmtList(this.interpreter, this.body);
  }
}
  
/**
 * @return  the STMT for this STMTLIST
 */
StmtList.prototype.getStmt = function() {
  return this.stmt;
};

/**
 * @return  returns the next statement in the list. Returns NULL if this STMTLIST does not exist.
 */
StmtList.prototype.getNextStmt = function() {
  return this.nextStmt;
};

/**
 * Print function. Prints the current stmt and, if the next STMTLIST exists, prints that.
 */
StmtList.prototype.print = function() {
  if(this.stmt !== null)
  {
    this.stmt.print();
    this.interpreter.write("parse", "\n");
    
    if(this.nextStmt !== null)
    {
      this.nextStmt.print();
    }
  }
  else 
  {
    this.interpreter.writeln("parse", "EMPTY STMTLIST");
  }
};

/**
 * Validation function. If the STMT exists, call its validation function. If the next STMTLIST exists, call its validation function
 * 
 */
/*public void validate() 
{
  interpreter.writeln("validate", "Validating STMTLIST");
  stmt.validate();
  if(nextStmt != null)
  {
    nextStmt.validate();
  }
}*/

/**
 * Executes the current stmt. Tries to get a return value.
 * We will only ever get a return value if we are in a codeBody. If we do get one, we stop immediately and return the value.
 * If we do not get one, then we continue execution until we either get a return value or run out of stmts to execute.
 * 
 * @param args  any args passed to the body. This should always be null here.
 * @return  the return value for the STMTLIST, which will only not be null if the STMT is a return STMT and we are in a codeBody.
 * 
 */
/*public Object execute(Object args[]) 
{
  Object retVal = null;
  retVal = stmt.execute(null);
  
  if(retVal != null)
  {
    return retVal;
  }
  else if(nextStmt != null)
  {
    return nextStmt.execute(null);
  }
  else return null;
}*/

