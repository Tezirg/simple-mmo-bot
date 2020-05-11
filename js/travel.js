var bot_home_url = "https://web.simple-mmo.com/"
var bot_travel_home_delay = 20 * 1000 // 20 secs
var bot_travel_url = "https://web.simple-mmo.com/travel"
var bot_travel_button_id = ".stepbuttonnew"
var bot_travel_attack_id = "a:contains(' Attack')"
var bot_travel_delay = 690;

class BotTravel {
    constructor(targetID, user, combat, random) {
	this.targetID = targetID;
	this.user = user;
	this.rnd = random;
	this.combat = combat;
	this.travelTimer = null;
	this.stepDelay = 0;
	this.travelCombat = false;
    }

    canStep() {
	if (this.stepDelay == 0)
	    return true;
	return false;
    }

    setTravelCombat(enabled) {
	this.travelCombat = enabled;
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
	    delay = delay * 1000 + 50;
	    that.setDelay(delay);
	    // Set a timeout for next step
	    that.travelTimer = setTimeout(function() {
		that.travelTimer = null;
		that.setDelay(0);
	    }, that.rnd.randDelay(delay));

	    // Check if we can combat
	    if (that.travelCombat && that.combat.canCombat())
	    {
		// Is there a mob to kill
		targetDOM = $(that.targetID).contents();
		var attackButton = targetDOM.find(bot_travel_attack_id);
		if (attackButton.length >= 1) {
		    setTimeout(function() {
			that.combat.travelCombat();
		    }, that.rnd.randDelay(bot_travel_delay));
		}
	    }
	    // Return to home for slow mode
	    if (delay >= bot_travel_home_delay && !that.combat.isInCombat())
	    {
		// Do it only 25% of the time
		var dice = Math.floor(Math.random() * 100);
		if (dice <= 25)
		    that.rnd.randNav();
	    }
	}, that.rnd.randDelay(bot_travel_delay));
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
		    }, that.rnd.randDelay(bot_travel_delay));
		});
		$(this.targetID).prop("src", bot_travel_url);
	    }
	    else {
		this.triggerStep();
	    }
	}
    }

}
