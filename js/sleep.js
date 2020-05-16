class BotSleep {
    constructor(job) {
	this.job = job;
	this.startHour = 0;
	this.startMin = 0;
	this.startStamp = 0;
	this.endHour = 0;
	this.endMin = 0;
	this.endStamp = 0;
	this.sleepJobs = 1;
	this.isSleeping = false;
    }

    set startSleep(hour_min) {
	var time_split = hour_min.split(":");
	this.startHour = parseInt(time_split[0]);
	this.startMin = parseInt(time_split[1]);
	this.startStamp = this.startHour * 60 + this.startMin;
	console.log("startSleep", this.startHour,
		    this.startMin, this.startStamp);
    }

    set endSleep(hour_min) {
	var time_split = hour_min.split(":");
	this.endHour = parseInt(time_split[0]);
	this.endMin = parseInt(time_split[1]);
	this.endStamp = this.endHour * 60 + this.endMin;
	console.log("endSleep", this.endHour,
		    this.endMin, this.endStamp);
    }

    set jobSleep(n) {
	this.sleepJobs = n;
    }

    currentStamp() {
	var curr_time = new Date();
	var curr_hour = curr_time.getHours();
	var curr_min = curr_time.getMinutes();

	var curr_stamp = curr_hour * 60 + curr_min;
	return curr_stamp;
    }
    
    canSleep() {
	var curr_stamp = this.currentStamp();
	if (this.startStamp <= curr_stamp && curr_stamp < this.endStamp)
	    return true;
	else
	    return false;
    }

    sleep() {
	var that = this;
	if (this.canSleep() == false)
	    return;	
	this.isSleeping = true;
	var curr_stamp = this.currentStamp();
	var to_sleep = this.endStamp - curr_stamp;
	var to_sleep_ms = to_sleep * 60 * 1000;
	console.log("sleep_ms", to_sleep_ms);

	that.job.job(that.sleepJobs);
	setTimeout(function() {
	    that.isSleeping = false;
	}, to_sleep_ms);
    }
}
