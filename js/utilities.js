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
