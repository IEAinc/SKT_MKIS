/*
 * 공통 프린트 함수
 */

/*
 * 프린트 미리보기 함수
 * @param id 출력할 DIV 또는 INPUT 태그 ID
 * @param title 인쇄 머리말
 *
 * ex)
 * <script type="text/javascript" src="/js/mkis_print.js"></script>
 * <div id='print'>
 * 	인쇄내용
 * </div>
 * <a href="javascript:printPreview('print', '인쇄타이틀');">인쇄미리보기</a>
 */
var gPrintId, gPrintTitle, gPrintCallback, gPrintOptParam;  
var gPrintEncodedHtml;

var intervalCnt = 0;
var intervalId;

var isOptParam = "";

function printPreview(id, title, callback, optParam) {

	if(optParam == 'PRINT') { // 실제 프린트만 수행하는 옵션인 경우	
		isOptParam = optParam;
		
		_print(id, title, callback);
		
		var browser = checkBrowser();

		if(browser.indexOf('ie') > -1 || browser.indexOf('edge') > -1) {
			if (Installed()){
				
				IEPageSetupX.header = title;
				IEPageSetupX.PrintBackground = 1;
				IEPageSetupX.ShrinkToFit = true;
				
				IEPageSetupX.leftMargin = 		"10";
				IEPageSetupX.rightMargin = 		"10";
				IEPageSetupX.topMargin = 		"10";
				IEPageSetupX.bottomMargin = 	"10";

				// 출력용량이 많을 경우 불안정해지는 현상을 개선하기 위하여 
				// 약간의 타이밍을 두고 Idle을 한다...
				intervalId = setInterval(function() { 
											if(intervalCnt < 1) {
												IEPageSetupX.Preview(); 
												intervalCnt++;
											} else {
												clearInterval(intervalId);
												intervalCnt = 0;
												intervalId = null;
											}
											
										 }, 500);				
			}
		} else {
			window.print();
		}	
		
	} else {		
		var browser = checkBrowser();
		
		// IE가 아닌 경우
		if(!(browser.indexOf('ie') > -1 || browser.indexOf('edge') > -1)) {
			gPrintId = id;
			gPrintTitle = title;
			gPrintCallback = callback;
			gPrintOptParam = optParam;
					
			gPrintEncodedHtml = $(document.getElementById(id)).html();
			
			var gIfPrint = document.createElement("iframe");
			gIfPrint.id = "gIfPrint";
			gIfPrint.src = "/common/printPage.do";
			gIfPrint.frameBorder = 0;
			gIfPrint.style.position = "absolute";
			gIfPrint.style.top = "0";
			gIfPrint.style.left = "0";
			gIfPrint.style.width = "0";
			gIfPrint.style.height = "0";
			gIfPrint.style.margin = "0";
			document.body.appendChild(gIfPrint);
			
		} else {			
			_print(id, title, callback);			
			
			if (Installed()){
				title = title.replaceAll("&","&&"); // &가 1개 있으면 지워지나 2개 있을때 1개로 뿌려짐. 그래서 1개 있을떄 2개로 리플레이스.170720
				
				IEPageSetupX.header = title;
				IEPageSetupX.PrintBackground = 1;
				IEPageSetupX.ShrinkToFit = true;
				
				IEPageSetupX.leftMargin = 		"10";
				IEPageSetupX.rightMargin = 		"10";
				IEPageSetupX.topMargin = 		"10";
				IEPageSetupX.bottomMargin = 	"10";

				// 출력용량이 많을 경우 불안정해지는 현상을 개선하기 위하여 
				// 약간의 타이밍을 두고 Idle을 한다...
				intervalId = setInterval(function() { 
											if(intervalCnt < 1) {
												IEPageSetupX.Preview(); 
												intervalCnt++;
											} else {
												clearInterval(intervalId);
												intervalCnt = 0;
												intervalId = null;
											}
											
										 }, 500);
				//IEPageSetupX.Preview(); //미리보기
				
			} else {
				alert("IEPageSetupX 인쇄 컨트롤이 설치되지 않았습니다. 설치후 인쇄를 실행하십시요.");
				var o = '<OBJECT id=IEPageSetupX classid="clsid:41C5BC45-1BE8-42C5-AD9F-495D6C8D7586" codebase="/resource/cab/IEPageSetupX.cab#version=1,4,0,3" width=0 height=0>';
				o += '<param name="copyright" value="http://isulnara.com">';
				//o += '<div style="position:absolute;top:276;left:320;width:300;height:68;border:solid 1 #99B3A0;background:#D8D7C4;overflow:hidden;z-index:1;visibility:visible;">';
				//o += '<FONT style=\'font-family: "굴림", "Verdana"; font-size: 9pt; font-style: normal;\'>';
				//o += '<BR>  인쇄 여백제어 컨트롤이 설치되지 않았습니다.<BR><a href="/html/cab/IEPageSetupX.exe"><font color=red>이곳</font></a>을 클릭하여 수동으로 설치하시기 바랍니다.  </FONT>';
				//o += '</div>';
				o += '</OBJECT>';

				$('body').append(o);
			}
		}
	}
}

/*
 * 비IE-인쇄용 iframe 페이지 로드완료시 호출하는 페이지 
 */
function afterLoadPrintIframe() {	
	console.log('----- print iframe loaded !! -----');
	$('body').ctrlLoading();
}



/*
 * 프린트 출력 함수
 * @param id 출력할 DIV 또는 INPUT 태그 ID
 * @param title 인쇄 머리말
 *
 * ex)
 * <script type="text/javascript" src="/js/mkis_print.js"></script>
 * <div id='print'>
 * 	인쇄내용
 * </div>
 * <a href="javascript:print('print', '인쇄타이틀');">인쇄</a>
 */
function docPrint(id, title, callback){
	var browser = checkBrowser();
	
	_print(id, title, callback);
	
	if(browser.indexOf('ie') > -1 || browser.indexOf('edge') > -1) {
		if (Installed()){
			IEPageSetupX.Print(true);
		}
	} else {
		window.print();
	}	
}

$(function(){
	var o = '<OBJECT id=IEPageSetupX classid="clsid:41C5BC45-1BE8-42C5-AD9F-495D6C8D7586" codebase="/resource/cab/IEPageSetupX.cab#version=1,4,0,3" width=0 height=0>';
	o += '<param name="copyright" value="http://isulnara.com">';
	//o += '<div style="position:absolute;top:276;left:320;width:300;height:68;border:solid 1 #99B3A0;background:#D8D7C4;overflow:hidden;z-index:1;visibility:visible;">';
	//o += '<FONT style=\'font-family: "굴림", "Verdana"; font-size: 9pt; font-style: normal;\'>';
	//o += '<BR>  인쇄 여백제어 컨트롤이 설치되지 않았습니다.<BR><a href="/html/cab/IEPageSetupX.exe"><font color=red>이곳</font></a>을 클릭하여 수동으로 설치하시기 바랍니다.  </FONT>';
	//o += '</div>';
	o += '</OBJECT>';

	$('body').append(o);
});

function Installed() {
	try{
		return (new ActiveXObject('IEPageSetupX.IEPageSetup'));
	}catch (e){
		return false;
	}
}

var initBody;

function _print(id, title, callback){

	var beforePrint = function(){	
		
		var browser = checkBrowser();
		
		// IE인 경우
		if(browser.indexOf('ie') > -1 || browser.indexOf('edge') > -1) {
			// 프로그래스 End
//			$('body').ctrlLoading();
			
			initBody = $('body').clone(true);
			
			// input 인 경우에는 데이터를 가져오고 아닌 경우에는 내용을 출력
			if(document.getElementById(id)){				
				if(document.getElementById(id).tagName == "INPUT"){							
					document.body.innerHTML = document.getElementById(id).value;
				} 
				else if(document.getElementById(id).tagName == "DIV" || document.getElementById(id).tagName == "P") {
					// !!!!! 실제로 여기가 실행된다..					
					var printBody = document.getElementById(id).innerHTML;
					
					var html = '<html style="margin: 0; padding: 0;"><head>';
					//html += '<link rel=\"stylesheet\" type=\"text/css\" media=\"all\" href=\"/resource/assets/css/common.css\">';
					html += '<link rel=\"stylesheet\" type=\"text/css\" media=\"print\" href=\"/resource/assets/css/style.css\">';
//					html += "<style media=\"print\">@page { size: auto; margin: 10mm 10mm 10mm 10mm; }</style>"
					html += '</head><body style="margin: 0; padding: 0;">';
					html += printBody;
					html += '</body></html>';
					
					document.body.innerHTML = html;
				}
				else{
					alert("div input 태그 아이디만 인쇄 가능합니다.");
				}
			}			
		} 
		else {
			// 프로그래스 End
//			parent.$('body').ctrlLoading();
		}
	};
	
	var afterPrint = function(){
		var browser = checkBrowser();
		
		// IE인 경우
		if(browser.indexOf('ie') > -1 || browser.indexOf('edge') > -1) {			
			$('body').replaceWith(initBody);
			$('body #printHtml').empty();
			
			UI.fn.init(); // 이벤트 재바인딩
		}
		
//		if(callback != undefined && typeof(eval(callback)) == 'function' ){			
//			eval(callback+'()');
//		}

		// 클릭한 탭 선택처리 
		if(browser.indexOf('ie') > -1 || browser.indexOf('edge') > -1) {

			// 초기화
			$("body").find("#tabDtlNmSpan li").each(function() {
				$(this).attr('class','');
			});	

			$("body").find("#tabDtlNmSpan li").eq(gPrintTabIndex).trigger("click");	
		} 
		else {
			// iframe에서 호출하기 때문에 parent.XX으로 find			
			parent.$("body").find("#tabDtlNmSpan li").eq(parent.gPrintTabIndex).trigger("click");
		}
		
		gPrintId = null;
		gPrintTitle = null;
		gPrintCallback = null;
		gPrintOptParam = null;
		gPrintEncodedHtml = null;
		
		// 인쇄 설정 초기화
		if (Installed()) IEPageSetupX.SetDefault();
	};
	
	if(window.matchMedia) {
		var mediaQueryList = window.matchMedia('print');
		
		mediaQueryList.addListener(function(mql) {			
			if(isOptParam == "") {
				if(mql.matches) {
					beforePrint();
				} 
				else {
					afterPrint();
				}
			}
		});
	}
	
	window.onbeforeprint = beforePrint;
	window.onafterprint = afterPrint;	
}

//////////////////////////////////////////////////////////////////// S

//탭클릭인덱스
var gPrintTabIndex; 

//////////////////////////////////////////////////////////////////// E



function checkBrowser() {
	var agent = navigator.userAgent.toLowerCase();
	var name = navigator.appName;
	var browser;

	if(name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
		browser = 'ie';
		
		if(name === 'Microsoft Internet Explorer') { // ie old version(IE10 or Lower)
			agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
			browser += parseInt(agent[1]);
		} else { // IE 11+
			if(agent.indexOf('trident') > -1) { // IE 11
				browser += 11;
			} else if(agent.indexOf('edge/') > -1) { // Edge
				browser = 'edge';
			}
		}
		
	} else if(agent.indexOf('safari') > -1) { // chrome or safari
		if(agent.indexOf('opr') > -1) {
			browser = 'opera';
		}else if(agent.indexOf('chrome') > -1) {
			browser = 'chrome';
		}else if(agent.indexOf('safari') > -1) {
			browser = 'safari';
		}
	} else if(agent.indexOf('firefox') > -1) {
		browser = 'firefox';
	}
	
	return browser;
}
