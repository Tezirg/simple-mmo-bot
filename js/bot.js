var bot_target_id = "#bot-target";
var bot_status_id = "#bot-status";
var bot_auto_travel_id = "#auto-travel";
var bot_auto_travel_combat_id = "#auto-travel-combat";
var bot_auto_quest_id = "#auto-quest";
var bot_auto_quest_index_id = "#quest-id";
var bot_auto_job_id = "#auto-job";
var bot_auto_battle_arena_id = "#auto-battle-arena";
var bot_auto_combat_health_id = "#auto-combat-health";
var bot_auto_combat_use_id = "#auto-combat-use";
var bot_run_bt_id = "#bot-run";
var bot_stop_bt_id = "#bot-stop";
var bot_refresh_freq = 1750;

class SimpleMMOBot {
    constructor(targetID, statusID) {
	this.targetID = targetID;
	this.statusID = statusID;
	// Character
	this.user = new BotUser(this.targetID);
	this.userInterval = null;
	// Quests
	this.autoQuest = false;
	this.autoQuestID = -1;
	this.quest = new BotQuest(this.targetID, this.user);
	// Jobs
	this.autoJob = false;
	this.job = new BotJob(this.targetID);
	// Combat
	this.autoBattleArena = false;
	this.combat = new BotCombat(this.targetID, this.user);
	// Travel
	this.autoTravel = false;
	this.travel = new BotTravel(this.targetID, this.user, this.combat);
    }
    
    start() {
	var that = this
	
	// Get config
	var autoTravelCombat = $(bot_auto_travel_combat_id).is(":checked");
	this.autoTravel = $(bot_auto_travel_id).is(":checked");
	this.travel.setTravelCombat(autoTravelCombat);
	this.autoQuest = $(bot_auto_quest_id).is(":checked");
	this.autoQuestID = parseInt($(bot_auto_quest_index_id).val());
	this.autoJob = $(bot_auto_job_id).is(":checked");
	this.autoBattleArena = $(bot_auto_battle_arena_id).is(":checked");
	var autoCombatHealth = parseInt($(bot_auto_combat_health_id).val());
	var autoCombatUse = parseInt($(bot_auto_combat_use_id).val());
	this.combat.setMinHealth(autoCombatHealth);
	this.combat.setUseItemHealth(autoCombatUse);

	$(this.statusID).text("Running");
	// Continuously update user values
	this.userInterval = setInterval(function() {
	    that.user.update();

	    if (that.job.canJob() && !that.combat.isInCombat())
	    {
		if (that.autoQuest && that.quest.canQuest()) {
		    that.quest.quest(that.autoQuestID);
		}
		else if (that.autoTravel && that.travel.canStep()) {
		    that.travel.travel();
		}
		else if (that.autoBattleArena &&
			 that.combat.canArenaCombat()) {
		    that.combat.arenaCombat();
		}
		else if (that.autoJob && that.user.steps <= 0) {
		    that.job.job();
		}
	    }
	}, bot_refresh_freq);
    }

    stop() {
	$(this.statusID).text("Stopped");
	clearInterval(this.userInterval);
    }
}

function bot_main()
{
    console.log("Loaded");
    // Create bot
    bot = new SimpleMMOBot(bot_target_id, bot_status_id);
    
    // Attach start/stop handlers
    $(bot_run_bt_id).on("click", function() {
	bot.start();
    });
    $(bot_stop_bt_id).on("click", function() {
	bot.stop();
    });
}
// Start js once the iframe is loaded
$(window).on("load", function() {
    window.__cfRLUnlockHandlers = true;
    bot_main();
});
