function Service_PreInvokeMethod (MethodName:chars, Inputs:PropertySet, Outputs:PropertySet)
{
/*******************************************************************
*  Created By:		Peteris Prieditis
*  Date Created:	2019-02-24 
* 
*  Description/Purpose/Notes: 
*      Detailed description is in function ExecuteBS.
*
*  Modification List:
*
*  Name		Date yyy-mm-dd	Modification Description
*  ---------------------------------------------------------------
*  Peteris Prieditis 2019-02-24: Created version 1.0
*******************************************************************/
	var iReturn:float = ContinueOperation;	

	try{			
		switch(MethodName){			
			case "ExecuteBS":				
				ExecuteBS(Inputs,Outputs);								
				iReturn = CancelOperation;
				break;			
			default:								
				break;
		} 	
	}catch(e){
		throw(e);
	}    
	return (iReturn);
}
