function Code(interpreter, c)
{
  if(c.length === 0)
  {
    c = "";
  }

  this.interpreter = interpreter;
  this.codeString = c;
  this.codeLines = this.codeString.split("\n");
  this.codeLength = this.codeLines.length;
  this.tokenizedCode = [];
}

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
    //TODO: error handling
    //interpreter.error("STRING", -1, s, "Unenclosed string!");
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
  this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' Codeline: ' + codeLine);
  //We first split up the string by spaces.
  var pass = codeLine.trim().split(" ");
  this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' Pass: ' + pass);

  //Go over each individual item separated by spaces in the original string.
  //This will get all tokens of type 2 without further processing,
  //but if we find a symbol, it might be type 1, 3 or 4, so more processing is required.
  for(var x = 0, length = pass.length; x < length; x++)
  {
    //Trim the string and ensure it's not empty space. If it is, move on to the next one.
    var token = pass[x].trim();
    this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' Token ' + x + ': ' + token);
    if(token.length > 0)
    {
      //If the string is entirely alphanumeric, add it to the array and move on to the next one.
      if(this.checkAlphaNumeric(token))
      {
        this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' is alphanumeric, pushing');
        tokens.push(token);
      }
      //If the string has a symbol, it could be of type 1, 3 or 4
      else
      {
        this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' is not alphanumeric');

        //If this token has a quote as its first character, we will consider it, 
        //and all tokens following it (until we find another quote), part of a type 3 String token
        if(token.indexOf(TERMINALS.SYMBOLS.QUOTE > -1) && token.substring(0, 1) == TERMINALS.SYMBOLS.QUOTE)
        {
          this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' contains a Type 3 (string)');
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
          this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' ' + token + ' contains a Type 4 (negative number)');
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
          
          return tokens;
        }
        //If we don't meet the criteria above, then we assume type 1
        //We know at this point that we have at least one symbol somewhere in the string.
        else
        {
          this.interpreter.writeln('tokenize', 'Line ' + lineNum + '  ' + token + ' contains a Type 1 (symbol)');

          //Go through each symbol to find which one we have
          var symbol = TERMINALS.searchForTerminal(token, "SYMBOLS");
          if(symbol)
          {
            //Split the string around that one symbol (resulting in two halves)
            var splitToken = token.split(symbol);
            var left = splitToken.shift();
            this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' Left: ' + left);
            var right = splitToken.join();
            this.interpreter.writeln('tokenize', 'Line ' + lineNum + ' Right: ' + right);

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
            break;
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
