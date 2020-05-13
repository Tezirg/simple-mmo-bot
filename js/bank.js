var bot_home_url = "https://web.simple-mmo.com/"
var bot_bank_url = "https://web.simple-mmo.com/bank"

var bot_bank_deposit_id = "a[href$='deposit']"
var bot_bank_withdraw_id = "a[href$='withdraw']"
var bot_bank_amount_id = "input[name='GoldAmount']"
var bot_bank_confirm_deposit_id = "button:contains('Deposit')"
var bot_bank_confirm_withdraw_id = "button:contains('Withdraw')"

var bot_bank_delay = 742

class BotBank {
    constructor(targetID, user, random) {
	this.targetID = targetID;
	this.user = user;
	this.rnd = random;
	this.keepAmount = 0;
	this.depositAmount = 0;
	this.withdrawAmount = 0;
	this.isBanking = false;
    }

    setKeepAmount(a) {
	this.keepAmount = a;
    }

    setDepositAmount(a) {
	this.depositAmount = a;
    };

    setWithdrawAmount(a) {
	this.withdrawAmount = a;
    }
    
    canBank() {
	// Already banking
	if (this.isBanking)
	    return false;
	// Should deposit
	if ((this.keepAmount + this.depositAmount) < this.user.gold)
	    return true;
	// Should withdraw
	if (this.user.gold < this.keepAmount)
	    return true;
	return false;
    }    

    bankAmount(amount) {
	var that = this;
	var amounted = new Promise((res, rej) => {
	    setTimeout(function() {
		try {
		    var targetDOM = $(that.targetID).contents();
		    var amountInput = targetDOM.find(bot_bank_amount_id);
		    amountInput.val(amount.toString());
		    res(true);
		}
		catch (e) {
		    rej(e);
		}
	    }, that.rnd.randDelay(bot_bank_delay));	    
	});
	return amounted;
    }

    bankConfirm(confirm_id) {
	var that = this;
	return new Promise((res, rej) => {
	    setTimeout(function() {
		try {
		    var targetDOM = $(that.targetID).contents();
		    var confirmBt = targetDOM.find(confirm_id);
		    confirmBt[0].click();
		    res(true);
		} catch (e) {
		    rej(e);
		}
	    }, that.rnd.randDelay(bot_bank_delay));	    
	});
    }
    
    bankDeposit() {
	var that = this;
	return new Promise((res, rej) => {
	    setTimeout(function() {
		try {
		    var targetDOM = $(that.targetID).contents();
		    var depositBt = targetDOM.find(bot_bank_deposit_id);
		    depositBt[0].click();
		    res(true)
		} catch (e) {
		    rej(e);
		}
	    }, that.rnd.randDelay(bot_bank_delay));	    
	});
	return deposit;
    }

    bankWithdraw() {
	var that = this;
	var withdraw = new Promise((res, rej) => {
	    setTimeout(function() {
		try {
		    var targetDOM = $(that.targetID).contents();
		    var withdrawBt = targetDOM.find(bot_bank_withdraw_id);
		    withdrawBt[0].click();
		    res(true);
		} catch (e) {
		    rej(e);
		}
	    }, that.rnd.randDelay(bot_bank_delay));	    
	});
	return withdraw;
    }

    bankTrigger() {
	var that = this;
	this.isBanking = true;
	var amount = 1;
	var confirm_id = "";
	var bankAction = null;
	// Should withdraw
	if (this.user.gold < this.keepAmount) {
	    amount = this.withdrawAmount;
	    confirm_id = bot_bank_confirm_withdraw_id;
	    bankAction = this.bankWithdraw();
	}
	// Should deposit
	if (this.keepAmount + this.depositAmount < this.user.gold) {
	    amount = this.depositAmount;
	    confirm_id = bot_bank_confirm_deposit_id;
	    bankAction = this.bankDeposit();
	}

	bankAction
	    .then(function(success) {
		return that.bankAmount(amount);
	    })
	    .then(function(success) {
		return that.bankConfirm(confirm_id);
	    })
	    .catch(function(error) {
		console.log("Failed to bank", error,
			    confirm_id, amount,
			    that.keepAmount, that.user.gold);
	    })
	    .finally(function() {
		setTimeout(function() {
		    that.rnd.randNav();
		    that.isBanking = false;
		}, that.rnd.randDelay(bot_bank_delay));	
	    });
    }

    bank() {
	if (!this.canBank())
	    return;
	this.isBanking = true;
	var that = this;
	// Handle bank page
	var target_url = $(this.targetID).prop('src');
        if (target_url != bot_bank_url) {
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
	    that.bankTrigger();
	}
    }
}
