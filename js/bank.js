var bot_home_url = "https://web.simple-mmo.com/"
var bot_bank_url = "https://web.simple-mmo.com/bank/deposit"

var bot_bank_amount_id = "input[name='GoldAmount']"
var bot_bank_confirm_id = "button:contains('Deposit')"

var bot_bank_delay = 825

class BotBank {
    constructor(targetID, user, random) {
	this.targetID = targetID;
	this.user = user;
	this.rnd = random;
	this.keepAmount = 0.0;
	this.depositAmount = 0.0;
	this.isBanking = false;
    }

    setKeepAmount(a) {
	this.keepAmount = a;
    }

    setDepositAmount(a) {
	this.depositAmount = a;
    };
    
    canBank() {
	if (this.isBanking)
	    return false;
	else if (this.keepAmount > this.user.gold)
	    return false;
	else if ((this.keepAmount + this.depositAmount) > this.user.gold)
	    return false;
	else 
	    return true;
    }    

    bankTrigger() {
	var that = this;
	this.isBanking = true;
	var targetDOM = $(that.targetID).contents();
	var amountInput = targetDOM.find(bot_bank_amount_id);
	amountInput.val(this.depositAmount.toString());
	var depositBt = targetDOM.find(bot_bank_confirm_id);
	try { depositBt[0].click(); } catch {}
	setTimeout(function() {
	    that.rnd.randNav();
	    that.isBanking = false;
	}, that.rnd.randDelay(bot_bank_delay));	
    }

    bank() {
	if (!this.canBank())
	    return;
	this.isBanking = true;
	// Handle bank page
	var target_url = $(this.targetID).prop('src');
        if (target_url != bot_bank_url) {
            var that = this;
            $(this.targetID).bind("load", function() {
                $(that.targetID).unbind();
                setTimeout(function() {
		    that.bankTrigger();
                }, that.rnd.randDelay(bot_bank_delay));
            });
	    // Go to bank page
            $(this.targetID).prop("src", bot_bank_url);
	}
	else {
            setTimeout(function() {
		that.bankTrigger();
            }, that.rnd.randDelay(bot_bank_delay));
	}
    }
}
