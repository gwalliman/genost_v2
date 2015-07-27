/**
 * A METHODDEFINE, as its name suggests, defines a method, which may be executed elsewhere in the code.
 * The METHODDEFINE consists of three items: 
 * 1. A code body to execute
 * 2. A list of parameter types which are passed in when executing the method
 * 3. A return value type which should be returned by the code body execution.
 * 
 * We use the METHODDEFINE for two types of methods: internal and external.
 * An internal method is defined entirely within the provided code. We must parse the code to determine the three items listed above.
 * An external method is one that is preprogrammed - its parameter types and return types are stored in packaged code, and must be read in at runtime.
 * Note that an external method has no BODY - its own execution is handled by an execution function that it defines in its packaged code.
 * We create a METHODDEFINE for our external methods so that we have one unified way of calling methods, which is using the METHODDEFINE.
 * 
 * Note that METHODDEFINEs create a new scope for their code bodies, so any variables declared within the code body will be accessible only from within that body (and any child bodies).
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function Methoddefine(body, extMethod)
{
  this.body = body;

  //TYPE is the datatype the method returns
  this.type = null;

  //METHODTYPE is "internal" or "external", as defined above
  this.methodType = null;

  //ID is the name of the method
  this.id = null;

  this.codeBody = null;

  //The parameters (types and internal id) for the method
  this.params = [];

  if(extMethod !== undefined)
  {
    this.methodType = 'external';
    this.id = extMethod.id;
    this.type = extMethod.type;

    if(extMethod.hasOwnProperty('paramTypes') && extMethod.paramTypes !== null)
    {
      //Get the parameters and create a DEFPARAMLIST for them.
      this.params = createDefParamListExternal(body, extMethod.paramTypes);
    }
  }
  else
  {
    
    //This is an internal method
    this.methodType = 'internal';
      
    var tokens = INTERPRETER.getCurrentLineTokens();
    
    //Get the method's return type, which should always be the first token
    this.type = tokens[1];
    if(TERMINALS.dataTypes.indexOf(this.type) <= -1) 
    {
      INTERPRETER.error("METHODDEFINE", "Invalid METHODDEFINE data type. Must be void, int, string, or bool");
    }
      
    //Get the ID, which should always be the third token.
    this.id = validateId(tokens[2]) ? tokens[2] : null;

    for(var a = 0, extMethodTableLength = INTERPRETER.extMethodTable.length; a < extMethodTableLength; a++)
    {
      if(INTERPRETER.extMethodTable[a].id == this.id)
      {
        INTERPRETER.error("METHODDEFINE", "Cannot create method of the name " + this.id + ", this is a reserved method");
      }
    }
    
    //Fourth token should always be OPENPAREN
    if(tokens[3] != TERMINALS.SYMBOLS.OPENPAREN)
    {
      INTERPRETER.error("METHODDEFINE", "ID must be followed by (");
    }
    
    //Last token should always be CLOSEPAREN
    if(tokens[tokens.length - 1] != TERMINALS.SYMBOLS.CLOSEPAREN)
    {
    INTERPRETER.error("METHODDEFINE", "METHODDEFINE header must end with )");
    }
    
    //Parsing DEFPARAMLIST
    //If the fifth token is not a CLOSEPAREN, we have parameters, so we construct a DEFPARAMLIST
    if(tokens[4] != TERMINALS.SYMBOLS.CLOSEPAREN)
    {
      var paramTokens = tokens.slice(0);
      paramTokens.splice(0, 4);
      paramTokens.splice(paramTokens.length - 1);
      this.params = createDefParamListInternal(body, paramTokens);
    }
    
    //Parsing BODY
    INTERPRETER.goToNextLine();
    this.codeBody = new Body(this.body);
    
    //Link the codebody to this method
    this.codeBody.method = this;
    
    //If we have parameters, create VARDECLs for them and add them to the variable table of the code body.
    if(this.params !== null)
    {
      for(var z = 0, paramLength = this.params.length; z < paramLength; z++)
      {
        for(var y = 0, varTableLength = this.codeBody.varTable.length; y < varTableLength; y++)
        {
          //IF THE NAME OF THIS PARAM EQUALS THE NAME OF THIS VARDECL
          if(this.params[z].id == this.codeBody.varTable[y].id)
          {
            INTERPRETER.error("VARDECL", "Cannot declare VARDECL with same name as method parameter!", this.codeBody.varTable[y].lineNum, this.codeBody.varTable[y].code);
          }
        }

        var v = new Vardecl(this.body, this.id, this.type);
        this.codeBody.varTable.push(v);
      }
    }
  
    //Add this method to the global method table.
    INTERPRETER.methodTable.push(this);
  }
}

Methoddefine.prototype.getId = function() {
  return this.id;
};

Methoddefine.prototype.getType = function() { 
  return this.type;
};

Methoddefine.prototype.getMethodType = function() {
  return this.methodType;
};

Methoddefine.prototype.getCodeBody = function() {
  return this.codeBody;
};

Methoddefine.prototype.getNumParams = function() {
  if(this.params !== null)
  {
    return this.params.length;
  }
  else
  {
    return 0;
  }
};

/**
 * Simple print function. Prints the method's type, id, params, and body.
 */
Methoddefine.prototype.print = function() {
  INTERPRETER.write("parse", "methoddefine " + this.type + " " + this.id + "(");
  if(this.params !== null)
  {
    this.params.print();
  }
  INTERPRETER.writeln("parse", ")");
  this.codeBody.print();
};

//Ensure that method doesn't exist twice
//Validate body
//Validate params
/**
 * Ensures that the method has not already been defined.
 * If we have parameters, we validate them. We also use this opportunity to set the number of params we have.
 * If the method is internal, we validate its body. If it is external, we assume the execution function is correct syntactically and semantically
 * 
 */
/*public void validate() 
{
  interpreter.writeln("validate", "Validating METHODDEFINE");

  //Ensure the method has not already been defined
  if(Collections.frequency(interpreter.getMethodTable(), interpreter.findMethod(id)) > 1)
  {
    interpreter.error("METHODDEFINE", lineNum, code, "Method " + id + " cannot be defined more than once!");
  }   
  //If we have params, validate them.
  if(params != null)
  {
    params.validate();
    DEFPARAMLIST p = params;
    
    //Set numParams
    while(p != null)
    {
      numParams++;
      p = p.nextParam();
    }
  }
  
  //If the method is internal, validate the body.
  if(methodType.equals(INTERNAL))
  {
    codeBody.validate();
    
    //If this method has a non-void return type, but the body has no return statement, we have a problem.
    if(!type.equals(Terminals.VOID) && !hasReturn())
    {
      interpreter.error("METHODDEFINE", lineNum, code, "Method " + id + " does not have a return statement");
    }
  }
}*/

/**
 * Goes through the body statements and ensures that a return type is present.
 * Note that a body can have multiple return types; we only need one.
 * 
 * NOTE: this currently only checks return statements in the MAIN BODY. If there are items that have subbodies (like loops) we do not look there!
 * This can lead to situations where a return statement will always be hit, yet this function does not see it.
 * 
 * Because this code is procedurally generated, we will handle this by always requiring some sort of return statement at the end of the method code in the main body.
 * 
 * @return  true if we find a return statement, false otherwise
 */
/*private boolean hasReturn() 
{
  STMTLIST s = codeBody.getStmtList();
  while(s != null)
  {
    if(s.getStmt().type().equals(Terminals.RETURN))
      return true;
    else s = s.getNextStmt();
  }
  return false;
  
}*/

/**
 * This is only called from a METHOD variable's execute function.
 * 
 * If this is an internal method, we execute its code body.
 * If this is an external method, we call its execute function.
 * 
 * In both cases, we pass in the args parameter, which will contain the parameter values.
 * (These values are retrieved in the METHOD's execute function)
 * 
 * @param args  the parameters for the function
 * @return  the function's return value, or null if it doesn't have one
 * 
 */
/*public Object execute(Object args[]) 
{
  if(methodType.equals(INTERNAL))
  {
    return codeBody.execute(args);
  }
  else if(methodType.equals(EXTERNAL))
  {
    //Find the method in the table and run its execute function.
    for(Object ext : interpreter.getExtMethodTable())
    {
      if(((ExtMethod)ext).id().equals(id))
      {
        return ((ExtMethod)ext).execute(args);
      }
    }
  }
  
  //We should never get here
  return null;
}*/

