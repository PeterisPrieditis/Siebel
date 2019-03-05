function getVariableFromContext(&cContext:chars, cVariable:chars, cDelimiter:chars):chars{
/*******************************************************************
*
* Function gets and removes Variable from Context. Context can have many variables but we are interested only in one.
* Delimiter is used symbol between Variables. 
*
*******************************************************************/
	var cReturn:chars              = "",
	    nVariableNamePos:float    = -1,
	    nVariableValueStart:float = -1,
	    nVariableValueEnd:float   = -1;
	
	if (cDelimiter != ",") {
	    cDelimiter = ";";
	}

	nVariableNamePos = getVariableNamePos(cContext,cVariable); 

	if (nVariableNamePos > -1){
	    nVariableValueStart = nVariableNamePos + cVariable.length + 1;
	    nVariableValueEnd = cContext.indexOf(cDelimiter,nVariableNamePos);
		if (nVariableValueEnd == -1){
		    nVariableValueEnd = cContext.length;
		}
		cReturn = cContext.substring(nVariableValueStart,nVariableValueEnd);
	}

	if (cReturn.length > 0 && nVariableNamePos > -1){
	    if (nVariableNamePos == 0){
		    if (nVariableValueEnd+1 < cContext.length){
		        cContext = cContext.substring(nVariableValueEnd+1, cContext.length);
			} else {
			    cContext = "";
			}
		} else {
			cContext = cContext.substring(0,nVariableNamePos-1)+cContext.substring(nVariableValueEnd, cContext.length);
		}
	}
	return cReturn;
}
