var bot_home_url = "https://web.simple-mmo.com/"
var bot_rnd_urls = [
    "https://www.leparisien.fr/",
    "https://www.sudouest.fr/",
    "https://www.nicematin.com/",
    "https://en.wikipedia.org/wiki/Special:Random",
    "https://allocine.fr",
    "https://www.programme-tv.net/",
    "https://www.sncf.com/fr",
    "https://www.mediapart.fr/",
    "https://www.pcmag.com/"
];
var bot_rnd_delay_max = 850;
var bot_rnd_delay_min = 150;
var bot_rnd_refresh_max = 680;
var bot_rnd_refresh_min = 45;
var bot_rnd_break_min = 2*60*1000;
var bot_rnd_break_max = 7*60*1000;

class BotRandomize {
    constructor(target) {
	this.targetID = target;
	this.delays = true;
	this.refresh = true;
	this.inBreak = false;
    }

    randBreak(baseBreak) {
	var that = this;
	var rnd = Math.floor(Math.random() * bot_rnd_break_max);
	rnd += bot_rnd_break_min;
	rnd += baseBreak;
	rnd = Math.floor(rnd);
	that.inBreak = true;
	// Leave game while in break
	var randIdx = Math.floor(Math.random() * bot_rnd_urls.length);
	$(that.targetID).prop("src", bot_rnd_urls[randIdx]);
	// After break
	setTimeout(function() {
	    // Redirect to home
	    $(that.targetID).prop("src", bot_home_url);
	    setTimeout(function() {
		that.inBreak = false;
	    }, that.randDelay(bot_rnd_delay_min));
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
