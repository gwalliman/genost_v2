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

  //NOTE: Order matters in this array! We must ensure that symbols which are contained in other symbols come LAST.
  comparators: [ this.EQ, this.NEQ, this.LT, this.GT, this.LTE, this.GTE ],
    
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
  
  //String Literal Arrays
  
  //Datatypes for variables and methods
  dataTypes: [ this.VOID, this.INT, this.STRING, this.BOOL ],
  
  //Logical operators
  logOps: [ this.AND, this.OR ],
  
  //Boolean values
  booleanVals: [ this.TRUE, this.FALSE ],
    
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
  
  //Types of "calls" that are used in conjunction with the datatype arrays.
  callTypes: [ this.VAR, this.METHOD ],

  //This array is a "master array" containing all reserved terminals that cannot be used as variable / method names.
  reservedWords: [ this.OPENPAREN, this.CLOSEPAREN, this.OPENBRACE, this.CLOSEBRACE, this.OPENBRACKET, 
          this.CLOSEBRACKET, this.QUOTE, this.SEMICOLON, this.COMMA, this.EQ, 
          this.NEQ,  this.LTE, this.GTE, this.EQUALS, this.LT, this.GT, this.DASH, 
          this.VOID, this.INT, this.STRING, this.BOOL, this.AND, this.OR, this.TRUE, this.FALSE, 
          this.ASSIGN, this.VARDECL, this.METHODDEFINE, this.METHOD, this.RETURN, this.IF, 
          this.ELSEIF, this.ELSE, this.LOOPUNTIL, this.LOOPFOR, this.WAITUNTIL, this.WAITFOR,
          this.VAR, this.METHOD ],

  //TODO: improve the way this is handled. Do we really need these huge arrays?
  
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
