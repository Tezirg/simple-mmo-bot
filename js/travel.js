var bot_home_url = "https://web.simple-mmo.com/"
var bot_travel_home_delay = 20 * 1000 // 20 secs
var bot_travel_url = "https://web.simple-mmo.com/travel"
var bot_travel_button_id = ".stepbuttonnew"
var bot_travel_attack_id = "a:contains(' Attack')"
var bot_travel_delay = 630;

class BotTravel {
    constructor(targetID, user, combat, random, sell) {
	this.targetID = targetID;
	this.user = user;
	this.rnd = random;
	this.combat = combat;
	this.sell = sell;
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

    doStep() {
	var that = this;
	var stepped = new Promise((res, rej) => {
	    try {
		var targetDOM = $(that.targetID).contents();
		var stepButton = targetDOM.find(bot_travel_button_id);
		stepButton[0].click();
		setTimeout(function() {
		    res(true);
		}, that.rnd.randDelay(bot_travel_delay / 2));
	    }
	    catch (e) {
		rej(e);
	    }
	});
	return stepped;
    }

    stepCooldown() {
	var that = this;
	var cd = new Promise((res, rej) => {
	    try {
		var targetDOM = $(that.targetID).contents();
		var stepButton = targetDOM.find(bot_travel_button_id);
		var delay = parseInt(stepButton.text());
		delay = delay * 1000 + 150;
		that.setDelay(delay);
		// Set a timeout for next step
		setTimeout(function() {
		    that.setDelay(0);
		}, that.rnd.randDelay(delay));
		res(true);
	    }
	    catch (e) {
		rej(e);
	    }
	});
	return cd;
    }

    stepCombat() {
	var that = this;
	var combat = new Promise((res, rej) => {
	    try {
		// Check if we can combat
		if (that.travelCombat && that.combat.canCombat()) {
		    // Is there a mob to kill
		    var targetDOM = $(that.targetID).contents();
		    var attackButton = targetDOM.find(bot_travel_attack_id);
		    if (attackButton.length >= 1) {
			setTimeout(function() {
			    that.combat.travelCombat();
			}, that.rnd.randDelay(bot_travel_delay));
			res(true);
		    }
		    else
			res(false);
		}
		else
		    res(false);
	    }
	    catch (e) {
		rej(e);
	    }
	});
	return combat;
    }

    stepSlowMode() {
	var that = this;
	var slow = new Promise((res, rej) => {
	    // Return to home for slow mode
	    if (this.stepDelay >= bot_travel_home_delay) {
		// Do it only 25% of the time
		var dice = Math.floor(Math.random() * 100);
		console.log("Slow mode dice", dice);
		if (dice <= 25)
		    that.rnd.randNav();
		res(true);
	    }
	    else {
		res(false);
	    }
	});
    }

    stepAction() {
	console.log("Called stepAction()");
	if (this.stepDelay != 1)
	    return;
	var that = this;
	that.doStep()
	    .then(function(success) {
		return that.stepCooldown();
	    })
	    .then(function(success) {
		return that.stepCombat();
	    })
	    .then(function(incombat) {
		if (incombat == true)
		    return Promise.resolve(true);
		else
		    return that.sell.travelSell();
	    })
	    .then(function(soldItem) {
		if (soldItem)
		    return Promise.resolve(true);
		else
		    return that.stepSlowMode();
	    })
	    .catch(function(e) {
		console.log("stepAction failed: ", e);
		that.setDelay(0);
	    });
    }

    travel() {
	var that = this;
	if (this.stepDelay == 0)
	{
	    console.log("Called travel()");
	    this.setDelay(1);
	    var target_url = $(this.targetID).prop('src');
	    if (target_url != bot_travel_url) {
		$(this.targetID).prop("src", bot_travel_url);
		setTimeout(function() {
		    that.stepAction();
		}, that.rnd.randDelay(bot_travel_delay));
	    }
	    else {
		this.stepAction();
	    }
	}
    }

}
