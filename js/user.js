var bot_user_current_health_id = "#current_health"
var bot_user_max_health_id = "#max_health"
var bot_user_current_xp_id = "#current_exp"
var bot_user_max_xp_id = "#max_exp"
var bot_user_current_energy_id = "#current_energy"
var bot_user_max_energy_id = "#max_energy"
var bot_user_current_gold_id = "#current_gold"
var bot_user_current_steps_id = "#current_steps"
var bot_user_current_quests_id = "#current_quest_points"

class BotUser {
    constructor(targetID) {
	this.targetID = targetID;
	this.current_health = -1;
	this.max_health = -1;
	this.current_xp = -1;
	this.ratio_health = -1.0;
	this.max_xp = -1;
	this.current_energy = -1;
	this.max_energy = -1;
	this.gold = -1;
	this.steps = -1;
	this.quests = -1;
    }

    updateFromID(id_selector) {
	var targetDOM = $(this.targetID).contents()
	var c_div = targetDOM.find(id_selector)
	var c_txt = c_div.text();
	return parseInt(c_txt);
    }
    
    update() {
	this.current_health = this.updateFromID(bot_user_current_health_id);
	this.max_health = this.updateFromID(bot_user_max_health_id);
	this.percent_health = (this.current_health / this.max_health) * 100.0;
	this.current_xp = this.updateFromID(bot_user_current_xp_id);
	this.max_xp = this.updateFromID(bot_user_max_xp_id);
	this.current_energy = this.updateFromID(bot_user_current_energy_id);
	this.max_energy = this.updateFromID(bot_user_max_energy_id);
	this.gold = this.updateFromID(bot_user_current_gold_id);
	this.steps = this.updateFromID(bot_user_current_steps_id)
	this.quests = this.updateFromID(bot_user_current_quests_id)
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
