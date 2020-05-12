var bot_home_url = "https://web.simple-mmo.com/"
var bot_job_url = "https://web.simple-mmo.com/jobs/viewall"
var bot_job_select = "a:contains('Go to your job')"
var bot_job_start_id = "a:contains('Start working')"
var bot_job_start_bt_id = "button:contains('Start the job')"
var bot_job_num_id = "input[type='range']"
var bot_job_time = 10 * 60 * 1000
var bot_job_time_delay = 65 * 1000
var bot_job_delay = 785

class BotJob {
    constructor(targetID, random) {
	this.targetID = targetID;
	this.rnd = random;
	this.jobDelay = 0;
	this.jobNumMin = 1;
	this.jobNumMax = 2;
    }

    setNumberMin(n) {
	this.jobNumMin = n;
    }

    setNumberMax(n) {
	this.jobNumMax = n;
    }

    canJob() {
	if (this.jobDelay == 0)
	    return true;
	else
	    return false;
    }
    
    triggerJob() {
	var that = this;
	// Find user job url
	var targetDOM = $(this.targetID).contents();
	var gotojobButton = targetDOM.find(bot_job_select);
	var job_url = gotojobButton.prop("href");
	// Navigate to user job
	$(this.targetID).bind("load", function() {
	    $(that.targetID).unbind();
	    // Open job start panel
	    setTimeout(function() {
		targetDOM = $(that.targetID).contents();
		var startButton = targetDOM.find(bot_job_start_id);
		try { startButton[0].click(); } catch {}
		// Launch job 
		setTimeout(function() {
		    // Random number of jobs in bounds
		    var rndNum = Math.floor(Math.random() * that.jobNumMax)
		    rndNum += that.jobNumMin
		    // Assign job number
		    targetDOM = $(that.targetID).contents();
		    var numJobs = targetDOM.find(bot_job_num_id);
		    numJobs.val(rndNum);
		    // Click start
		    var jobButton = targetDOM.find(bot_job_start_bt_id);
		    try { jobButton[0].click(); } catch {}
		    // Compute delay
		    var jobTime = bot_job_time  * rndNum
		    jobTime += bot_job_time_delay;
		    jobTime = that.rnd.randDelay(jobTime);
		    that.jobDelay = jobTime;
		    // Done after job time
		    setTimeout(function() {
			that.jobDelay = 0;
		    }, jobTime);
		    // Take a random break
		    that.rnd.randBreak(jobTime);
		}, that.rnd.randDelay(bot_job_delay));
	    }, that.rnd.randDelay(bot_job_delay));
	});
	$(this.targetID).prop("src", job_url);
    }
    
    job() {
	if (this.jobDelay == 0)
	{
	    this.jobDelay = 1;
	    var target_url = $(this.targetID).prop('src');
	    if (target_url != bot_job_url) {
		var that = this;
		$(this.targetID).bind("load", function() {
		    $(that.targetID).unbind();
		    setTimeout(function() {
			that.triggerJob();
		    }, that.rnd.randDelay(bot_job_delay));
		});
		$(this.targetID).prop("src", bot_job_url);		
	    }
	    else {
		this.triggerJob();
	    }
	}
    }

}
