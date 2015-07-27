function Assignment(body)
{
  this.body = body;
  
  this.id = null;
  this.call = null;
  this.lhs = null;

  var tokens = INTERPRETER.getCurrentLineTokens();
    
  this.id = validateId(tokens[1]) ? tokens[1] : null;

  //Equals should always be the second token.
  if(tokens[2] != TERMINALS.SYMBOLS.EQUALS)
  {
    INTERPRETER.error("ASSIGNMENT", "Assignment statement requires an =");
  }

  var rhsTokens = tokens.slice(3);
  rhsTokens.splice(rhsTokens.length - 1);

  //Parsing CALL
  this.call = createCall(body, rhsTokens);
}

Assignment.prototype.print = function() {
  INTERPRETER.write("parse", "assign " + this.id + " = ");
  this.call.print();
};

/**
 * IN THIS ORDER
 * 1. Validate call
 * 2. Ensure that lhs exists
 * 3. Ensure that lhs and rhs are of same type
 */
/*Assignment.prototype.validate() {
  this.interpreter.writeln("validate", "Validating ASSIGNMENT");
  
  //1. Validating CALL
  this.call.validate();
  
  //2. Ensure that lhs exists.
  this.lhs = this.interpreter.findVar(this.body, this.id);
  if(this.lhs == null)
  {
    this.interpreter.error("ASSIGNMENT", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "Variable " + this.id + " is not defined.");
  }
  
  //3. Ensure that lhs and rhs are of same type
  var lhsType = this.lhs.type();
  var rhsType = this.call.type();
  
  if(!lhsType.equals(rhsType))
  {
    this.interpreter.error("ASSIGNMENT", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "LHS and RHS of an assignment must be of same type, but LHS is " + lhsType + " and RHS is " + rhsType);
  }
}

Assignment.prototype.execute(Object args[]) {
{
  Object val = call.execute(null);
  
  //Note that we don't have to worry about types,
  //This was taken care of in Validation
  interpreter.setVar(lhs.id(), val);
  
  return null;
}*/

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

/**
 * Represents a literal boolean object.
 * Can be either true or false.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function BooleanLiteral(body, callTokens)
{
  this.body = body;
  
  this.value = null;
  
  if(callTokens.length == 2)
  {
    if(TERMINALS.booleanVals.indexOf(callTokens[1] > -1))
    {
      this.value = (callTokens[1] === "true");
    }
    else
    {
      INTERPRETER.error("BOOLEAN", "Boolean value must be either true or false");
    }
  }
  else
  {
    INTERPRETER.error("BOOLEAN", "Syntax error in boolean.");
  }
}

/**
 * Simple print function - prints the value.
 */
BooleanLiteral.prototype.print = function() {
  INTERPRETER.write("parse", "bool " + this.value);
};

/**
 * We have nothing to validate here, but we must implement the function.
 */
BooleanLiteral.prototype.validate = function() { 
  INTERPRETER.writeln("validate", "Validating BOOLEAN");
};

/**
 * Return the value.
 * 
 * @param args  always null
 * @return  the boolean value
 */
/*public Object execute(Object args[]) 
{
  return value;
}*/

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

function Code(c)
{
  if(c.length === 0)
  {
    c = "";
  }

  this.codeString = c;
  this.codeLines = this.codeString.split("\n");
  this.codeLength = this.codeLines.length;
  this.tokenizedCode = [];

  this.preprocessCode();
}

Code.prototype.preprocessCode = function() {
  for(var x = this.codeLength - 1; x >= 0; x--)
  {
    if(this.codeLines[x].trim() === '')
    {
      //http://stackoverflow.com/questions/206988/how-do-i-unset-an-element-in-an-array-in-javascript
      this.codeLines.splice(x, 1);
      this.codeLength--;
    }
  }
};

Code.prototype.getCodeLength = function() {
  return this.codeLength;
};

Code.prototype.getLine = function(lineNum) {
  if(lineNum >= 0 && lineNum < this.codeLength)
  {
    return this.codeLines[lineNum];
  }
};

Code.prototype.getTokenizedLine = function(lineNum) {
  if(lineNum >= 0 && lineNum < this.codeLength)
  {
    return this.tokenizedCode[lineNum];
  }
};

Code.prototype.checkAlphaNumeric = function(str) {
  var code, i, len;

  for(i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

Code.prototype.exciseString = function(stringToExcise)
{
  //Get rid of the first quote (assumed to be there)
  stringToExcise = stringToExcise.substring(1, stringToExcise.length);
  
  //Split the provided line of code by the first found quote.
  var splitString = stringToExcise.split(TERMINALS.SYMBOLS.QUOTE);

  //If there is no found quote, then the string is not enclosed.
  if(splitString.length == 1)
  {
    INTERPRETER.error("STRING", "Unenclosed string!");
  }
  var firstElement = splitString.shift();
  var remainder = splitString.join();
    
  //We return the right half of the split (the remainder)
  return [ TERMINALS.SYMBOLS.QUOTE + firstElement + TERMINALS.SYMBOLS.QUOTE, remainder ];
};

/**
 * Takes each element of the provided String array s and attaches them together in order
 * as one large string, separated by the provided separator, sep
 * 
 * This variant allows us to choose the indices which will start and end the string.
 * All indices before start will be ignored, as will all indices after end.
 * 
 * @param s an array of strings to be attached together
 * @param sep a string which will be placed between each of the strings in s
 * @param start the index at which we will begin imploding.
 * @param end the last index which will be imploded
 * @return the resultant string after implosion
 */
Code.prototype.implode = function(stringBits, seperator, start, end)
{
  var stringBuilder = Array();
  for(var x = start; x <= end; x++)
  {
    stringBuilder.push(stringBits[x]);
  }

  return stringBuilder.join(seperator);
};

/**
 * Takes a string and splits it up into tokens as follows.
 *    1. Each symbol (see the Terminals class for the list of symbols) will be considered one token
 *    2. Every set of alphanumeric characters, separated from other tokens by spaces, will be one token
 *      The separating spaces will not be enclosed in the token
 *    3. A String (set of alphanumeric characters or symbols enclosed by two quote symbols) will be one token.
 *      Note that the String token will include the enclosing quotes
 *    4. A negative integer will be one token.
 * Example: assign x = method y(string "Tokenize Test");
 * This will be split up into the following tokens:
 * |assign|x|=|method|y|(|string|"Tokenize Test|)|;|
 * 
 * @param s the string being tokenized
 * @return an array of Strings, containing the tokens, in the order they appear in the provided string
 */
Code.prototype.tokenizeLine = function(lineNum, codeLine) {
  var tokens = [];
  INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' Codeline: ' + codeLine);
  //We first split up the string by spaces.
  var pass = codeLine.trim().split(" ");
  INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' Pass: ' + pass);

  //Go over each individual item separated by spaces in the original string.
  //This will get all tokens of type 2 without further processing,
  //but if we find a symbol, it might be type 1, 3 or 4, so more processing is required.
  for(var x = 0, length = pass.length; x < length; x++)
  {
    //Trim the string and ensure it's not empty space. If it is, move on to the next one.
    var token = pass[x].trim();
    INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' Token ' + x + ': ' + token);
    if(token.length > 0)
    {
      //If the string is entirely alphanumeric, add it to the array and move on to the next one.
      if(this.checkAlphaNumeric(token))
      {
        INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' is alphanumeric, pushing');
        tokens.push(token);
      }
      //If the string has a symbol, it could be of type 1, 3 or 4
      else
      {
        INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' is not alphanumeric');

        //If this token has a quote as its first character, we will consider it, 
        //and all tokens following it (until we find another quote), part of a type 3 String token
        if(token.indexOf(TERMINALS.SYMBOLS.QUOTE > -1) && token.substring(0, 1) == TERMINALS.SYMBOLS.QUOTE)
        {
          INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' contains a Type 3 (string)');
          //Put the remaining tokens back together.
          var r = this.implode(pass, " ", x, pass.length - 1);
          var exciseResult = this.exciseString(r);
          tokens.push(exciseResult[0]);
          r = exciseResult[1];

          //We now have the String as a token in the tokens array,
          //and r is the code line that remains. We must tokenize r
          //and add it to the tokens array.
          if(r)
          {
            var remainingTokens = this.tokenizeLine(lineNum, r);
            for(var y = 0, ylength = remainingTokens.length; y < ylength; y++)
            {
              tokens.push(remainingTokens[y]);
            }
          }
          
          return tokens;
        }
        //If this token has a dash as its first character, it might be a negative number.
        //We treat the dash and all numbers following as part of one token, and continue on after the first non-numeric character.
        else if(token.indexOf(TERMINALS.SYMBOLS.DASH) > -1 && token.substring(0, 1) == TERMINALS.SYMBOLS.DASH)
        {
          INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' contains a Type 4 (negative number)');
          var start = 1;
          var end = 2;
          var negInt = TERMINALS.SYMBOLS.DASH;
          //Loop until we encounter a character that is not a number.
          while(end <= token.length && !isNaN(token.substring(start, end)))
          {
            negInt += token.substring(start, end);
            start++;
            end++;
          }
          //Add the negative integer
          tokens.push(negInt);
          
          //Get the rest of the string (if there is one)
          var remainder = token.substring(start, token.length);
          
          //Put the remaining tokens back together.
          var rNeg = remainder + this.implode(pass, " ", x + 1, pass.length - 1);

          //We now have the negative integer as a token in the tokens array,
          //and r is the code line that remains. We must tokenize r
          //and add it to the tokens array.
          if(rNeg)
          {
            var remainingTokensNeg = this.tokenizeLine(lineNum, rNeg);
            for(var z = 0, zlength = remainingTokensNeg.length; z < zlength; z++)
            {
              tokens.push(remainingTokensNeg[z]);
            }
          }
          INTERPRETER.writeln('tokenize', tokens);  
          return tokens;
        }
        //If we don't meet the criteria above, then we assume type 1
        //We know at this point that we have at least one symbol somewhere in the string.
        else
        {
          INTERPRETER.writeln('tokenize', 'Line ' + lineNum + '  ' + token + ' contains a Type 1 (symbol)');

          //Go through each symbol to find which one we have
          var symbol = TERMINALS.searchForTerminal(token, "SYMBOLS");
          if(symbol)
          {
            //Split the string around that one symbol (resulting in two halves)
            var splitToken = token.split(symbol);
            var left = splitToken.shift();
            INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' Left: ' + left);
            var right = splitToken.join(symbol);
            INTERPRETER.writeln('tokenize', 'Line ' + lineNum + ' Right: ' + right);

            if(left)
            {
              //Tokenize the left half ands add it to the tokens array
              tokens.push.apply(tokens, this.tokenizeLine(lineNum, left));
            }

            //Add the symbol to the array
            tokens.push(symbol);

            if(right)
            {
              //Tokenize the right half and add it to the array
              tokens.push.apply(tokens, this.tokenizeLine(lineNum, right));
            }
          }
        }
      }
    }
  }
  
  return tokens;
};

Code.prototype.tokenizeCode = function() {
  for(var x = 0, length = this.codeLines.length; x < length; x++)
  {
    var tokenizedLine = this.tokenizeLine(x, this.codeLines[x]);
    this.tokenizedCode.push(tokenizedLine);
  }
};

Code.prototype.printTokens = function(tokenArray) {
  var outputString = tokenArray.join('|');
  return outputString;
};

Code.prototype.printAllTokens = function() {
  var codeObject = this;
  var outputString = '';
  this.tokenizedCode.forEach(function(tokenArray) {
    outputString += codeObject.printTokens(tokenArray) + "\n==========\n";
  });
  return outputString;
};

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
}

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

/**
 * Represents a literal integer, which can be positive or negative.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function IntegerLiteral(body, callTokens)
{
  this.body = body;
  this.value = null; 
  
  /**
   * Takes the provided value and ensures that it is an integer.
   * If so, adopts it as a value.
   */

  //We should only have one token here, the literal itself
  if(callTokens.length == 2)
  {
    //Every valid integer should be of this format
    if(!isNaN(callTokens[1])) //TODO: This seems dangerous
    {
      this.value = parseInt(callTokens[1]);
    }
    else 
    {
      INTERPRETER.error("INTEGER", "Provided integer is of invalid format");
    }
  }
  else
  {
    INTERPRETER.error("INTEGER", "Syntax error in integer.");
  }
}

/**
 * Simple print function - prints the value.
 */
IntegerLiteral.prototype.print = function() {
  INTERPRETER.write("parse", "int " + this.value);
};

/**
 * We have nothing to validate here, but we must implement the function.
 */
IntegerLiteral.prototype.validate = function() {
  INTERPRETER.writeln("validate", "Validating INTEGER");
};

/**
 * Return the value.
 */
/*public Object execute(Object args[]) 
{
  return value;
}*/

var INTERPRETER = {

  varStack: {},
  methodTable: [],
  extMethodTable: [],
  currentLineNum: 0,

  messageMask: {},

  code: {},
  body: {},

  getCurrentLineNum: function() {
    return this.currentLineNum;
  },

  setCurrentLineNum: function(lineNum) {
    if(lineNum >= 0 && lineNum < this.code.getCodeLength() - 1)
    {
      this.currentLineNum = lineNum;
    }
    return this.code.getLine(this.currentLineNum);
  },

  getCurrentLine: function() {
    return this.code.getLine(this.currentLineNum);
  },

  getCurrentLineTokens: function() {
    return this.code.getTokenizedLine(this.currentLineNum);
  },

  goToPrevLine: function() {
    if(this.currentLineNum > 0)
    {
      this.currentLineNum--;
    }
    return this.code.getLine(this.currentLineNum);
  },

  goToNextLine: function() {
    if(this.currentLineNum < this.code.getCodeLength() - 1)
    {
      this.currentLineNum++;
    }
    return this.code.getLine(this.currentLineNum);
  },

  //Step 0: Load In External Methods
  initialize: function() {
    this.clearCode();
    for(var x = 0, length = this.extMethodTable.length; x < length; x++)
    {
      this.methodTable.push(new Methoddefine(this.body, this.extMethodTable[x]));
    }
  },

  //Step 1: Load In Code and Tokenize
  loadCode: function(codeString) {
    this.clearCode();
    this.code = new Code(codeString);
    this.code.tokenizeCode();
    this.setCurrentLineNum(0);
  },

  //Step 2: Parse Code
  parseCode: function() {
    this.body = new Body(null);
  },
  
  //Step 3: Link and Validate Code
  
  printAllTokens: function() {
    return this.code.printAllTokens();
  },

  setMessageMask: function(t, val) {
      this.messageMask[t] = val;
  },

  /**
   * This function is used to control which printed messages should be printed to the screen.
   * Modify the values in here to turn on or off different message printings.
   * 
   * Garret's todo: hook this method into the UI so these can be turned on / off dynamically.
   * 
   * @param t the type of message we are querying about
   * @return  true if we can print this type of message, false otherwise
   */
  canShowMessage: function(t) {
    if(this.messageMask.hasOwnProperty(t) && this.messageMask[t] === true)
    {
      return true;
    }
    else
    {
      return false;
    }
  },

  /**
   * This method should be called anytime the parser / validator / execution encounters an error in the code.
   * The method will print an error message to the screen and stop the program.
   * 
   * Garret's TODO: Allow us to scan for multiple errors instead of halting at the very first error.
   * 
   * @param var the Variable structure (i.e. BODY, IF, ASSIGN) where the error occurred
   * @param lineNum the line number where the error occurred
   * @param c the code fragment which contains the error
   * @param error a String describing the error
   */
  error: function(variable, error, lineNum, code) {
    if(lineNum === undefined && code === undefined)
    {
      lineNum = this.getCurrentLineNum();
      code = this.getCurrentLine();
    }

    var fu = variable.toUpperCase() + " ERROR Near Line " + lineNum + ": " + code + "\n" + error;
    if(this.canShowMessage('error'))
    {
      console.log(fu);
    }
    throw {
      text: fu,
      lineNum: lineNum,
      code: code.trim(),
      error: error.replace(/(\r\n|\n|\r)/gm,"").replace(/\t/g,"")
    };

    /*for(RobotListener l : robotInterpreter.getRobotListeners())
    {
      l.error(var, fu);
    }*/
  },

  /**
   * This function should be used within the program to write a message to the screen WITHOUT a linebreak.
   * We wrap standard print calls in our own message to both control whether messages are printed or not,
   * as well as to make it easy to control where those messages are printed to (i.e. Java console log vs. a JTextField)
   * 
   * @param type  the type of message we are printing
   * @param s the message itself
   */ 
  write: function(type, s)
  {
    if(this.canShowMessage(type))
    {
      /*for(RobotListener l : robotInterpreter.getRobotListeners())
      {
        l.print(s);
      }*/
      console.log(s);
      return s;
    }
  },
  
  /**
   * This function should be used within the program to write a message to the screen WITH a linebreak.
   * We wrap standard print calls in our own message to both control whether messages are printed or not,
   * as well as to make it easy to control where those messages are printed to (i.e. Java console log vs. a JTextField)
   * 
   * @param type  the type of message we are printing
   * @param s the message itself
   */
  writeln: function(type, s)
  {
    if(this.canShowMessage(type))
    {
      /*for(RobotListener l : robotInterpreter.getRobotListeners())
      {
        l.println(s);
      }*/
      console.log(s + "\n");
      return s + "\n";
    }
  },

  clearCode: function() {
    this.varStack = {};
    this.methodTable = [];
    this.currentLineNum = 0;

    this.messageMask = {};

    this.code = {};
    this.body = {};
  },
};


module.exports = {
  interpreter: INTERPRETER,
};

/**
 * The METHOD class is used to call and execute a method.
 * When we parse the METHOD, we get its id and its parameters in the form of a CALLPARAMLIST.
 * When we validate the METHOD, we link the call up to the method definition.
 * When we execute the METHOD, we get the values of the parameters, and send them to the METHODDEFINE for execution.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function Method(body, methodTokens)
{
  this.body = body;
  
  this.id = null;
  this.paramCalls = [];
  this.methodDefine = null;
  
  this.id = validateId(methodTokens[1]) ? methodTokens[1] : null;
  
  //The third token should always be an OPENPAREN
  if(methodTokens[2] != TERMINALS.SYMBOLS.OPENPAREN)
  {
    INTERPRETER.error("METHOD", "ID must be followed by (");
  }
  
  //The last token should always be a CLOSEPAREN
  if(methodTokens[methodTokens.length - 1] != TERMINALS.SYMBOLS.CLOSEPAREN)
  {
    INTERPRETER.error("METHOD", "METHOD header must end with )");
  }
  
  //If the CLOSEPAREN is not the fourth token, then we must have parameters.
  if(methodTokens[3] != TERMINALS.SYMBOLS.CLOSEPAREN)
  {
    var paramCallsTokens = methodTokens.slice(0);
    paramCallsTokens.splice(0, 3);
    paramCallsTokens.splice(paramCallsTokens.length - 1);

    //We send the right half of the split above minus the last character, which is the CLOSEPAREN
    this.paramCalls = createParamCalls(body, paramCallsTokens);
  }
}

/**
 * @return  the METHOD id
 */
Method.prototype.getId = function() {
  return id;
};

/**
 * @return  the METHODDEFINE that this METHOD is calling
 */
Method.prototype.getMethDef = function() {
  return method;
};

/**
 * Simple print function
 */
Method.prototype.print = function() {
  INTERPRETER.write("parse", "method " + this.id + "(");
  if(this.paramCalls !== null)
  {
    for(var x = 0, length = paramCalls.length; x < length; x++)
    {
      paramCalls[x].print();
    }
  }
  INTERPRETER.write("parse", ")");
};

/**
 * First, ensure that the METHOD we are calling actually exists.
 * Second, validate the CALLPARAMLIST, if we have one.
 */
/*public void validate() 
{
  interpreter.writeln("validate", "Validating METHOD");

  //Look the method up in the method table. If it does not exist, we have a problem.
  method = interpreter.findMethod(id);
  if(method == null)
  {
    interpreter.error("METHOD", lineNum, code, "Method " + id + " is not defined.");
  }
  
  //Validate the CALLPARAMLIST if we have one.
  if(params != null)
  {
    params.validate();
  }
}*/

/**
 * If we have parameters, we must execute the CALLPARAMLIST to get the arguments for the function.
 * Either way, we call the execute function of the METHODDEFINE this METHOD is referencing.
 */
/*public Object execute(Object[] args) 
{
  if(params != null)
  {
    return method.execute((Object[]) params.execute(null));
  }
  else 
  {
    return method.execute(null);
    }
  }
}*/


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

/**
 * A return statement will stop execution of a body and return a certain value, defined by a CALL.
 * Note that the RETURN class itself just returns the value. It is up to the BODY/STMTLIST/STMT execution to actually stop execution once a RETURN is executed and returns.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function Return(body)
{
  this.body = body;

  this.type = null;
  this.call = null;

  var callTokens = INTERPRETER.getCurrentLineTokens().slice(0);

  //Get rid of the "return" and the semicolon
  callTokens.splice(0, 1);
  callTokens.splice(callTokens.length - 1);
  
  //Parsing CALL
  this.call = createCall(body, callTokens);
}

/**
 * Simple print function.
 */
Return.prototype.print = function() {
  INTERPRETER.write("parse", "return ");
  this.call.print();
};

/**
 * Ensure that the CALL type is the same as the parent method's type.
 * We also ensure here that the RETURN statement is actually within a method body.
 */
/*public void validate() 
{
  interpreter.write("validate", "Validating RETURN");
  
  //Get the type
  //We must wait until validation to determine type, since, if the call is a variable, the vartables may not have been fully populated in parsing.
  type = call.type();
  
  //Validate the CALL
  call.validate();
  
  //Ensure that the RETURN stmt appears in a method body.
  if(body.method == null) interpreter.error("RETURN", lineNum, code, "RETURN statement may only appear in a method!");
  
  //Ensure that the RETURN type is proper.
  if(!body.method.type().equals(type)) interpreter.error("RETURN", lineNum, code, "Method " + body.method.id() + " returns type " + body.method.type() + ", but RETURN statement is of type " + type);
}*/

/**
 * Execute the CALL and return the value.
 * 
 * @param args  should always be null
 * @return  returns the CALL's return value.
 */
/*public Object execute(Object[] args) 
{
  return call.execute(null);
}*/

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

/**
 * Represents a string literal.
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function StringLiteral(body, callTokens)
{
  this.body = body;

  this.value = null;

  //Ensure that the value is wrapped in quotes. If it is, strip the quotes and adopt the result as the value.
  if(callTokens[1].substring(0, 1) == TERMINALS.SYMBOLS.QUOTE && callTokens[1].substring(callTokens[1].length - 1, callTokens[1].length == TERMINALS.SYMBOLS.QUOTE))
  {
    this.value = callTokens[1].substring(1, callTokens[1].length - 1);
  }
  else
  {
    INTERPRETER.error("STRING", "String must be wrapped in quotes");
  }
}

/**
 * Simple print function - prints the value.
 */
StringLiteral.prototype.print = function() {
  INTERPRETER.write("parse", "string \"" + this.value + "\"");
};

/**
 * We have nothing to validate here, but we must implement the function.
 */
StringLiteral.prototype.validate = function() {
  INTERPRETER.writeln("validate", "Validating STRING");
};

/**
 * Return the value.
 */
/*public Object execute(Object args[]) 
{
  return value;
}*/

var TERMINALS = {

  SYMBOLS: {
    //Symbols
    OPENPAREN:    "(",
    CLOSEPAREN:   ")",
    OPENBRACE:    "{",
    CLOSEBRACE:   "}",
    OPENBRACKET:  "[",
    CLOSEBRACKET: "]",
    QUOTE:        '"',
    SEMICOLON:    ";",
    EQUALS:       "=",
    COMMA:        ",",
    EQ:           "==",
    NEQ:          "!=",
    LT:           "<",
    GT:           ">",
    LTE:          "<=",
    GTE:          ">=",
    DASH:         "-",
  },
    
  //String Literals
  VOID:       "void",
  INT:      "int",
  STRING:     "string",
  BOOL:       "bool",
  TRUE:       "true",
  FALSE:      "false",
  AND:      "and",
  OR:       "or",
  VAR:      "var",
  
  //Types of different statements within the language
  STMTTYPES: {
    ASSIGN:       "assign",
    VARDECL:      "vardecl",
    METHODDEFINE: "methoddefine",
    METHOD:       "method",
    RETURN:       "return",
    IF:           "if",
    ELSEIF:       "elseif",
    ELSE:         "else",
    LOOPUNTIL:    "loopuntil",
    LOOPFOR:      "loopfor",
    WAITUNTIL:    "waituntil",
    WAITFOR:      "waitfor",
  },
  
  searchForTerminal: function(token, terminalType) {
    if(this[terminalType] !== null)
    {
      for(var prop in this[terminalType]) 
      {
        if(this[terminalType].hasOwnProperty(prop) && token.indexOf(this[terminalType][prop]) > -1) 
        {
          return this[terminalType][prop];
        }
      }
    }

    return FALSE;
  },
};

//NOTE: Order matters in this array! We must ensure that symbols which are contained in other symbols come LAST.
TERMINALS.comparators = [ TERMINALS.EQ, TERMINALS.NEQ, TERMINALS.LT, TERMINALS.GT, TERMINALS.LTE, TERMINALS.GTE ];

//String Literal Arrays

//Datatypes for variables and methods
TERMINALS.dataTypes = [ TERMINALS.VOID, TERMINALS.INT, TERMINALS.STRING, TERMINALS.BOOL ];

//Types of "calls" that are used in conjunction with the datatype arrays.
TERMINALS.callTypes = [ TERMINALS.VAR, TERMINALS.STMTTYPES.METHOD ];

//Logical operators
TERMINALS.logOps = [ TERMINALS.AND, TERMINALS.OR ];

//Boolean values
TERMINALS.booleanVals = [ TERMINALS.TRUE, TERMINALS.FALSE ];

//This array is a "master array" containing all reserved terminals that cannot be used as variable / method names.
TERMINALS.reservedWords = [ TERMINALS.OPENPAREN, TERMINALS.CLOSEPAREN, TERMINALS.OPENBRACE, TERMINALS.CLOSEBRACE, 
        TERMINALS.OPENBRACKET, TERMINALS.CLOSEBRACKET, TERMINALS.QUOTE, TERMINALS.SEMICOLON, TERMINALS.COMMA, TERMINALS.EQ,
        TERMINALS.NEQ,  TERMINALS.LTE, TERMINALS.GTE, TERMINALS.EQUALS, TERMINALS.LT, TERMINALS.GT, TERMINALS.DASH,
        TERMINALS.VOID, TERMINALS.INT, TERMINALS.STRING, TERMINALS.BOOL, TERMINALS.AND, TERMINALS.OR, TERMINALS.TRUE, 
        TERMINALS.FALSE, TERMINALS.ASSIGN, TERMINALS.VARDECL, TERMINALS.METHODDEFINE, TERMINALS.METHOD, TERMINALS.RETURN, 
        TERMINALS.IF, TERMINALS.ELSEIF, TERMINALS.ELSE, TERMINALS.LOOPUNTIL, TERMINALS.LOOPFOR, TERMINALS.WAITUNTIL, 
        TERMINALS.WAITFOR, TERMINALS.VAR, TERMINALS.METHOD ];

function validateId(id)
{
  if(TERMINALS.reservedWords.indexOf(id) > -1)
  {
    INTERPRETER.error("ID", "ID cannot be reserved word " + id);
    return false;
  }
  else if(/[^a-zA-Z0-9]/.test(id))
  {
    INTERPRETER.error("ID", "ID must be alphanumeric.");
    return false;
  }

  return true;
}

function Var(body, callTokens)
{
  this.body = body;

  this.id = null; 
  this.vardecl = null;
  
  this.id = validateId(callTokens[1]) ? callTokens[1] : null;
}

Var.prototype.getId = function() {
  return this.id;
};

Var.prototype.print = function() {
  if(this.id !== null)
  {
    INTERPRETER.write("parse", "var " + this.id);
  }
  else
  {
    INTERPRETER.write("parse", "Empty VARCALL");
  }
};

/**
 * Ensure that the var actually exists in the varTable.
 */
/*Var.prototype.validate = function() {
{
  this.interpreter.writeln("validate", "Validating VAR");

  var variable = this.interpreter.findVar(this.body, this.id);
  if(variable == null)
  {
    this.interpreter.error("VAR", this.interpreter.getCurrentLineNum(), this.interpreter.getCurrentLine(), "Var " + this.id + " is not defined.");
  }
};*/

/**
 * We get the variable's current value from the varTable and return it.
 */
/*public Object execute(Object args[]) 
{
  return interpreter.getVar(id);
}*/

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

INTERPRETER.extMethodTable.push({
  id: 'add',
  type: TERMINALS.INT,
  paramTypes: [TERMINALS.INT, TERMINALS.INT],
  execute: function() {
    return arguments[0] + arguments[1];
  }
});

INTERPRETER.extMethodTable.push({
  id: "intToString",
  type: TERMINALS.STRING,
  paramTypes: [TERMINALS.INT],
  execute: function() {
    return '' + arguments[0];
  }
});

INTERPRETER.extMethodTable.push({
  id: 'print',
  type: TERMINALS.VOID,
  paramTypes: [TERMINALS.STRING],
  execute: function() {
    INTERPRETER.writeln("message", arguments[0]);
    return null;
  }
});
