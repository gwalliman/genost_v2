var exports = {};

var INTERPRETER = {

  varStack: {},
  methodTable: {},
  extMethodTable: {},
  currentLineNum: 0,

  code: {},

  body: {},

  getCurrentLineNum: function() {
    return this.currentLineNum;
  },

  setCurrentLineNum: function(lineNum) {
    if(lineNum >= 0 && lineNum <= this.code.getCodeLength())
    {
      this.currentLineNum = lineNum;
    }
  },

  getCurrentLine: function() {
    return this.code.getLine(this.currentLineNum);
  },

  getCurrentLineTokens: function() {
    return this.code.getTokenizedLine(this.currentLineNum);
  },

  goToNextLine: function() {
    if(this.currentLineNum < this.code.getCodeLength())
    {
      this.currentLineNum++;
    }
    return this.code.getLine(this.currentLineNum);
  },

  //Step 0: Load In External Methods
  initialize: function() {
    //TODO
  },

  //Step 1: Load In Code and Tokenize
  loadCode: function(codeString) {

    this.code = new Code(this, codeString);
    this.code.tokenizeCode();
  },

  //Step 2: Parse Code
  parseCode: function() {
    this.body = new Body(this, null, this.code);
    console.log(this.body);

  },
  
  //Step 3: Link and Validate Code
  
  printAllTokens: function() {
    return this.code.printAllTokens();
  },

  messageMask: {},

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
  error: function(variable, lineNum, code, error) {
    var fu = variable.toUpperCase() + " ERROR Near Line " + lineNum + ": " + code + "\n" + error;
    console.log(fu);
    throw new Error(fu);

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
    }
  },
};

exports.initialize = function() {
  return INTERPRETER.initialize();
};

exports.loadCode = function(code) {
  return INTERPRETER.loadCode(code);
};

exports.getCode = function() {
  return INTERPRETER.code;
};
