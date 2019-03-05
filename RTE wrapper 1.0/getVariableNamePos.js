function getVariableNamePos(cContext:chars, cVariable:chars):Number{
	var nVariableNamePos:float = -1;
	nVariableNamePos = cContext.indexOf(","+cVariable+"=");
	if (nVariableNamePos == -1){
	    nVariableNamePos = cContext.indexOf(cVariable+"=");
		if (nVariableNamePos > 0){
		    nVariableNamePos = -1;
		}
	} else {
	    nVariableNamePos += 1;
	}
	return nVariableNamePos;
}
