function paCleanUp (&aPACleanUpList:Array){
/*******************************************************************
*
* Clear Profile Attributes if there was used any
*
*******************************************************************/
    var cPAName:chars = "";
    while(aPACleanUpList.length > 0){
        cPAName = aPACleanUpList.pop();
		if (cPAName.length > 0) {
	        TheApplication().SetProfileAttr(cPAName,"");
		} 
	}
}
