var bot_home_url = "https://web.simple-mmo.com/"

var bot_sell_combat_has_item_id = "div[id^='item-id']"
var bot_sell_combat_inspect_item_id = "div[id^='item-id']"
var bot_sell_travel_has_item_id = "div:contains('You have found the item')"
var bot_sell_travel_inspect_item_id = "span[id^='item-id']"
var bot_sell_item_lvl_id ="#swal2-content:contains('This item requires level')"
var bot_sell_item_lvl_txt = "This item requires level"
var bot_sell_item_quality_id = bot_sell_item_lvl_id + " span:first"
var bot_sell_item_type_id = bot_sell_item_lvl_id + " div:first"
var bot_sell_inspect_cancel_id = "div:contains('"+bot_sell_lvl_txt+"')"
var bot_sell_quick_id = "a:contains('Quick sell this item for')"
var bot_sell_confirm_id = "button:contains('Yes')"
var bot_sell_done_id = "button:contains('Close')"

var bot_sell_delay = 728

var bot_sell_qualities = [
    "Common",
    "Uncommon",
    "Rare",
    "Elite",
    "Epic",
    "Legendary",
    "Celestial",
    "Special"    
];


class BotSell {
    constructor(targetID, random) {
	this.targetID = targetID;
	this.rnd = random;
	this.canSell = false;
	this.enableFilterItemLevel = false;
	this.maxItemLevel = 1;
	this.enableFilterItemQuality = false;
	this.maxItemQuality = 0;
	this.enableFilterItemTypes = false;
	this.itemTypesFilter = [];
	this.withdrawAmount = 0;
	this.isSelling = false;
    }

    set canAutoSell(enabled) {
	this.canSell = enabled;
    }
    
    set filterItemLevel(enabled) {
	this.enableFilterItemLevel = enabled;
    }
    set itemLevel(lvl) {
	this.maxItemLevel = lvl;
    }

    set filerItemQuality(enabled) {
	this.enableFilterItemQuality = enabled;
    }
    set itemQualityIndex(q) {
	this.maxItemQuality = q;
    }

    set filterItemTypes(enabled) {
	this.enableFilterItemTypes = enabled;
    }
   
    set itemTypes(types_list) {
	this.itemTypesFilter = types_list;
    }

    hasItemToSell(bot_sell_has_item_id) {
	var that = this;
	var hasItem = new Promise((res, rej) => {
	    var targetDOM = $(that.targetID).contents();
	    var item = targetDOM.find(bot_sell_has_item_id);
	    if (item.length > 0)
		res(true);
	    else {
		rej(`No item: ${bot_sell_has_item_id}`);
	    }
	});
	return hasItem;
    }

    inspectItem(bot_sell_inspect_item_id) {
	var that = this;
	var inspected = new Promise((res, rej) => {
	    try {
		var targetDOM = $(that.targetID).contents();
		var inspectBt = targetDOM.find(bot_sell_inspect_item_id);
		inspectBt[0].click();
		setTimeout(function() {
		    res(true);
		}, that.rnd.randDelay(bot_sell_delay))
	    }
	    catch (e) {
		rej(e);
	    }
	});
	return inspected;
    }

    canSellItem() {
	var that = this;
	var canSell = new Promise((res, rej) => {
	    try {
		var targetDOM = $(that.targetID).contents();
		var div_lvl = targetDOM.find(bot_sell_item_lvl_id);
		console.log("Div lvl", div_lvl);
		var lvl_child = div_lvl.children();
		console.log("Div lvl child", lvl_child);
		var lvl_txt = div_lvl.text().replace(bot_sell_item_lvl_txt,'');
		console.log("Div lvl txt", lvl_txt);
		var lvl = parseInt(lvl_txt);
		console.log("Item level is: ", lvl);
		var lvl_ok = true;
		if (that.enableFilterItemLevel && lvl >= that.maxItemLevel)
		    lvl_ok = false;

		var div_quality = targetDOM.find(bot_sell_item_quality_id);
		console.log("Quality div", div_quality)
		var quality_txt = div_quality.text();
		console.log("Quality txt:", quality_txt);
		var quality = bot_sell_qualities.indexOf(quality_txt);
		console.log("Quality index:", quality, that.maxItemQuality);
		var quality_ok = true;
		if (that.enableFilterItemQuality &&
		    quality >= that.maxItemQuality)
		    quality_ok = false;
		
		var div_type = targetDOM.find(bot_sell_item_type_id);
		console.log("Item type div", div_type)
		var type_txt = div_type.text().split(" ");
		console.log("Item type txt array:", type_txt);
		type_txt = type_txt[type_txt.length - 1];
		console.log("Item type txt:", type_txt);
		var type = that.itemTypesFilter.indexOf(type_txt);
		console.log("Item type index:", type);
		var type_ok = true;
		if (that.enableFilterItemTypes && type == -1)
		    type_ok = false;
		
		if (lvl_ok && quality_ok && type_ok)
		    res(true);
		else {
		    var insp_div = targetDOM.find(bot_sell_inspect_cancel_id);
		    if (insp_div.length >= 1)
			insp_div[0].click();

		    var msg = "Can't sell item: ";
		    msg += `lvl ${lvl}/${that.maxItemLevel}`;
		    msg += `, quality ${quality}/${that.maxItemQuality}`;
		    msg += `, type ${type} => ${that.itemTypesFilter}`;
		    rej(msg);
		}
	    }
	    catch (e) {
		rej(e);
	    }	    
	});
	return canSell;
    }

    sellAction() {
	var that = this;
	var sold = new Promise((res, rej) => {
	    var targetDOM = $(that.targetID).contents();
	    var quickBt = targetDOM.find(bot_sell_quick_id);
	    try {
		quickBt[0].click();
		setTimeout(function() {
		    targetDOM = $(that.targetID).contents();
		    var confirmBt = targetDOM.find(bot_sell_confirm_id);
		    confirmBt[0].click();
		    setTimeout(function() {
			targetDOM = $(that.targetID).contents();
			var closeBt = targetDOM.find(bot_sell_done_id);
			closeBt[0].click();			
			res(true);
		    }, that.rnd.randDelay(bot_sell_delay));
		}, that.rnd.randDelay(bot_sell_delay));
	    }
	    catch (e) {
		rej(e);
	    }
	    
	});
	return sold;
    }

    sell(bot_sell_has_item_id, bot_sell_inspect_item_id) {
	var that = this;

	if (this.canSell == false)
	    return Promise.resolve(false);

	this.isSelling = true;
	var sold = new Promise((res, rej) => {
	    var full_sell = false;
	    
	    that.hasItemToSell(bot_sell_has_item_id)
		.then(function(success) {
		    return that.inspectItem(bot_sell_inspect_item_id);
		})
		.then(function(success) {
		    return that.canSellItem();
		})
		.then(function(success) {
		    return that.sellAction();
		})
		.then(function(sucess) {
		    full_sell = true;
		    return Promise.resolve(true);
		})
		.catch(function(error) {
		    console.log(error);
		})
		.finally(function() {
		    that.isSelling = false;
		    res(full_sell);
		});
	});
	return sold;
    }

    travelSell() {
	return this.sell(bot_sell_travel_has_item_id,
			 bot_sell_travel_inspect_item_id);
    }
    
    combatSell() {
	return this.sell(bot_sell_combat_has_item_id,
			 bot_sell_combat_inspect_item_id);
    }
}
