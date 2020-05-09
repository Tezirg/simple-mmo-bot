var bot_home_url = "https://web.simple-mmo.com/"
var bot_travel_home_delay = 20
var bot_travel_url = "https://web.simple-mmo.com/travel"
var bot_travel_button_id = ".stepbuttonnew"

class BotTravel {
    constructor(targetID, user) {
	this.targetID = targetID;
	this.user = user;
	this.travelTimer = null;
	this.stepDelay = 0;
    }

    canStep() {
	if (this.stepDelay == 0)
	    return true;
	return false;
    }

    setDelay(d) {
	this.stepDelay = d;
    }
    
    triggerStep() {
	var that = this;
	var targetDOM = $(this.targetID).contents();
	var stepButton = targetDOM.find(bot_travel_button_id);
	try {
	    stepButton[0].click();
	}
	catch {
	}

	// Get delay after xx ms
	setTimeout(function() {
	    targetDOM = $(that.targetID).contents();
	    stepButton = targetDOM.find(bot_travel_button_id);
	    var delay = parseInt(stepButton.text());
	    that.setDelay(delay);
	    // Set a timeout for next step
	    that.travelTimer = setTimeout(function() {
		that.travelTimer = null;
		that.setDelay(0);
	    }, delay * 1000 + 50);

	    // Return to home for slow mode
	    if (delay >= bot_travel_home_delay) {
		$(that.targetID).prop("src", bot_home_url);
	    }
	}, 500);
    }

    travel() {
	if (this.stepDelay == 0)
	{
	    this.setDelay(1);
	    var target_url = $(this.targetID).prop('src');
	    if (target_url != bot_travel_url) {
		var that = this;
		$(this.targetID).bind("load", function() {
		    $(that.targetID).unbind();
		    setTimeout(function() {
			that.triggerStep();
		    }, 100);
		});
		$(this.targetID).prop("src", bot_travel_url);
	    }
	    else {
		this.triggerStep();
	    }
	}
    }

}
