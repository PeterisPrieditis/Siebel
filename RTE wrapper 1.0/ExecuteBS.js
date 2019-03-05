function ExecuteBS(Inputs:PropertySet,Outputs:PropertySet){
/*******************************************************************
*  Created By:		Peteris Prieditis
*  Date Created:	2019-02-24 
* 
*  Description/Purpose/Notes: 
*      1) This is RTE generic wrapper and the intention is to: 
*          1.1) remove code what is between RTE and invoked process.
*          1.2) minimize amount of Profile Attributes
*      2) BS can receive data from RTE through:
*          2.1) Context property for example "CFG=1,Input=Req.ProcessName=IND Peteris Tests Dummy WF;Req.Object Id=[bc.[co.BC Name.co].PP Parent Id Calc.bc];Req.Input Arg 1=[bc.[co.BC Name.co].Id.bc];Req.Input Arg 2=[bc.[co.BC Name.co].PP Parent BC Name Calc.bc]"
*          2.2) Profile Attribute what can be defined in input string by "PA"
*      3) Input Context can have these arguments:
*          3.1) PA - Maximal Context length is 250 characters but it can be extended by Profile Attribute defined by PA
*          3.2) CFG - Predefined configuration. Purpose of this argument is to re-use generic configuration and minimize Context property length
*          3.4) Input - Input what is passed to invoked BS
*          3.5) BS - Name of invoked BS
*          3.6) BSM - Invoked method of BS
*      4) It is possible to use these variables:
*          4.1) [co.<NAME>.co] - Data what is automatically received from RTE. You can use "Action", "ActionSet", "BC Name", "Event Name", "Event Type", "EventId", "Object Name", "Sub Event"
*          4.2) [pa.<NAME>.pa] - Profile Attribute
*          4.3) [bf.<NAME>.bf] - BC name and Field name. For example "[bf.IND Notification.IND Account Id.bf]" but it is much beter to not hardcode variables but to use "[bf.[co.Business Component Name.co].IND Account Id.bf]"
*          4.4) [in.<NAME>.in] - Variable to use data from Input argument. For example "Input=Req.ProcessName=IND Peteris Tests Dummy WF;Description=WF [in.Req.ProcessName.in]" will give "IND Peteris Tests Dummy WF"
*      5) Use the correct delimiter! You must use "," between regular variables and ";" for variables inside Input variable!
*      6) Dot notation works ONLY with 2 levers!!! For example this works "Req.ProcessName=IND Peteris Tests Dummy WF" but this will NOT work "Req.ReqChild.ProcessName=IND Peteris Tests Dummy WF"!
*
*      Notes:
*          - Please test before use!
*          - Add custom error handling and you can change function "processCFG" to use run time configuration and not repository dependent.
*  Modification List:
*
*  Name		Date yyy-mm-dd	Modification Description
*  ---------------------------------------------------------------
*  Peteris Prieditis 2019-02-24: Created version 1.0
*******************************************************************/
    var cContext:chars         = "",
		psBSInput:PropertySet  = null,
		psBSOutput:PropertySet = null,
	    aInputArg:Array        = null,
	    cCFG:chars             = "",
		cPA:chars              = "",
	    cInput:chars           = "",
	    cBS:chars              = "",
	    cBSM:chars             = "",
		cBStemp:chars          = "",
		cBSMtemp:chars         = "",
	    oBS:Service            = null,
		cPAContext:chars       = "",
		aPACleanUpList:Array   = null,
		aRTEContext:Array      = null;
	try{
	    psBSInput = TheApplication().NewPropertySet();
		psBSOutput = TheApplication().NewPropertySet();
		aPACleanUpList = new Array();
		aRTEContext = new Array();

	    cContext = Inputs.GetProperty("Context");
		aRTEContext["Action"] = Inputs.GetProperty("Action");
		aRTEContext["ActionSet"] = Inputs.GetProperty("ActionSet");
		aRTEContext["BC Name"] = Inputs.GetProperty("Business Component Name");
		aRTEContext["Event Name"] = Inputs.GetProperty("Event Name");
		aRTEContext["Event Type"] = Inputs.GetProperty("Event Type");
		aRTEContext["EventId"] = Inputs.GetProperty("EventId");
		aRTEContext["Object Name"] = Inputs.GetProperty("Object Name");
		aRTEContext["Sub Event"] = Inputs.GetProperty("Sub Event");

		gInitialRTEContext = cContext;
		
		//Get additional input from Profile Attribute
		cPA = getVariableFromContext(cContext, "PA", ",");
		cPAContext = convertVariablesToValues("[pa." + cPA + ".pa]", "pa", aPACleanUpList, aRTEContext);
		if (cPAContext != "[pa..pa]") {
		    cContext += cPAContext;
		}

        //get default configuration 
		cCFG = getVariableFromContext(cContext, "CFG", ","); 
		processCFG(psBSInput, cCFG, cBS, cBSM, aPACleanUpList, aRTEContext);

		//process Input
		cInput = getVariableFromContext(cContext, "Input", ",");
		processInput(psBSInput, cInput, aPACleanUpList, aRTEContext);

		//overwrite template cBS, cBSM in case if we receive data from RTE
		cBStemp = getVariableFromContext(cContext, "BS", ",");
		cBSMtemp = getVariableFromContext(cContext, "BSM", ",");
		if (cBStemp.length > 0 && cBSMtemp.length > 0) {
		    cBS = cBStemp;
			cBSM = cBSMtemp;
		}

		//Clean Profile Attributes
		paCleanUp(aPACleanUpList);

		oBS = TheApplication().GetService(cBS);
		oBS.InvokeMethod(cBSM, psBSInput, psBSOutput);
		Outputs.AddChild(psBSOutput);
	}catch(e){
		// ADD CUSTOM ERROR HANDLING!
		throw(e);
	}finally{
		aPACleanUpList = null;
		aRTEContext = null;
		oBS = null;
		psBSOutput = null;
		psBSInput = null;
	}
}
