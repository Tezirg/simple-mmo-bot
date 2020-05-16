var bot_target_id = "#bot-target";
var bot_status_id = "#bot-status";

var bot_randomize_delay = "#randomize-delay"
var bot_randomize_refresh = "#randomize-refresh"

var bot_auto_travel_id = "#auto-travel";
var bot_auto_travel_combat_id = "#auto-travel-combat";

var bot_auto_quest_id = "#auto-quest";
var bot_auto_quest_index_id = "#quest-id";

var bot_auto_job_id = "#auto-job";
var bot_auto_job_num_min_id = "#job-min-num";
var bot_auto_job_num_max_id = "#job-max-num";

var bot_auto_battle_arena_id = "#auto-battle-arena";
var bot_auto_combat_health_id = "#auto-combat-health";
var bot_auto_combat_use_id = "#auto-combat-use";

var bot_auto_bank_id = "#auto-bank";
var bot_auto_bank_keep_id = "#keep-amount";
var bot_auto_bank_deposit_id = "#deposit-amount";
var bot_auto_bank_withdraw_id = "#withdraw-amount";

var bot_auto_points_id = "#auto-points";
var bot_auto_points_index_id = "#points-index";

var bot_auto_sell_id = "#auto-sell";
var bot_auto_sell_filter_quality_id = "#filter-sell-quality"
var bot_auto_sell_quality_id = "#sell-quality option:selected"
var bot_auto_sell_filter_level_id = "#filter-sell-level"
var bot_auto_sell_level_id = "#sell-level"
var bot_auto_sell_filter_type_id = "#filter-sell-type"
var bot_auto_sell_type_id = "#sell-type option:selected"

var bot_run_bt_id = "#bot-run";
var bot_stop_bt_id = "#bot-stop";
var bot_refresh_freq = 1874;

class SimpleMMOBot {
    constructor(targetID, statusID) {
	this.targetID = targetID;
	this.statusID = statusID;
	// Randomize
	this.randomizeDelay = true;
	this.randomizeRefresh = true;
	this.random = new BotRandomize(this.targetID);	
	// Character
	this.user = new BotUser(this.targetID, this.random);
	this.userInterval = null;
	this.autoPoints = false;
	// Quests
	this.autoQuest = false;
	this.autoQuestID = -1;
	this.quest = new BotQuest(this.targetID, this.user, this.random);
	// Jobs
	this.autoJob = false;
	this.job = new BotJob(this.targetID, this.random);
	//Sell
	this.autoSell = false;
	this.sell = new BotSell(this.targetID, this.random);
	// Combat
	this.autoBattleArena = false;
	this.combat = new BotCombat(this.targetID, this.user,
				    this.random, this.sell);
	// Banking
	this.autoBank = false;
	this.bank = new BotBank(this.targetID, this.user, this.random);
	// Travel
	this.autoTravel = false;
	this.travel = new BotTravel(this.targetID, this.user, this.combat,
				    this.random, this.sell);
    }

    isBusy() {
	if (this.random.inBreak)
	    return true;
	if (!this.job.canJob())
	    return true;
	if (this.combat.isInCombat())
	    return true;
	if (this.bank.isBanking)
	    return true;
	if (this.user.assignPoint)
	    return true;
	if (this.quest.isInQuest())
	    return true;
	if (this.sell.isSelling)
	    return true;
	return false;
    }

    botTick() {
	var that = this;
	that.user.update();

	if (!that.isBusy())
	{
	    if (that.autoPoints && that.user.level_up) {
		that.user.charPoints();
	    }
	    else if (that.autoBank && that.bank.canBank()) {
		that.bank.bank();
	    }
	    else if (that.autoQuest && that.quest.canQuest()) {
		that.quest.quest(that.autoQuestID);
	    }
	    else if (that.autoBattleArena &&
		     that.combat.canArenaCombat()) {
		that.combat.arenaCombat();
	    }
	    else if (that.autoTravel && that.travel.canStep()) {
		that.travel.travel();
	    }
	    else if (that.autoJob) {
		if (that.autoTravel && that.user.steps <= 0)
		    that.job.job();
		else if (that.autoTravel == false)
		    that.job.job();
	    }
	}
    }
    
    start() {
	var that = this

	// Get config
	this.randomizeDelay = $(bot_randomize_delay).is(":checked");
	this.randomizeRefresh = $(bot_randomize_refresh).is(":checked");
	this.random.delays = this.randomizeDelay;
	this.random.refresh = this.randomizeRefresh;
	
	var autoTravelCombat = $(bot_auto_travel_combat_id).is(":checked");
	this.autoTravel = $(bot_auto_travel_id).is(":checked");
	this.travel.setTravelCombat(autoTravelCombat);
	
	this.autoQuest = $(bot_auto_quest_id).is(":checked");
	this.autoQuestID = $(bot_auto_quest_index_id).prop('selectedIndex');
	this.autoQuestID = parseInt(this.autoQuestID);
	
	this.autoJob = $(bot_auto_job_id).is(":checked");
	var jobNumberMin = parseInt($(bot_auto_job_num_min_id).val());
	var jobNumberMax = parseInt($(bot_auto_job_num_max_id).val());
	this.job.setNumberMin(jobNumberMin);
	this.job.setNumberMax(jobNumberMax);
	
	this.autoBattleArena = $(bot_auto_battle_arena_id).is(":checked");
	var autoCombatHealth = parseInt($(bot_auto_combat_health_id).val());
	var autoCombatUse = parseInt($(bot_auto_combat_use_id).val());
	this.combat.setMinHealth(autoCombatHealth);
	this.combat.setUseItemHealth(autoCombatUse);
	
	this.autoBank = $(bot_auto_bank_id).is(":checked");
	var bankKeep = parseInt($(bot_auto_bank_keep_id).val());
	var bankDeposit = parseInt($(bot_auto_bank_deposit_id).val());
	var bankWithdraw = parseInt($(bot_auto_bank_withdraw_id).val());
	this.bank.setKeepAmount(bankKeep);
	this.bank.setDepositAmount(bankDeposit);
	this.bank.setWithdrawAmount(bankWithdraw);

	this.autoPoints = $(bot_auto_points_id).is(":checked");
	var pointIdx = $(bot_auto_points_index_id).prop('selectedIndex');
	pointIdx = parseInt(pointIdx);
	this.user.pointsIndex = pointIdx;

	this.autoSell = $(bot_auto_sell_id).is(":checked");
	this.sell.canAutoSell = this.autoSell;
	var sellFiltQual = $(bot_auto_sell_filter_quality_id).is(":checked");
	var sellQual = parseInt($(bot_auto_sell_quality_id).val());
	console.log("Selling items worst than: ", sellFiltQual, sellQual);
	this.sell.filterItemQuality = sellFiltQual;
	this.sell.itemQualityIndex = sellQual;
	var sellFiltLevel = $(bot_auto_sell_filter_level_id).is(":checked");
	var sellLevel = parseInt($(bot_auto_sell_level_id).val());
	console.log("Selling items under lvl: ", sellLevel);
	this.sell.filterItemLevel = sellFiltLevel;
	this.sell.itemLevel = sellLevel;
	var sellFiltType = $(bot_auto_sell_filter_type_id).is(":checked");
	var sellType = [];
	$.each($(bot_auto_sell_type_id), function() {
	    sellType.push($(this).val());
	});
	this.sell.filterItemTypes = sellFiltType;
	this.sell.itemTypes = sellType;
	console.log("Selling items of type:", sellFiltType, sellType);

	// Update src property
	var current_url = $(this.targetID).contents().get(0).location.href;
	$(this.targetID).prop("src", current_url);

	$(this.statusID).text("Running");
	// Continuously update user values
	var intervalFn = function() {
	    that.botTick();
	    clearInterval(that.userInterval);
	    var refresh_delay = that.random.randRefresh(bot_refresh_freq)
	    that.userInterval = setInterval(intervalFn, refresh_delay);
	};
	this.userInterval = setInterval(intervalFn, 50);
    }

    stop() {
	$(this.statusID).text("Stopped");
	clearInterval(this.userInterval);

	// Cancel timers
	var highestTimeoutId = setTimeout(";");
	for (var i = 0 ; i < highestTimeoutId ; i++) {
	    clearTimeout(i); 
	}

	// Reset states
	this.random.inBreak = false;
	this.bank.isBanking = false;
	this.user.assignPoint = false;
	this.quest.questDelay = 0;
	this.combat.inCombat = false;
	this.job.jobDelay = 0;
	this.travel.stepDelay = 0;
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
