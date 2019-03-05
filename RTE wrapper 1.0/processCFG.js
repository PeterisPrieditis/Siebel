function processCFG(&psBSInput:PropertySet, cCFG:chars, &cBS:chars, &cBSM:chars, &aPACleanUpList:Array, &aRTEContext:Array){
/*******************************************************************
*
* Configuration template storage.
* It is advised to customize this method and store data in runtime configuration for variable cCFGData.
* Now cCFGData is stored in repository (this function).
*
*******************************************************************/
	var cCFGData:chars = "",
	    cInput:chars   = "";
	if (cCFG == "AsyncSerReq") {
	    cCFGData  = "BS=Server Requests,BSM=SubmitRequest,Input=Component=WfProcMgr;Mode=DirectDb;NumRetries=0;RetryInterval=0;RetryOnError=0;"
		cCFGData += "Description=WF '[in.Req.ProcessName.in]' | Context BCRowId '[bc.[co.BC Name.co].Id.bc]' | ET '[co.Event Type.co]' |BO '[co.Object Name.co]' |BC Name '[co.BC Name.co]' |EN '[co.Event Name.co]' |SE '[co.Sub Event.co]' |AS '[co.ActionSet.co]' |A '[co.Action.co]'";
	} else if (cCFG == "WPM") {
	    cCFGData = "BS=Workflow Process Manager,BSM=RunProcess"
	}
	//Set initial configuration from template
	cInput = getVariableFromContext(cCFGData, "Input", ",");
	processInput(psBSInput, cInput, aPACleanUpList, aRTEContext);
	cBS = getVariableFromContext(cCFGData, "BS", ",");
	cBSM = getVariableFromContext(cCFGData, "BSM", ",");
}
