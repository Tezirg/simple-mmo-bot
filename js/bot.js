var bot_target_id = "#bot-target";
var bot_status_id = "#bot-status";
var bot_auto_travel_id = "#auto-travel";
var bot_auto_quest_id = "#auto-quest";
var bot_auto_quest_index_id = "#quest-id";
var bot_auto_job_id = "#auto-job";
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
	// Travel
	this.autoTravel = false;
	this.travel = new BotTravel(this.targetID, this.user);
	// Quests
	this.autoQuest = false;
	this.autoQuestID = -1;
	this.quest = new BotQuest(this.targetID, this.user);
	// Jobs
	this.autoJob = false;
	this.job = new BotJob(this.targetID);	
    }
    
    start() {
	var that = this
	
	// Get config
	this.autoTravel = $(bot_auto_travel_id).is(":checked");
	this.autoQuest = $(bot_auto_quest_id).is(":checked");
	this.autoQuestID = parseInt($(bot_auto_quest_index_id).val());
	this.autoJob = $(bot_auto_job_id).is(":checked");
	
	$(this.statusID).text("Running");
	// Continuously update user values
	this.userInterval = setInterval(function() {
	    that.user.update();

	    if (that.job.canJob())
	    {
		if (that.autoQuest && that.quest.canQuest()) {
		    that.quest.quest(that.autoQuestID);
		}
		else if (that.autoTravel && that.travel.canStep()) {
		    that.travel.travel();
		}
		else if (that.autoJob && that.user.steps <= 0)
		{
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
