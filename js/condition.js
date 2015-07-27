/**
 * CONDITIONLISTS are used to build advanced logical statement. At the core, a CONDITIONLIST allows various ways of comparing multiple CONDITION using "and" or "or".
 * A basic logical statement (x AND y) should be extensible in two ways: first, by concatenating (x AND y OR z) and second, by nesting (x AND (y OR z)).
 * CONDITIONLIST structures are able to accomplish both of these functionalities.
 * 
 * A CONDITIONLIST contains one Object "con", which can be either a CONDITION or another CONDITIONLIST. It also contains a logical operator and a link to another CONDITIONLIST "nextCon" (separate from the aforementioned CONDITIONLIST/CONDITION object)
 * Using this structure, we can create a simple logical comparison, and then concatinate or nest.
 * 
 * One CONDITION can be represented by setting the con Object to that condition. A logical comparison may be made by setting a logical operator, creating a new CONDITIONLIST and linking it to nextCon.
 * Concatination may be achieved indefinitely by continuing to string CONDITIONLISTs together, like in a linked list.
 * 
 * We may nest at any time by linking "con" to a CONDITIONLIST instead of a CONDITION.
 * 
 * In this way, logical statements of any complexity may be represented and executed.
 * 
 * We are able to entirely remove ambiguity by wrapping every CONDITION and nested CONDITIONLISTS in brackets ([ ])
 * 
 * @author Garret Walliman (gwallima@asu.edu)
 *
 */
function createCondition(body, conditionTokens)
{
  //Con an be either a CONDITION or a CONDITIONLIST, if we are nesting
  var conditions = [];
  
  //Every CONDITIONLIST will always have a bracket as its first character.
  if(conditionTokens[0] != TERMINALS.SYMBOLS.OPENBRACKET)
  {
    INTERPRETER.error("CONDITION",  "CONDITION must begin with [");
  }
  if(conditionTokens[conditionTokens.length - 1] != TERMINALS.SYMBOLS.CLOSEBRACKET)
  {
    INTERPRETER.error("CONDITION",  "CONDITION must end with ]");
  }
  
  //We can either have a single predicate, or a formula
  //We check here which we have
  var hasLogOp = false;
  for(var x = 0, length = conditionTokens.length; x < length; x++)
  {
    if(conditionTokens[x] == TERMINALS.AND) || conditionTokens[x]. == Terminals.OR)
    {
      hasLogOp = true;
    }
  }
  
  //If hasLogOp is true, then we have a Formula. We recursively parse, adding each component to the conditions array
  //If false, c is a single predicate, so we just create one.
  //Note that in both cases, we strip away the outer brackets before sending it on.
  if(hasLogOp)
  {
    conType = CONDITIONLIST;
    con = new CONDITIONLIST(interpreter, body, c, c.implode(tokens, " ", 1, closeBracket - 1));
  }
  else
  {
    conType = CONDITION;
    con = new CONDITION(interpreter, body, c, c.implode(tokens, " ", 1, closeBracket - 1));

  }
  
  //If there is a token following tokens[closeBracket], it must be a logop, meaning that there is a sequential CONDITIONLIST.
  //We set nextCon to this new CONDITIONLIST. Again, we strip away the outer brackets.
  if(tokens.length - 1 > closeBracket)
  {
    if(Terminals.logOps.contains(tokens[closeBracket + 1]))
    {
      logOp = tokens[closeBracket + 1];
      if(tokens.length - 1 > closeBracket + 1)
      {
        nextCon = new CONDITIONLIST(interpreter, body, c, c.implode(tokens, " ", closeBracket + 2, tokens.length - 1));
      }
      else interpreter.error("CONDITIONLIST", lineNum, code, "A CONDITION or CONDITIONLIST must follow an AND or OR");
    }
    else interpreter.error("CONDITIONLIST", lineNum, code, "Only AND or OR may follow a CONDITIONLIST");

  }
}

/**
 * Goes through the tokenList and finds the closing bracket that matches an opening bracket.
 * Handles having inner bracket pairs.
 * 
 * @param tokens  the token list, minus the opening bracket
 * @return  the index of the token list where the closing bracket is located, or -1 if no matching closing bracket is found.
 */
private int findCloseBracket(String[] tokens)
{
  int openBrackets = 0;
  int tokenNum = 0;
  for(String token : tokens)
  {
    if(token.equals(Terminals.OPENBRACKET))
      openBrackets++;
    else if(token.equals(Terminals.CLOSEBRACKET))
      openBrackets--;
    
    if(openBrackets == 0)
    {
      return tokenNum;
    }
    else tokenNum++;
  }
  return -1;
}

/**
 * Print function. Determines how to print con (as a CONDITION or a CONDITIONLIST).
 * Next prints the logop and nextCon, if we have one.
 */
public void print() 
{
  if(conType.equals(CONDITIONLIST))
  {   
    interpreter.write("parse", "[");
    ((CONDITIONLIST)con).print();
    interpreter.write("parse", "]");
  }
  else if(conType.equals(CONDITION))
  {
    ((CONDITION)con).print();

  }
  
  if(logOp != null)
  {
    interpreter.write("parse", " " + logOp + " ");
    nextCon.print();
  }
}

/**
 * Validates the con by determining what type it is and calling the validation function for that one.
 * Next, validates the nextCon, if there is one.
 */
public void validate() 
{ 
  interpreter.writeln("validate", "Validating CONDITIONLIST");

  if(conType.equals(CONDITIONLIST))
  {   
    ((CONDITIONLIST)con).validate();
  }
  else if(conType.equals(CONDITION))
  {
    ((CONDITION)con).validate();
  }
  
  if(nextCon != null)
  {
    nextCon.validate();
  }
}

/**
 * Execute con by calling its proper execute function.
 * Both functions will return a boolean value.
 * 
 * If we have a nextCon, execute that and receive its own boolean value.
 * Finally, compare the two values using the logOp and return the result.
 * 
 */
public Object execute(Object args[]) 
{
  boolean go = false;
  if(conType.equals(CONDITIONLIST))
  {   
    go = (Boolean) ((CONDITIONLIST)con).execute(null);
  }
  else if(conType.equals(CONDITION))
  {
    go = (Boolean) ((CONDITION)con).execute(null);
  }
  
  if(nextCon != null)
  {
    //Not sure about this variable name, it may be harmful.
    boolean go2 = false;
    go2 = (Boolean) ((CONDITIONLIST)nextCon).execute(null);
    
    if(logOp.equals(Terminals.AND))
      return go && go2;
    else if(logOp.equals(Terminals.OR))
      return go || go2;
  }
  return go;
}

function Formula(body)
{
  this.body = body;
  this.logOp = null;

  //We must now find a matching close bracket. This may be the close bracket to a CONDITION or a CONDITIONLIST.
  var closeBracket = findCloseBracket(conditionTokens);
  if(closeBracket == -1)
  {
    interpreter.error("CONDITION", lineNum, code, "Missing ]! CONDITION must have matching brackets!");
  }

}

function Predicate(body)
{
  this.body = body;
  this.logOp = null;
}
