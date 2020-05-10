var bot_home_url = "https://web.simple-mmo.com/"

var bot_user_current_health_id = "#current_health"
var bot_user_max_health_id = "#max_health"
var bot_user_current_xp_id = "#current_exp"
var bot_user_max_xp_id = "#max_exp"
var bot_user_current_energy_id = "#current_energy"
var bot_user_max_energy_id = "#max_energy"
var bot_user_current_gold_id = "#current_gold"
var bot_user_current_steps_id = "#current_steps"
var bot_user_current_quests_id = "#current_quest_points"

var bot_char_url = "https://web.simple-mmo.com/character"
var bot_char_points_id = "#available_points"
var bot_char_assign_id = "a:contains('Increase')"
var bot_char_assign_nb_id = "input[type='number']"
var bot_char_assign_confirm_id = "button:contains('Add stat points')"
var bot_char_delay = 855;

class BotUser {
    constructor(targetID) {
	this.targetID = targetID;
	this.current_health = -1;
	this.max_health = -1;
	this.percent_health = -1.0;
	this.current_xp = 0;
	this.max_xp = -1;
	this.level_up = false;
	this.current_energy = -1;
	this.max_energy = -1;
	this.gold = -1;
	this.steps = -1;
	this.quests = -1;

	// Char points
	this.pointsIndex = 0;
	this.assignPoint = false;
	this.points = 0;
    }

    updateFromID(id_selector) {
	var targetDOM = $(this.targetID).contents()
	var c_div = targetDOM.find(id_selector)
	var c_txt = c_div.text();
	c_txt = c_txt.replace(',', '');
	return parseInt(c_txt);
    }
    
    update() {
	this.current_health = this.updateFromID(bot_user_current_health_id);
	this.max_health = this.updateFromID(bot_user_max_health_id);
	this.percent_health = (this.current_health / this.max_health) * 100.0;
	var last_xp = this.current_xp;
	this.current_xp = this.updateFromID(bot_user_current_xp_id);
	if (last_xp > this.current_xp)
	    this.level_up = true;
	this.max_xp = this.updateFromID(bot_user_max_xp_id);
	this.current_energy = this.updateFromID(bot_user_current_energy_id);
	this.max_energy = this.updateFromID(bot_user_max_energy_id);
	this.gold = this.updateFromID(bot_user_current_gold_id);
	this.steps = this.updateFromID(bot_user_current_steps_id)
	this.quests = this.updateFromID(bot_user_current_quests_id)
    }

    updateCharPoints() {
	var that = this;
	var updated=  new Promise((res, rej) => {
	    that.points = that.updateFromID(bot_char_points_id);
	    if (that.points > 0) {
		res(true);
	    }
	    else
		rej(false);
	});
	return updated;
    }

    selectCharPoints() {
	var that = this;
	var selected = new Promise((res, rej) => {
	    try {
		var targetDOM = $(that.targetID).contents();
		var assignBts = targetDOM.find(bot_char_assign_id);
		setTimeout(function() {
		    assignBts[that.pointsIndex].click();
		    res(true);
		}, bot_char_delay);
	    }
	    catch (e) {
		rej(false);
	    }
	});
	return selected;
    }

    setNumPoints() {
	var that = this;
	var setnum = new Promise((res, rej) => {
	    var targetDOM = $(that.targetID).contents();
	    var setInput = targetDOM.find(bot_char_assign_nb_id);
	    try {
		setInput.val(that.points);
		setTimeout(function() {
		    res(true);
		}, bot_char_delay);
	    }
	    catch {
		rej(false);
	    }
	});
	return setnum;
    }

    confirmPoints() {
	var that = this;
	var confirm = new Promise((res, rej) => {
	    var targetDOM = $(that.targetID).contents();
	    console.log(targetDOM);
	    var confirmBt = targetDOM.find(bot_char_assign_confirm_id);
	    console.log(confirmBt);
	    try {
		confirmBt[0].click();
		setTimeout(function() {
		    res(true);
		}, bot_char_delay);
	    }
	    catch {
		rej(false);
	    }
	});
	return confirm;
    }

    triggerAssignPoints() {
	var that = this;
	that.updateCharPoints()
	    .then(function(s) {
		return that.selectCharPoints();
	    })
	    .then(function(s) {
		return that.setNumPoints();
	    })
	    .then(function(s) {
		return that.confirmPoints();
	    })
	    .catch(function(s) {
		console.log("Assign points failed");
	    })
	    .finally(function() {
		that.points = 0;
		that.level_up = false;
		that.assignPoint = false;
		// Navigate to home
		$(that.targetID).prop('src', bot_home_url);
	    });
    }

    charPoints() {
	var that = this;
	that.assignPoint = true;
	// Handle char loaded
	$(this.targetID).bind("load", function() {
	    $(that.targetID).unbind();
	    that.triggerAssignPoints();
	});
	// Navigate to char
	$(this.targetID).prop('src', bot_char_url);
    }

    print() {
	console.log(`Health ${this.current_health}/${this.max_health}`);
	console.log(`Experience ${this.current_xp}/${this.max_xp}`);
	console.log(`Energy ${this.current_energy}/${this.max_energy}`);
	console.log(`Gold ${this.gold}`);
	console.log(`Quest ${this.quests}`);
	console.log(`Steps ${this.steps}`);
    }
}
