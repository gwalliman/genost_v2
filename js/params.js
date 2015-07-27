function createDefParamListInternal(body, paramTokens)
{
  var paramList = [];

  while(paramTokens.length !== 0)
  {
    //We should always have at least two tokens (a type and an id)
    if(paramTokens.length > 1)
    {
      var param = {};

      //Parsing TYPE
      //Get the datatype, ensure that it is valid and not void.
      var paramType = paramTokens[0];

      if(TERMINALS.dataTypes.indexOf(paramType) <= -1 || paramType == TERMINALS.VOID)
      {
        INTERPRETER.error("DEFPARAMLIST", "Invalid DEFPARAMLIST data type. Must be int, string, or bool");
      }
      
      //Parsing ID
      //Get the id
      var id = validateId(paramTokens[1]) ? paramTokens[1] : null;

      //If we have at least four tokens, then we know we have another parameter
      if(paramTokens.length > 3)
      {
        //The third token must be a comma.
        if(paramTokens[2] == TERMINALS.SYMBOLS.COMMA)
        {
          paramTokens.splice(0, 3);
        }
        else 
        {
          INTERPRETER.error("DEFPARAMLIST", "There must be a comma between each parameter in a DEFPARAMLIST");
        }
      }
      else if(paramTokens.length == 2)
      {
        paramTokens.splice(0, 2);
      }
      else
      {
        INTERPRETER.error("DEFPARAMLIST", "Syntax error in DEFPARAMLIST");
      }

      param.type = paramType;
      param.id = id;
      paramList.push(param);
    }
    else 
    {
      INTERPRETER.error("DEFPARAMLIST",  "Syntax error in DEFPARAMLIST");
    }
  }

  return paramList;
}

function createDefParamListExternal(body, paramTypes)
{
  var paramList = [];
  for(var x = 0, length = paramTypes.length; x < length; x++)
  {
    var param = {
      id: "param" + x,
      type: paramTypes[x]
    };

    paramList.push(param);
  }

  return paramList;
}
