var bot_home_url = "https://web.simple-mmo.com/"
var bot_combat_arena_url = "https://web.simple-mmo.com/battlearena"
var bot_combat_arena_generate_id = "button:contains('Generate enemy')"
var bot_combat_arena_generate2_id = "button:contains('Yes, generate a enemy')"
var bot_combat_arena_attack_id = "button:contains('Attack')"
var bot_combat_travel_attack_id = "a:contains(' Attack')"

var bot_combat_use_id = "#useItem"
var bot_combat_attack_bt_id = "#attackButton"
var bot_combat_used_id = "h2:contains('Success!')"
var bot_combat_ended_id = "h2:contains('Woohoo! You defeated the enemy!')"
var bot_combat_ended2_id = "h2:contains('The enemy cannot be attacked')"
var bot_combat_done_id = "button:contains('OK')"
var bot_combat_delay = 816

class BotCombat {
    constructor(targetID, user, random, sell) {
	this.targetID = targetID;
	this.user = user;
	this.rnd = random;
	this.sell = sell;
	this.minHealth = 0.0;
	this.useItemHealth = 0.0;
	this.inCombat = false;
    }

    setMinHealth(hp_percent) {
	this.minHealth = hp_percent;
    }

    setUseItemHealth(hp_percent) {
	this.useItemHealth = hp_percent;
    };
    
    isInCombat() {
	if (this.inCombat)
	    return true;
	else
	    return false;
    }

    canCombat() {
	if (this.inCombat)
	    return false;
	if (this.user.percent_health < this.minHealth)
	    return false;
	return true;
    }

    canArenaCombat() {
	if (!this.canCombat())
	    return false;
	if (this.user.current_energy < 1)
	    return false;
	return true;
    }

    combat() {
	var that = this;
	var combat_over = function() {
	    var targetDOM = $(that.targetID).contents();
	    var doneElem = targetDOM.find(bot_combat_ended_id);
	    if (doneElem.length >= 1)
		return true;
	    var doneElem2 = targetDOM.find(bot_combat_ended2_id);
	    if (doneElem2.length >= 1)
		return true;
	    else
		return false;
	}
	var combat_useItem = function() {
	    let usePromise = new Promise((res, rej) => {
		if (that.user.percent_health >= that.useItemHealth)
		    res(false);
		else {
		    // Use item
		    var targetDOM = $(that.targetID).contents();
		    var usebt = targetDOM.find(bot_combat_use_id);
		    try { usebt[0].click(); } catch {}
		    setTimeout(function() {
			targetDOM = $(that.targetID).contents();
			var usedItem = targetDOM.find(bot_combat_used_id);
			if (usedItem.length >= 1)
			    res(true);
			else
			    res(false);
		    }, that.rnd.randDelay(bot_combat_delay));
		}
	    });
	    return usePromise;
	};
	var combat_done = function() {
	    that.sell.combatSell()
		.then(function(sold) {
		    var targetDOM = $(that.targetID).contents();
		    var donebt = targetDOM.find(bot_combat_done_id);
		    try { donebt[0].click(); } catch {}

		    setTimeout(function() {
			that.rnd.randNav();
			that.inCombat = false;
		    }, that.rnd.randDelay(bot_combat_delay));
		})
		.catch(function(error) {
		    that.inCombat = false;
		});
	};
	var combat_tick = function() {
	    combat_useItem().then((usedItem) => {
		if (usedItem) {
		    // Use multiple items
		    setTimeout(function() {
			combat_tick();
		    }, that.rnd.randDelay(bot_combat_delay));
		}
		else {
		    setTimeout(function() {
			var targetDOM = $(that.targetID).contents();
			var attackbt = targetDOM.find(bot_combat_attack_bt_id);
			try {
			    attackbt[0].click();
			    setTimeout(function() {
				if (combat_over())
				    combat_done();
				else
				    combat_tick();
			    }, that.rnd.randDelay(bot_combat_delay));
			} catch {
			    that.inCombat = false;
			}
		    }, that.rnd.randDelay(bot_combat_delay));
		}
	    });
	};
	combat_tick();
    }
    
    travelCombat() {
	var that = this;
	if (!this.canCombat())
	    return;
	this.inCombat = true;
	var targetDOM = $(that.targetID).contents();
	var attackbt = targetDOM.find(bot_combat_travel_attack_id);
	try { attackbt[0].click(); } catch {}
	setTimeout(function() {
	    that.combat();
	}, that.rnd.randDelay(bot_combat_delay));
    }

    arenaTrigger() {
	var that = this;
	var targetDOM = $(that.targetID).contents();
	var genbt = targetDOM.find(bot_combat_arena_generate_id);
	try {
	    genbt[0].click();
	} catch {
	    that.inCombat = false;
	    that.rnd.randNav();
	}
	setTimeout(function() {
	    targetDOM = $(that.targetID).contents();
	    genbt = targetDOM.find(bot_combat_arena_generate2_id);
	    try {
		genbt[0].click();
	    } catch {
		that.inCombat = false;
		that.rnd.randNav();
	    }
	    setTimeout(function() {
		targetDOM = $(that.targetID).contents();
		var attackbt = targetDOM.find(bot_combat_arena_attack_id);
		try {
		    attackbt[0].click();
		    setTimeout(function() {
			that.combat();
		    }, that.rnd.randDelay(bot_combat_delay));
		} catch {
		    that.inCombat = false;
		    that.rnd.randNav();
		}
	    }, that.rnd.randDelay(bot_combat_delay + bot_combat_delay / 2));
	}, that.rnd.randDelay(bot_combat_delay));
	
    }

    arenaCombat() {
	if (!this.canArenaCombat())
	    return;
	this.inCombat = true;
	// Handle arena page
	var target_url = $(this.targetID).prop('src');
        if (target_url != bot_combat_arena_url) {
            var that = this;
            $(this.targetID).bind("load", function() {
                $(that.targetID).unbind();
                setTimeout(function() {
		    that.arenaTrigger();
                }, that.rnd.randDelay(bot_combat_delay));
            });
	    // Go to arena page
            $(this.targetID).prop("src", bot_combat_arena_url);
	}
	else {
	    this.arenaTrigger();
	}
    }
}
