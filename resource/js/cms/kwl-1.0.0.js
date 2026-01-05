function KWL(addr, site, use_https) {
	this.addr = addr;
	this.site = site;
	if (use_https === undefined) use_https = false;
	this.use_https = use_https;
}

KWL.prototype.writeLog = function(json_data) {
	var type = encodeURIComponent(this.site);
	var msg = JSON.stringify(json_data);
	msg = encodeURIComponent(msg);

	var params = "type="+type+"&msg="+msg;
	var req = new XMLHttpRequest();
	req.open("POST", (this.use_https?"https":"http")+"://"+this.addr+"/ksm/logflow/write?"+params, false);
	req.send();
}

KWL.prototype.logUserAction = function(userId, sessionId, itemId, actionType, rating, isRecommended) {
	if (userId === undefined) userId = "";
	if (sessionId === undefined) sessionId = "";
	if (itemId === undefined) itemId = "";
	if (actionType === undefined) actionType = "";
	if (rating === undefined) rating = "";
	if (isRecommended === undefined) isRecommended = false;

	var o = {
		site: this.site,
		user: userId,
		session: sessionId,
		item: itemId,
		action: actionType,
		rating: rating,
		is_rec: isRecommended
	};

	this.writeLog(o);
}

