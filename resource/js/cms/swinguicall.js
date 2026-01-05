
var SWU_prodid = "";
var SWU_userid = "";
var SWU_loginid = "";
var SWU_coClCd = "";
var SWU_sslFlag = "";
var SWU_strFun = "";
var SWU_hurl = "";
var SWU_svcLoc = "";
//var swingHost = "http://tst.sktelecom.com:8601";
//swingHost = "http://172.31.117.23:8060"; 

function callPlmProd (shosturl,prodId,userid,loginid,coClCd,svcLoc,sslFlag) {
	
	SWU_prodid = prodId;
	SWU_userid = userid;
	SWU_loginid = loginid;
	SWU_coClCd = coClCd;
	SWU_hurl = shosturl;
	SWU_svcLoc = svcLoc;
	var strArgs = 'prod_id="' + SWU_prodid + '"';
	//SWU_loginid = "1000073830";
	//SWU_coClCd = "T";
	var protoStr = ""; // TODO Select ( http / https ) 
	SWU_hurl = protoStr + SWU_hurl;
	SWU_sslFlag = sslFlag;

	//executeSDIWBrowser2(SWU_hurl,"W", "21", SWU_loginid, SWU_userid, SWU_sslFlag, SWU_coClCd, SWU_svcLoc,strArgs ,SWU_strFun);
	executeSDIWBrowser2(SWU_hurl,"W", "I00018", SWU_loginid, SWU_userid, SWU_sslFlag, SWU_coClCd, SWU_svcLoc,strArgs ,SWU_strFun);

}

function executeSDIWBrowser (swingHost, openType, sdiCode, userId, ukeyUserId, sslFg, coClCd, smPcheckId, partnerStat, partnerFg, prosPtnId, svcMgmtNum) {
  
	var swingUrl = ngmf.ext.getSwingSdiUrl(swingHost, openType, sdiCode, userId, ukeyUserId, sslFg, coClCd, smPcheckId, partnerStat, partnerFg, prosPtnId, svcMgmtNum); 

	ngmf.ext.executeWBrowser(swingUrl, "S")
	.then(function(bresult){ 
		if (!bresult) alert("대상 시스템이 존재하지 않거나 이미 호출되어 있습니다.\n["+swingUrl+"]");
		else  console.debug("executeWBrowser  RESULT==="  + bresult);
	});
}

function executeSDIWBrowser2 (swingHost, openType, sdiCode, userId, ukeyUserId, sslFg, coClCd ,svrLocation ,strArgs ,strFunction ) {
  
	var swingUrl = ngmf.ext.getSwingSdiUrl(swingHost, openType, sdiCode, userId, ukeyUserId, sslFg, coClCd, "", "", "", "", "", svrLocation, strArgs, strFunction);
	
	ngmf.ext.executeWBrowser(swingUrl, "S")
	.then(function(bresult){ 
		if (!bresult) alert("대상 시스템이 존재하지 않거나 이미 호출되어 있습니다.\n["+swingUrl+"]");
		else  console.debug("executeWBrowser  RESULT==="  + bresult);
	});
}


