var bot_quest_url = "https://web.simple-mmo.com/quests/viewall"
var bot_quest_list_select = "button:contains('View Quest')"
var bot_quest_start_id = "button:contains('Perform quest')"
var bot_quest_cancel_id = "button:contains('Cancel')"
var bot_quest_delay = 825

class BotQuest {
    constructor(targetID, user, random) {
	this.targetID = targetID;
	this.user = user;
	this.rnd = random;
	this.questDelay = 0;
    }

    isInQuest() {
	if (this.questDelay == 0)
	    return false;
	else
	    return true;
    }

    canQuest() {
	return this.user.quests > 0 && this.questDelay == 0;
    }
    
    triggerQuest(questIndex) {
	var that = this;
	this.questDelay = 1;
	var targetDOM = $(this.targetID).contents();
	var allButtons = targetDOM.find(bot_quest_list_select);
	// Invert index so that 0 is at the page bottom
	var indexInverted = allButtons.length - 1 - questIndex;
	var questButton = allButtons[indexInverted];
	try { questButton.click(); } catch {}

	// Do quest after xx ms
	setTimeout(function() {
	    targetDOM = $(that.targetID).contents();
	    var questButton = targetDOM.find(bot_quest_start_id);
	    try { questButton[0].click(); } catch {}
	    // Finish after xx ms
	    setTimeout(function() {
		targetDOM = $(that.targetID).contents();
		var questButton = targetDOM.find(bot_quest_cancel_id);
		try { questButton[0].click(); } catch {}
		// Set delay to zero
		setTimeout(function() {
		    that.questDelay = 0;
		}, that.rnd.randDelay(bot_quest_delay));
	    }, that.rnd.randDelay(bot_quest_delay));
	}, that.rnd.randDelay(bot_quest_delay));

    }
    
    quest(questIndex) {
	if (this.questDelay == 0)
	{
	    this.questDelay = 1;
	    var target_url = $(this.targetID).prop('src');
	    if (target_url != bot_quest_url) {
		var that = this;
		$(this.targetID).bind("load", function() {
		    $(that.targetID).unbind();
		    setTimeout(function() {
			that.triggerQuest(questIndex);
		    }, that.rnd.randDelay(250));
		});
		$(this.targetID).prop("src", bot_quest_url);		
	    }
	    else {
		this.triggerQuest(questIndex);
	    }
	}
    }

}
