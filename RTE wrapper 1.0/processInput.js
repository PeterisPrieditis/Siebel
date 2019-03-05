function processInput(&psBSInput:PropertySet, cInput:chars, &aPACleanUpList:Array, &aRTEContext:Array){
	var cPSType:chars        = "",
	    cPropertyName:chars  = "",
	    cPropertyValue:chars = "",
	    nPSChildCount:float = -1,
	    nPSChildPosition:float = -1,
	    nSemicolonLoc:float = -1,
	    nCommaLoc:float     = -1,
	    nEqualitySignLoc:float = -1,
	    psTemp:PropertySet   = null,
	    bFoundChildPS:bool   = false,
	    nPropertyValueLastChar:float = -1;

    try {
		while (cInput.length > 0){
		    nSemicolonLoc = cInput.indexOf(";");
			nCommaLoc = cInput.indexOf(".");
			nEqualitySignLoc = cInput.indexOf("=");
			if (nSemicolonLoc > 0){
			    nPropertyValueLastChar = nSemicolonLoc;
		    } else {
			    nPropertyValueLastChar = cInput.length;
		    }
			cPropertyValue = cInput.substring(nEqualitySignLoc+1, nPropertyValueLastChar);
			cPropertyValue = convertVariablesToValues(cPropertyValue, "co", aPACleanUpList, aRTEContext);
	        cPropertyValue = convertVariablesToValues(cPropertyValue, "pa", aPACleanUpList, aRTEContext);
			cPropertyValue = convertVariablesToValues(cPropertyValue, "in", aPACleanUpList, aRTEContext);
			cPropertyValue = convertVariablesToValues(cPropertyValue, "bc", aPACleanUpList, aRTEContext);
	
			if(nCommaLoc > 0 && (nCommaLoc < nEqualitySignLoc && (nEqualitySignLoc < nSemicolonLoc|| nSemicolonLoc == -1))){
				cPSType = cInput.substring(0,nCommaLoc);
				cPropertyName = cInput.substring(nCommaLoc+1,nEqualitySignLoc);
				nPSChildCount = psBSInput.GetChildCount();
				if (nPSChildCount > 0){
				    for(nPSChildPosition = 0; nPSChildPosition < nPSChildCount && bFoundChildPS == false; nPSChildPosition += 1) {
					    if (psBSInput.GetChild(nPSChildPosition).GetType() == cPSType){
						    psTemp = psBSInput.GetChild(nPSChildPosition);
							bFoundChildPS = true;
					    }
					}
				}
				if (bFoundChildPS == false){
				    psTemp = TheApplication().NewPropertySet();
					psTemp.SetType(cPSType);
					psBSInput.AddChild(psTemp);
				}
				psTemp.SetProperty(cPropertyName,cPropertyValue);
				bFoundChildPS = false;
				psTemp == null;
			} else {
			    cPropertyName = cInput.substring(0,nEqualitySignLoc);
				psBSInput.SetProperty(cPropertyName,cPropertyValue);
			}
			cInput = cInput.substring(nPropertyValueLastChar+1,cInput.length);
		};
	} finally {
	    psTemp = null;
	}
}
