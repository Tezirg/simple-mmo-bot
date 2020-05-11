var bot_rnd_delay_max = 850;
var bot_rnd_delay_min = 150;
var bot_rnd_refresh_max = 680;
var bot_rnd_refresh_min = 45;
var bot_rnd_break_min = 2*60*1000;
var bot_rnd_break_max = 7*60*1000;

class BotRandomize {
    constructor() {
	this.delays = true;
	this.refresh = true;
	this.inBreak = false;
    }

    randBreak() {
	var that = this;
	var rnd = Math.floor(Math.random() * bot_rnd_break_max);
	rnd += bot_rnd_break_min;
	rnd = Math.floor(rnd);
	that.inBreak = true;
	setTimeout(function() {
	    that.inBreak = false;
	}, rnd);
    }

    randDelay(baseDelay) {
	if (this.delays == false)
	    return baseDelay;
	var rnd = Math.floor(Math.random() * bot_rnd_delay_max);
	rnd += bot_rnd_delay_min;
	rnd += baseDelay;
	rnd = Math.floor(rnd);
	return rnd; 
    }

    randRefresh(baseRefresh) {
	if (this.refresh == false)
	    return baseRefresh;
	var rnd = Math.floor(Math.random() * bot_rnd_refresh_max);
	rnd += bot_rnd_refresh_min;
	rnd += baseRefresh;
	rnd = Math.floor(rnd);
	return rnd; 
    }

}
