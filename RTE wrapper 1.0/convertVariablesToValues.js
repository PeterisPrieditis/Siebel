function convertVariablesToValues(cPropertyValue:chars, cVariableType:chars, &aPACleanUpList:Array, &aRTEContext:Array):chars{
/*******************************************************************
*
* Converts Variables to values. The list of possible variables are:
*     1) [co.<NAME>.co] input from RTE for example ActionSet name
*     2) [pa.<NAME>.pa] Profile Attribute
*     3) [bc.<NAME>.bc] place holder for BC data for example [bc.Account.Id.bc]
*     4) [in.<NAME>.in] reference to Input variable for example [in.Req.ProcessName.in] in combination with "Input=Req.ProcessName=IND Peteris Tests Dummy WF" will be translated to "IND Peteris Tests Dummy WF"
*
*******************************************************************/
	var nVariableStartLoc:float     = -1,
	    nVariableStartLocNext:float = -1,
	    nVariableEndLoc:float       = -1,
	    cVariableName:chars         = "",
	    cVariableValue:chars        = "";

	var cSTART:chars = "["+cVariableType+".",
	    cEND:chars   = "."+cVariableType+"]";

	var oActiveBO:BusObject = null,
	    oBC:BusComp         = null,
	    cBCName:chars       = "",
	    cBCFieldName:chars  = "", 
	    cBCVariableDotLoc:float = -1,
        cTempContext:chars  = "";

	try {
		do {
		    nVariableStartLoc = cPropertyValue.indexOf(cSTART);
			nVariableEndLoc = cPropertyValue.indexOf(cEND);

			do {
				nVariableStartLocNext = cPropertyValue.indexOf(cSTART, nVariableStartLoc + cSTART.length)
				if (nVariableStartLocNext > -1 && nVariableStartLocNext < nVariableEndLoc){
				    nVariableStartLoc = nVariableStartLocNext;
				}
			} while (nVariableStartLocNext > -1 && nVariableStartLocNext < nVariableEndLoc)
	
			if ((nVariableStartLoc > -1 && nVariableEndLoc > -1) && (nVariableStartLoc + cSTART.length < nVariableEndLoc)) {
			    cVariableName = cPropertyValue.substring(nVariableStartLoc+cSTART.length, nVariableEndLoc);
				
				if (cVariableName.length > 0){
				    if(cVariableType == "pa"){
				        cVariableValue = TheApplication().GetProfileAttr(cVariableName);
					} else if (cVariableType == "bc") {
					    oActiveBO = TheApplication().ActiveBusObject();
						cBCVariableDotLoc = cVariableName.indexOf(".");
						cBCName = cVariableName.substring(0, cBCVariableDotLoc);
						cBCFieldName = cVariableName.substring(cBCVariableDotLoc+1, cVariableName.length);
						oBC = oActiveBO.GetBusComp(cBCName);
						if (cBCFieldName != "ParentBusComp()"){
						    cVariableValue = oBC.GetFieldValue(cBCFieldName);
						} else if (cBCFieldName == "ParentBusComp()"){
						    cVariableValue = oBC.ParentBusComp().Name();
						}
					} else if (cVariableType == "co") {
					    cVariableValue = aRTEContext[cVariableName];
					} else if (cVariableType == "in") {
					    cTempContext = gInitialRTEContext;
						cTempContext = getVariableFromContext(cTempContext, "Input", ",");
					    cVariableValue = getVariableFromContext(cTempContext, cVariableName, ";");
					}
				} else {
				    cVariableValue = "";
				}
				if(cVariableType == "pa"){
					if (cVariableValue.length > 0){
					    aPACleanUpList.push(cVariableName);
					}
				}
				cPropertyValue = cPropertyValue.substring(0, nVariableStartLoc) + cVariableValue + cPropertyValue.substring(nVariableEndLoc+cEND.length, cPropertyValue.length);
			}
		} while((nVariableStartLoc > -1 && nVariableEndLoc > -1) && (nVariableStartLoc + cSTART.length < nVariableEndLoc))
    } finally {
	    oBC       = null;
		oActiveBO = null;
	}
    return cPropertyValue;
}
