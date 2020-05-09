var bot_home_url = "https://web.simple-mmo.com/"
var bot_job_url = "https://web.simple-mmo.com/jobs/viewall"
var bot_job_select = "a:contains('Go to your job')"
var bot_job_start_id = "a:contains('Start working')"
var bot_job_start_bt_id = "button:contains('Start the job')"
var bot_job_time_id = ""
var bot_job_delay = 525
var bot_job_time = 11 * 60

class BotJob {
    constructor(targetID) {
	this.targetID = targetID;
	this.jobDelay = 0;
    }

    canJob() {
	if (this.jobDelay == 0)
	    return true;
	return false;
    }
    
    triggerJob() {
	var that = this;
	this.jobDelay = 1;
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
		    targetDOM = $(that.targetID).contents();
		    var jobButton = targetDOM.find(bot_job_start_bt_id);
		    try { jobButton[0].click(); } catch {}
		    that.jobDelay = bot_job_time + 500;
		    // Done after job time
		    setTimeout(function() {
			that.jobDelay = 0;
			// Redirect to home
			$(that.targetID).prop("src", bot_home_url);
		    }, bot_job_time * 1000);
		}, bot_quest_delay);
	    }, bot_job_delay);
	});
	$(this.targetID).prop("src", job_url);
    }
    
    job() {
	if (this.jobDelay == 0)
	{
	    var target_url = $(this.targetID).prop('src');
	    if (target_url != bot_job_url) {
		var that = this;
		$(this.targetID).bind("load", function() {
		    $(that.targetID).unbind();
		    setTimeout(function() {
			that.triggerJob();
		    }, 100);
		});
		$(this.targetID).prop("src", bot_job_url);		
	    }
	    else {
		this.triggerJob();
	    }
	}
    }

}
