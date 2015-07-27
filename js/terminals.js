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
