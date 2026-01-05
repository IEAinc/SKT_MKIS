SCWBCon_MULTI_VERSION = "1.0.1.11";
SCWBCon_MULTI_INSTALLPAGE = "/common/scwsInstall.do"; //설치페이지 경로

var SCWBCon_MULTI_XHR_HOST = "http://scskls.softcamp.co.kr:63101";
var SCWBCon_MULTI_SXHR_HOST = "https://scskls.softcamp.co.kr:63111";

var bUseSSL = (document.location.href.indexOf("https") == -1) ? false : true;

var console = window.console || { log: function () { } };

var SCWBCon_MULTI_DEBUG = 0;
var SCWBCon_MULTI_USEXHR = 1;
var SCWBCon_MULTI_HTTPRequestObject = null;
var SCWBCon_MULTI_bXHRWAITING = false;
var SCWBCon_MULTI_bXHRINIT = true;
var SCWBCon_MULTI_CONNNAME;
var SCWBCon_MULTI_TimerExcute;
var SCWBCon_MULTI_SET_PAGE;
var SCWBCon_MULTI_SET_ACL;
var SCWBCon_MULTI_SET_EXTER;

function SCWBCon_MULTI_CreateRequest() {
    try {
        return new XDomainRequest();
    }
    catch (exception) {
        try {
            return new XMLHttpRequest(); // 다른 서버로 접근 불가. 동일 서버 내에서만 접근이 가능함. 애초에 설계가 그렇게 되어 있음.
        }
        catch (exception) {
            var versions = [
                "Msxml2.XMLHTTP.6.0",
                "Msxml2.XMLHTTP.5.0",
                "Msxml2.XMLHTTP.4.0",
                "Msxml2.XMLHTTP.3.0",
                "Msxml2.XMLHTTP",
                "Microsoft.XMLHttp"
            ];
            for (var i = 0; i < versions.length; i++) {
                try {
                    return new ActiveXObject(versions[i]);
                }
                catch (e) {

                }
            }
        }
    }
}

function SCWBCon_MULTI_XHRSend(data) {
    var request;

    request = SCWBCon_MULTI_CreateRequest();

    // onreadystatechange
    request.onreadystatechange = function (event) {
        if (request.readyState == 4) {
            if (request.status == 200) {
                SCWBCon_MULTI_bXHRWAITING = false;
                SCWBCon_MULTI_onXHRMessage(request.responseText);
            }
            else {
                SCWBCon_MULTI_outputtext("XHRSend Error status[" + request.status + "]");
                SCWBCon_MULTI_open_installpage();
            }
        }
        else {
            SCWBCon_MULTI_outputtext("XHRSend Error readyState[" + request.readyState + "]");
        }
    }

    if (bUseSSL) {
        request.open("GET", SCWBCon_MULTI_SXHR_HOST + "?" + data + "|" + new Date().getTime(), true);
    }
    else {
        request.open("GET", SCWBCon_MULTI_XHR_HOST + "?" + data + "|" + new Date().getTime(), true);
    }

    // send
    request.send();

    // onerror
    request.onerror = function (event) {
        request.abort();
    };

    // onload
    request.onload = function (event) {
        SCWBCon_MULTI_bXHRWAITING = false;
        SCWBCon_MULTI_onXHRMessage(request.responseText);
    };
}

function SCWBCon_MULTI_onXHRMessage(msg) {
    var str = "";
    str = msg;
    var id = str.substr(0, 1);
    var params = str.substr(1);
    var args = params.split("|");

    var arg1 = args[0];
    var arg2 = args[1];
    var arg3 = args[2];
    var arg4 = args[3];

    if (id == "4") {
        if (arg2 == "version") {
            SCWBCon_MULTI_VERSION_Check(arg3);
        }
        else if (arg2 == "control") {
            if (arg3 == "OK") {
                SCWBCon_MULTI_outputtext("Initok");
            }
            else {
            	SCWBCon_MULTI_outputtext("ERROR!!");
                SCWBCon_MULTI_open_installpage();
            }
        }
        else if (arg2 == "ALIVE") {
            SCWBCon_MULTI_outputtext("ALIVE");
        }
        else if (arg2 == "SetupCheck") {
            if (arg3 == "OK") {
                SCWBCon_MULTI_outputtext("arg3_ok = " + arg3);
                SCWBCon_MULTI_outputtext("arg3_SetupCheck = " + arg3);
            }
            else {
            	SCWBCon_MULTI_outputtext("SetUp 안됨 설치 페이지로 이동합니다");
                SCWBCon_MULTI_open_installpage();
            }

        }
        else if (arg2 == "SetPage") {
            if (arg3 == "OK") {
                SCWBCon_MULTI_outputtext(SCWBCon_MULTI_SET_PAGE);
                //location.href = "Http://" + SET_PAGE;
            }
            else {
                alert("SetPage 안됨 설치 페이지로 이동합니다");
                SCWBCon_MULTI_open_installpage();
            }

        }
        else if (arg2 == "SetUseForcePage") {
            if (arg3 == "OK") {
                SCWBCon_MULTI_outputtext("SetUseForcePage OK");
            }
            else {
                SCWBCon_MULTI_outputtext("SetUseForcePage NO");
            }
        }
        else if (arg2 == "SetForcePage") {
            if (arg3 == "OK") {
                SCWBCon_MULTI_outputtext("SetForcePage OK");
            }
            else {
                SCWBCon_MULTI_outputtext("SetForcePage NO");
            }
        }
    }
}

function SCWBCon_MULTI_VERSION_Check(veragent) {
    SCWBCon_MULTI_bXHRINIT = true;
    SCWBCon_MULTI_outputtext("SCWBConAgent VERSION_Check");
    SCWBCon_MULTI_outputtext(veragent);
    //alert("veragent = " + veragent);
    var firever = veragent;
    var verCurrent = SCWBCon_MULTI_VERSION;

    var temparr = firever.split(".");
    var temparr2 = verCurrent.split(".");
    var bReInstall = false;
	
    for (i = 0; i < 4; i++) {
        var itemp = temparr[i] * 1;
        var itemp2 = temparr2[i] * 1;

        SCWBCon_MULTI_outputtext("SCWBConAgent 모듈 버전[" + itemp + "] : [" + itemp2 + "] 파일에 기재된 버전");
        if (parseInt(itemp) < parseInt(itemp2)) {
            bReInstall = true;
            break;
        }
    }
	
    if (bReInstall == true) {
        SCWBCon_MULTI_open_installpage();

    }
    else {
        //alert("Version ok");
        SCWBCon_MULTI_outputtext("bReInstall : " + bReInstall);
    }
	
    return true;
}

function SCWBCon_MULTI_SEND(data) {
    if (SCWBCon_MULTI_USEXHR) {
        if (SCWBCon_MULTI_bXHRWAITING == false || SCWBCon_MULTI_bXHRINIT == false) {
            SCWBCon_MULTI_bXHRWAITING = true;
            SCWBCon_MULTI_XHRSend(data);
        }
        else if (SCWBCon_MULTI_bXHRWAITING == true) {
            setTimeout(function () { SCWBCon_MULTI_SEND(data) }, 1000);
        }
    }
}

function SCWBCon_MULTI_INIT(sitecode) {
    var strinit = "3";
    strinit = strinit + SCWBCon_MULTI_CONNNAME + "|";
    strinit = strinit + "control|";
    strinit = strinit + sitecode + "|";

    strinit = strinit + "|" + location.href + "|";

    SCWBCon_MULTI_SEND(strinit);
}

function SCWBCon_MULTI_CHECKSTART() {
    SCWBCon_MULTI_SEND("3" + SCWBCon_MULTI_CONNNAME + "|" + "ALIVE");
}

function SCWBCon_MULTI_CONTROL() {

    SCWBCon_MULTI_INIT("softcamp");
}

function SCWBCon_MULTI_open_installpage() {
   if(G_PROFILE == 'dev') { // 개발일때만 인스톨체크
    	SCWBCon_MULTI_outputtext("go Installpage !!!");
    	window.top.location = SCWBCon_MULTI_INSTALLPAGE;
   }	
}

function SCWebCon_SETUPCHECK() {
    SCWBCon_MULTI_SEND("3" + SCWBCon_MULTI_CONNNAME + "|" + "SetupCheck");

    return SCWBCon_MULTI_SEND();
}

function SCWebCon_SETPAGE(url, acl, extra) {
    SCWBCon_MULTI_outputtext('SetPage : ' + acl);
    SCWBCon_MULTI_SET_PAGE = url;
    SCWBCon_MULTI_SEND("3" + SCWBCon_MULTI_CONNNAME + "|" + "SetPage" + "|" + url + "|" + acl + "|" + extra);
}

function SCWebCon_GetVersion() {
    SCWBCon_MULTI_outputtext("SCWebCon_GetVersion");
    SCWBCon_MULTI_SEND('3' + SCWBCon_MULTI_CONNNAME + "|version|" + location.href);
}

function SetSCWBCon_MULTI_PAGE_SYN() {
    SCWBCon_MULTI_timerAlive = setInterval(function(){
    	SCWBCon_MULTI_CHECKSTART();
    }, 30000);
}

function SCWBCon_MULTI_Start() {
    if (SCWBCon_MULTI_USEXHR) {
        SCWBCon_MULTI_CONNNAME = new Date().getTime();
        SCWebCon_GetVersion();
		
        SetSCWBCon_MULTI_PAGE_SYN();
    }
}

function SCWBCon_MULTI_SETUSE_FORCEPAGE(_use) {
    SCWBCon_MULTI_outputtext("SetUseForcePage");
    SCWBCon_MULTI_SEND("3" + SCWBCon_MULTI_CONNNAME + "|" + "SetUseForcePage" + "|" + _use);
}

function SCWBCon_MULTI_SET_FORCEPAGE(url, acl, extra) {
    SCWBCon_MULTI_outputtext('SetForcePage');
    SCWBCon_MULTI_SET_PAGE = url;
    SCWBCon_MULTI_SEND("3" + SCWBCon_MULTI_CONNNAME + "|" + "SetForcePage" + "|" + url + "|" + acl + "|" + extra);
}

function SCWBCon_MULTI_SETIFRAME_FORCEPAGE(acl, extra) {
    SCWBCon_MULTI_outputtext('SetForcePage');
    var url = parent.document.location.href;
    SCWBCon_MULTI_SET_PAGE = url;
    SCWBCon_MULTI_SEND("3" + SCWBCon_MULTI_CONNNAME + "|" + "SetForcePage" + "|" + url + "|" + acl + "|" + extra);
}

if (navigator.platform == "Win32" || navigator.platform == "win32") {
	SCWBCon_MULTI_INSTALLPAGE = G_ScwbInstallUrl; // 설치페이지 set
		
    if (SCWBCon_MULTI_DEBUG) {
        document.write('<textarea id="SCWBCon_texta" rows=50 cols="80%"></textarea>');

        document.write('<br><br>');
        document.write(navigator.appName);
        document.write('<br><br>');
        document.write(navigator.appVersion);
    }
    SCWBCon_MULTI_Start();

} //win32
else {
    SCWBCon_MULTI_outputtext("not Windows OS");
}

function SCWBCon_MULTI_outputtext(data) {
    if (SCWBCon_MULTI_DEBUG) {
        document.getElementById("SCWBCon_texta").value += ("● " + data + "\n");
        /*
		var newdata = document.all.SCWBCon_texta.value;
        newdata += '  ';
        newdata += data;
        document.all.SCWBCon_texta.value = newdata;
		*/
    }
	
    console.log("● " + data);
}

function sleep(gap) {
    var then, now;
    then = new Date().getTime();
    now = then;
    while ((now - then) < gap) {
        now = new Date().getTime();
    }
}