function createStmt(body) {
  var lineTokens = INTERPRETER.getCurrentLineTokens();
  var stmtType = lineTokens[0]; 
  var stmt = null;
  var hasSemicolon = true;

  //All valid statements will have, as their first token, the statement type, separated from the rest of the code by a space.
  if(stmtType)
  {
    if (stmtType == TERMINALS.STMTTYPES.VARDECL)
    {
      stmt = new Vardecl(body);
    }
    else if (stmtType == TERMINALS.STMTTYPES.ASSIGN)
    {
      stmt = new Assignment(body);
    } 
    else if (stmtType == TERMINALS.STMTTYPES.METHODDEFINE) 
    {
      stmt = new Methoddefine(body);
      hasSemicolon = false;
    }
    //A METHOD is the only STMT which can be both a standalone STMT and a CALL.
    //Therefore the METHOD code expects there to be no ending semicolon, and so we process that semicolon here.
    else if (stmtType == TERMINALS.STMTTYPES.METHOD)
    {
      var methodTokens = lineTokens.slice(0);
      methodTokens.splice(methodTokens.length - 1);
      stmt = new Method(body, methodTokens);
    }
    else if (stmtType == TERMINALS.STMTTYPES.RETURN)
    {
      stmt = new Return(body);
    }
    else if (stmtType == TERMINALS.STMTTYPES.IF)
    {
      //TODO
      //stmt = new If(body);
      hasSemicolon = false;
    }
    //ELSEIFs and ELSEs should be handled in the IF code.
    //If we find a separate statement beginning with ELSEIF or ELSE, we must halt.
    else if (stmtType == TERMINALS.STMTTYPES.ELSEIF)
    {
      INTERPRETER.error("STMT", "ELSEIF must follow IF");
      hasSemicolon = false;
    }
    else if (stmtType == TERMINALS.STMTTYPES.ELSE)
    {
      INTERPRETER.error("STMT", "ELSE must follow IF or ELSEIF");
      hasSemicolon = false;
    }
    else if (stmtType == TERMINALS.STMTTYPES.LOOPUNTIL)
    {
      //TODO
      //stmt = new LoopUntil(body);
      hasSemicolon = false;
    }
    else if (stmtType == TERMINALS.STMTTYPES.LOOPFOR)
    {
      //TODO
      //stmt = new LoopFor(body);
      hasSemicolon = false;
    }
    else if (stmtType == TERMINALS.STMTTYPES.WAITUNTIL)
    {
      //TODO
      //stmt = new WaitUntil(body);
      hasSemicolon = false;
    }
    else if (stmtType == TERMINALS.STMTTYPES.WAITFOR)
    {
      //TODO
      //stmt = new WaitFor(body);
    }
  }
  else
  {
    INTERPRETER.error("STMT", "STMT type is not valid.");
    hasSemicolon = false;
  }

  var lastchar = lineTokens[lineTokens.length - 1];

  //Ensure that should, have a semicolon
  if(hasSemicolon && lastchar != TERMINALS.SYMBOLS.SEMICOLON)
  {
    INTERPRETER.error("STMT", "Missing Semicolon");
  }

  return stmt;
}
