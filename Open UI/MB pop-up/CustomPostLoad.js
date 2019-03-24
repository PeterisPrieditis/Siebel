/*******************************************************************
*  Created By:  Peteris Prieditis
*  Date Created: 2019-03-24
*
*  Description/Purpose/Notes: 
*     Adds pop-up for OUI Message Broadcasting. This is only sample code and is not considered to be production environment ready!
*
*******************************************************************/
if (typeof(SiebelAppFacade.CustomPostload) == "undefined") {
	Namespace('SiebelAppFacade.CustomPostload');
	(function () {
		SiebelApp.EventManager.addListner("postload", OnPostload, this);
		function OnPostload() 
        {
			try{
				// check if custom MessageBroadcastingPop-Up exists
                if (!document.getElementById("MessageBroadcastingPop-Up")) {
                    // Adding MessageBroadcastingPop-Up html                    
                    MBAddUI();
                    document.getElementById('MessageBroadcastingPop-UpClose').onclick = function onclickMBPopUpDisable(){
                        MBPopUpNextMessage();
                    };
                    // Checking for new messages in MsgBar
                    observeMsgBar();
                }
                function observeMsgBar(){
                    console.log("checking message bar");
                    // if MsgBar has new messages and Pop-Up is nor open then we need to open it
                    if (document.getElementById('MessageBroadcastingPop-UpClose').getAttribute("messageId") == "" && document.getElementById("MsgBar").textContent != "0") {
                        // Clicking on MsgBar to get HTML with the new messages
                        document.getElementById("MsgBar").click();
                        // We are making the old background invisible
                        document.querySelectorAll(".ui-widget-overlay.ui-front").item(0).setAttribute("class", "ui-widget-overlay ui-front ghost");
                        // Adding new custom background
                        $("#_sweclient").addClass("DissableClicks");
                        $("#MessageBroadcastingPop-UpBackground").addClass("enable");
                        // Launch the new custom pop-up                        
                        MBUpdate();
                    }
                    // tried to use MutationObserver and monitor MsgBar.classList.contains("msgblinkstyle") but it was not picking up all mutations
                    setTimeout(observeMsgBar, 2000);
                }
                function MBAddUI(){
                    var popUpDialog  = "<dialog id='MessageBroadcastingPop-Up'>";
                        popUpDialog += "<h4 class='message-count'>2 new messages</h4>";
                        popUpDialog += "<h4 class='message-heading'>Simple Pop-up Box!</h4>";
                        popUpDialog += "<p>This is a simple Pop-Up. We are showing here the full message.<p>";
                        popUpDialog += "<button id='MessageBroadcastingPop-UpClose' messageId=''>Ok/Next</button>";
                        popUpDialog += "</dialog>";
                    var background ="<div id='MessageBroadcastingPop-UpBackground'></div>";
                    $(document.body).append(popUpDialog);
                    $(document.body).append(background);
                }
                function MBUpdate(){
                    var msgbar = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.siebui-msgbar-popup');
                    msgbar.css('display', 'none');
                    var unreadmessage = msgbar.find(".siebui-unreadmessage");
                    var amountOfMessages;
                    var buttonText;
                    // If we have new messages then we are showing them
                    if (unreadmessage.length > 0){
                        var messageHeadingParent = unreadmessage[0].getElementsByClassName("siebui-msgbar-summary"); 
                        var messageHeadingText = messageHeadingParent.item(0).textContent;
                        var notificationCreated = unreadmessage[0].getElementsByClassName("siebui-msgbar-date");
                        var notificationCreatedText = notificationCreated.item(0).textContent;
                        var messageTextParent = unreadmessage[0].getElementsByClassName("ui-accordion-content");
                        var messageText = messageTextParent.item(0).textContent;
                        var messageId = unreadmessage[0].getAttribute("id");
                        if (unreadmessage.length == 1){
                            amountOfMessages = unreadmessage.length + " new message"
                            buttonText = "Ok";
                        } else if (unreadmessage.length > 1){
                            amountOfMessages = unreadmessage.length + " new messages";
                            buttonText = "Next";
                        }
                        MBPopUpShow(amountOfMessages, messageHeadingText, messageText, notificationCreatedText, buttonText, messageId);
                    } else {
                        // We have read all the messages. We need to get back to original screen.
                        document.getElementById('MessageBroadcastingPop-Up').close();
                        document.querySelectorAll(".ui-widget-overlay.ui-front.ghost").item(0).setAttribute("class", "ui-widget-overlay ui-front");
                        $("#_sweclient").removeClass("DissableClicks");
                        $("#MessageBroadcastingPop-UpBackground").removeClass("enable");
                        document.getElementsByClassName('ui-widget-overlay')[0].click();
                    }
                }
                function MBPopUpShow(amountOfMessages, messageHeadingText, messageText, notificationCreatedText, buttonText, messageId){
                    var popUp = document.getElementById('MessageBroadcastingPop-Up');
                    popUp.getElementsByClassName("message-count").item(0).textContent = amountOfMessages;
                    popUp.getElementsByClassName("message-heading").item(0).textContent = messageHeadingText;
                    popUp.getElementsByTagName("p").item(0).textContent = messageText + " (" + notificationCreatedText + ")";
                    popUp.getElementsByTagName("button").item(0).textContent = buttonText;
                    popUp.getElementsByTagName("button").item(0).setAttribute("messageId", messageId);
                    popUp.show();                   
                }
                function MBPopUpNextMessage(){
                    var messageId = document.getElementById('MessageBroadcastingPop-UpClose').getAttribute("messageId");
                    var messageElement = document.getElementById(messageId);
                    messageElement.getElementsByClassName("ui-icon-triangle-1-e").item(0).click();
                    document.getElementById('MessageBroadcastingPop-UpClose').setAttribute("messageId", "");
                    MBUpdate();
                }
			} catch(e){
			} finally {
			}
		}
	}());
}
