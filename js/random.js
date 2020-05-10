var bot_rnd_delay_max = 850;
var bot_rnd_delay_min = 150;
var bot_rnd_refresh_max = 680;
var bot_rnd_refresh_min = 45;

class BotRandomize {
    constructor() {
	this.delays = true;
	this.refresh = true;
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
