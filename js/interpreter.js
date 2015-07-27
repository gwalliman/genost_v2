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
