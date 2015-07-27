function createCall(body, callTokens) {
  var callType = callTokens[0];

  //Switch statement to determine what type the call is and parse it accordingly.
  //If the call type is not found in the two included arrays, something has gone wrong.
  if(TERMINALS.callTypes.indexOf(callType) > -1 || (TERMINALS.dataTypes.indexOf(callType) > -1 && callType != TERMINALS.VOID))
  {
    if(callType == TERMINALS.VAR)
    {
      return new Var(body, callTokens);
    }
    else if(callType == TERMINALS.STMTTYPES.METHOD)
    {
      var method = new Method(body, callTokens);
      return method;
    }
    else if(callType == TERMINALS.INT)
    {
      return new IntegerLiteral(body, callTokens);
    }
    else if(callType == TERMINALS.STRING)
    {
      return new StringLiteral(body, callTokens);
    }
    else if(callType == TERMINALS.BOOL) 
    {
      return new BooleanLiteral(body, callTokens);
    }
  }
  else 
  {
    INTERPRETER.error("CALL", "Invalid type for variable / method / data literal call");
  }
}

function createParamCalls(body, paramCallsTokens)
{
  var paramCalls = [];
  while(paramCallsTokens.length !== 0)
  {
    var callTokens = [];
    
    //Case 1
    if(paramCallsTokens[0] ==TERMINALS.STMTTYPES.METHOD)
    {
      //We need to find the limits of the method call.
      //We do this by finding the close paren to this method's CALLPARAMLIST; the character immediately after this will be the comma, and hence the end of the CALL.
      if(paramCallsTokens[2] != TERMINALS.SYMBOLS.OPENPAREN)
      {
        INTERPRETER.error("CALLPARAMLIST", "METHOD argument must have open paren following ID!");
      }
      
      //The closeparen index is at least 2 (0 is "method", 1 is id, 2 is open paren)
      var closeParen = 2;
      var counter = 1;
      
      //Go through each token and find the corresponding closeparen.
      //We either exit when we have found it, or when closeParen has gone out of bounds.
      while(counter !== 0 && closeParen < paramCallsTokens.length)
      {
        closeParen++;
        if(paramCallsTokens[closeParen] == TERMINALS.SYMBOLS.OPENPAREN)
        {
          counter++;
        }
        else if(paramCallsTokens[closeParen] == TERMINALS.SYMBOLS.CLOSEPAREN)
        {
          counter--;
        }
      }
      
      //If closeParen has not gone out of bounds, we have found our closing paren.
      if(paramCallsTokens.length >= closeParen)
      {
        //The callTokens is everything from the beginning to the closeparen
        //We add 1 since closeParen needs to be a count while currently it's an index
        callTokens = paramCallsTokens.splice(0, closeParen + 1);

        //The remainder is everything after the comma following the closeparen to the end of the string.
        paramCallsTokens.splice(0, 1);
      }
      else
      {
        INTERPRETER.error("CALLPARAMLIST", "METHOD argument does not have corresponding closeparen!");
      }
    }
    //Case 2
    else
    {
      //The callTokens is simply the first two tokens
      callTokens = paramCallsTokens.splice(0, 2);

      //The remainder is everything else (minus the comma)
      paramCallsTokens.splice(0, 1);
    }
    
    //Ensure that we actually have a callTokens; if so, parse the CALL
    if(callTokens.length > 0)
    {
      paramCalls.push(createCall(body, callTokens));
    }
    else
    {
      INTERPRETER.error("CALLPARAMLIST", "Syntax error in CALLPARAMLIST");
    }
  }
  return paramCalls;
}
