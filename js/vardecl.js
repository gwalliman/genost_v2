function Vardecl(body, id, type)
{
  this.body = body;

  this.id = id !== undefined ? id : null;
  this.type = type !== undefined ? type : null;
  
  if(this.id === null && this.type === null)
  {
    var tokens = INTERPRETER.getCurrentLineTokens();
    this.type = tokens[1];

    this.lineNum = INTERPRETER.getCurrentLineNum();
    this.code = INTERPRETER.getCurrentLine();

    //Ensure that the type is int, string or bool.
    if(TERMINALS.dataTypes.indexOf(this.type) <= -1) 
    {
      INTERPRETER.error("VARDECL", "Invalid VARDECL data type. Must be int, string, or bool");
    }
    else if(this.type == TERMINALS.VOID)
    {
      INTERPRETER.error("VARDECL", "Invalid VARDECL data type. Must be int, string, or bool"); 
    }
    else if(validateId(tokens[2]))
    {
      this.id = tokens[2];
    }

    //Add to the varTable of the parent body
    this.body.varTable.push(this);
  }
}

Vardecl.prototype.getId = function() {
  return this.id;
};

Vardecl.prototype.getType = function() {
  return this.type;
};

Vardecl.prototype.printVar = function() {
  if(this.id !== null && this.type !== null)
  {
    INTERPRETER.write("debug", this.type + " " + this.id);
  }
  else
  {
    INTERPRETER.write("debug", "Empty VARDECL");   
  }
};

Vardecl.prototype.print = function () {
  if(this.id !== null && this.type !== null)
  {
    INTERPRETER.write("parse", "vardecl " + this.type + " " + this.id);
  }
  else
  {
    INTERPRETER.write("parse", "Empty VARDECL");
  }
};

/*Vardecl.prototype.validate = function() {
  this.interpreter.writeln("validate", "Validating VARDECL");

  if(Collections.frequency(body.varTable, interpreter.findVar(body, id)) > 1)
  {
    interpreter.error("VARDECL", lineNum, code, "Var " + id + " cannot be declared more than once in the same scope!");
  }     
}*/
