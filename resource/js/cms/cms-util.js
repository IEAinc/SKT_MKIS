/**
 * CMS 시스템 공통 유틸 함수 모음
 */

// ajax 호출 오류시 처리
/*var AjaxError = function(jqXHR, textStatus, errorThrown, errMsg){
	if (jqXHR.status == 401) { // 접속정보 없음 (401)
   	 	window.location.href = "/login/ConnectError.do";
    } 
	else if (jqXHR.status == 403) { // 권한 없음(403)
   	 	alert("수행권한이 없습니다.");
    } 
	else {
        var msg = "호출중 오류가 발생하였습니다.";	
        if(errMsg != undefined && errMsg != '') msg = errMsg;
        
   	 	//alert(msg + " : " + textStatus);
   	 	alert(msg);
    }
};*/


//ajax 호출 오류시 처리
var AjaxError = function(jqXHR, textStatus, errorThrown, errMsg){

	if (jqXHR.status == 401) { // 접속정보 없음 (401)
   	 	window.location.href = "/login/ConnectError.do";
    } 
	else if (jqXHR.status == 403) { // 권한 없음(403)
   	 	alert("수행권한이 없습니다.");
    } 
	else {
		var message = "[오류알림]\n";
		
		if(G_PROFILE == "prod" || G_PROFILE == "dev") {
			message += "작업중 오류가 발생하였습니다. 관리자에게 문의 바랍니다.\n( - 잘못된 데이터형식/예외사항/네트웍장애 등이 원인일 수 있습니다.)";
		} else {
			var data = JSON.parse(jqXHR.responseText);
			message += "error code: " + data.errorCode + "\n";
			message += data.errorMessage + "\n";
			
			if(errMsg != undefined && errMsg != '') {
				message += errMsg + "\n";
			}			
		}
		
		// 운영이 아닌 경우만 오류메시지 띄운다.
//		if(G_PROFILE != "prod") {
			alert(message);
//		}
			
    }
};


//********************************************************
//exception processing area   
//******************************************************** 
/**
* 에러다이얼로그 오픈
*/
var viewError = function(response) {
	window.showModalDialog();
};


/**
 * 타입에 따른 유효성 체크를 수행
 * type : number, date, time, datetime, tel, mobile, email, url, kor, eng
 */
var CheckValidation = function(value, type){
	
	var regExp = {
			  number    : /^[\d]*$/ // 숫자
			, date      : /^(\d{1,4})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/           // 날짜 YYYYMMDD
			, time      : /^(0[0-9]|1[0-9]|2[0-4])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])$/ // 시간 hhmmss
			, datetime  : /^(\d{1,4})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-4])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])$/ // 날짜시간 YYYYMMDDhhmmss
			, tel       : /^(0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70))(\d{3,4})(\d{4})$/   // 일반전화
			, mobile    : /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/         // 모바일
			, email     : /^[._\da-zA-Z-]+@[\da-zA-Z-]+(.[_\da-zA-Z-]+)*$/          // 이메일
			, url       : /^(https?:\/\/|\/){1}[^\/\/][a-z0-9-+&@#\/%?=~_|!:,.;]*/ // url
			, kor       : /^[ㄱ-ㅎ|가-힣|\d|_?~!@#$%^&*]*$/ // 한글,숫자,밑줄(_),특수문자(?~!@#$%^&*)
			, eng       : /^[\w_?~!@#$%^&*]*$/              // 영문,숫자,밑줄(_),특수문자(?~!@#$%^&*)
			, decimal   : /^[\d+]|[\d+\.\d+]$/ // 숫자
	};	
	
	if(value == 'undefined' || value == ''){
		alert('유효성 검증할 데이터가 존재하지 않습니다.');
		return false;
	}
	
	var patt;
	switch(type){
		
		case 'number':  patt = regExp.number;
						if(!patt.test(value)){
							alert('숫자타입이 아닙니다.');
							return false;
						}
					  break;
			          
		case 'date':  patt = regExp.date;
						if(!patt.test(value)){
							alert('날짜(YYYYMMDD) 타입이 아닙니다.');
							return false;
						}
			          break;					          

		case 'time':  patt = regExp.time;
						if(!patt.test(value)){
							alert('시간(hhmmss) 타입이 아닙니다.');
							return false;
						}
						break;			
						
		case 'datetime':  patt = regExp.datetime;
						if(!patt.test(value)){
							alert('날짜시간(YYYYMMDDhhmmss) 타입이 아닙니다.');
							return false;
						}
			          break;				
			          
		case 'tel':  patt = regExp.tel;
					 if(!patt.test(value)){
							alert('유선번호 타입이 아닙니다.');
							return false;
						}
			          break;					     
			          
		case 'mobile':  patt = regExp.mobile;
						if(!patt.test(value)){
							alert('무선번호 타입이 아닙니다.');
							return false;
						}
			          break;					  
      
		case 'email':  patt = regExp.email;
						if(!patt.test(value)){
							alert('이메일 타입이 아닙니다.');
							return false;
						}
			          break;					  
      
		case 'url':  patt = regExp.url;
						if(!patt.test(value)){
							alert('URL 타입이 아닙니다.');
							return false;
						}
			          break;					  	          
      
		case 'kor':  patt = regExp.kor;
						if(!patt.test(value)){
							alert('한글,숫자 타입이 아닙니다.');
							return false;
						}
			          break;		
      
		case 'eng':  patt = regExp.eng;
						if(!patt.test(value)){
							alert('영문,숫자 타입이 아닙니다.');
							return false;
						}
			          break;

		case 'decimal':  patt = regExp.decimal;
						if(!patt.test(value)){
							alert('소수점을 포함한 숫자타입이 아닙니다.');
							return false;
						}
				      break;
	  
	    default : 
	    	     return true;
	}
	
	return true;	
		
};

/**
 * 바이트배열을 Hex 코드로 변환
 * 
 * @param byteArray
 * @returns
 */
var byteToHex = function(byteArray){
	var result = "";
	if (!byteArray){
		alert('byteToHex() Error');
		return false;
	}
		
	for (var i=0; i<byteArray.length; i++)
		result += ((byteArray[i]<16) ? "0" : "") + byteArray[i].toString(16);
	
	return result;	
};

/**
 * 바이트배열을 문자열로 변환
 * 
 * @param byteArray
 * @returns
 */
var byteToString = function(byteArray){
	var result = "";
	if (!byteArray){
		alert('byteToString() Error');
		return false;
	}
		
	for (var i=0; i<byteArray.length; i++)
		result += String.fromCharCode(byteArray[i]);
	
	return result;	
};

/**
 * Hex 코드를 스트링으로 변환
 * @param hex
 * @returns
 */
var hexToString = function(hex){
	var result = "";
	if(hex.indexOf("0x") == 0 || hex.indexOf("0X") == 0) hex = hex.substr(2);
	
	if(hex.length%2) hex+='0';
	
	for(var i = 0; i<hex.length; i += 2)
		result += String.fromCharCode(parseInt(hex.slice(i, i+2), 16));
	
	return result;
};

/**
 * 천단위 콤마 포맷으로 숫자 반환
 * @param number
 * @returns number
 */
var addComma = function(number) {
	number = String(number);
	
	return number.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
};

/**
 * 숫자이외의 문자 제거 후 반환
 * @param number
 * @returns number
 */
var onlyNumber = function(number) {
	number = String(number);
	
	return number.replace(/[^\d]+/g, '');
};

/**
 * 객체의 바이트수 체크
 * @param
 * @returns
 */
var byteCheck = new function() {
	var targetClass = 'remaining';		// 대상 CSS CLASS
	
	// 바이트수 체크 시작
	this.start = function() {
		$('.'+targetClass).each(function() {
			// count 정보 및 count 정보를 찾아내서 변수에 저장
			var $maxcount = $('.maxcount', this);
			var $count = $('.count', this);
			var $input = $(this).prev();
			
			var maximumByte = Number($maxcount.text().replace(/[^\d]+/g, ''));
			
			// update 함수는 keyup, paste, input 이벤트에서 호출
			var update = function () {
				var str_len = $input.val().length;
				var cbyte = 0;
				var li_len = 0;
				for (i = 0; i < str_len; i++) {
					var ls_one_char = $input.val().charAt(i);
					if (escape(ls_one_char).length > 4) {
						cbyte += 3; //한글이면 3를 더함
					} else {
						cbyte++; //한글아니면 1을 더함
					}
					if (cbyte <= maximumByte) {
						li_len = i + 1;
					}
				}
				
				// 사용자가 입력한 값이 제한 값을 초과하는지를 검사
				if($maxcount.length > 0 && (parseInt(cbyte) > parseInt(maximumByte))) {
					alert('허용된 바이트수('+$maxcount.text()+'byte)가 초과되었습니다.\n초과된 부분은 자동으로 삭제됩니다.');
					var str = $input.val();
					var str2 = $input.val().substr(0, li_len);
					$input.val(str2);
					var cbyte = 0;
					for (i = 0; i < $input.val().length; i++) {
						var ls_one_char = $input.val().charAt(i);
						if (escape(ls_one_char).length > 4) {
							cbyte += 3; //한글이면 3을 더한다
						} else {
							cbyte++; //한글아니면 1을 다한다
						}
					}
				}
				
				$count.text(addComma(cbyte));
			};
			
			// keyup, paste 이벤트와 update 함수를 바인드
			$input.on('input keyup keydown paste change', function() {
				setTimeout(update, 0);
			});
			
			update();
		});
	};
	
	// 바이트수 체크 초기화
	this.reset = function() {
		$('.'+targetClass).each(function() {
			$(this).prev().trigger('change');
		});
	};
};

/**
 * 정규식 객체
 */
var _regExps = {
		splitPhoneNum0		: /^(01\d{1}|02|0502|0505|0506|0\d{1,2})-?(\d{3,4})-?(\d{4})$/		// 마스킹 전 전화번호
		, splitPhoneNum1	: /^(01\d{1}|02|0502|0505|0506|0\d{1,2})-?(\S{3,4})-?(\S{4})$/		// 마스킹 후 전화번호
		, formatPhoneNum0 : /^(01\d{1}|02|0502|0505|0506|0\d{1,2})(\d{3,4})(\d{4})$/			// 마스킹 전 전화번호
		, formatPhoneNum1 : /^(01\d{1}|02|0502|0505|0506|0\d{1,2})(\S{3,4})(\S{4})$/			// 마스킹 후 전화번호
		, gridDate14 : /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/									// YYYYMMDDHH24MISS
		, gridDate8 : /^(\d{4})(\d{2})(\d{2})$/															// YYYYMMDD
		, gridDate6 : /^(\d{4})(\d{2})$/																	// YYYYMM
		, gridDate16 : /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/							// YYYYMMDDHH24MISSFF
		, gridDecodeDate8 : /^(\S{4})(\S{2})(\S{2})$/													// YYYYMMDD
};

/**
 * 전화번호 가운데 자리가 3자리일 경우 0을 붙여 4자리로 반환
 * @param phoneNum
 * @param type('0':마스킹 전 전화번호, '1': 마스킹 후 전화번호)
 * @returns resultValue
 */
var getCenterFillPhoneNum = function(phoneNum, type) {
	var phoneNumArray = getSplitPhoneNum(phoneNum, type);
	var resultValue = String(phoneNumArray[0]) + (phoneNumArray[1].length == 3 ? '0' : '') + String(phoneNumArray[1]) + String(phoneNumArray[2]); 
	
	return resultValue;
};

/**
 * 전화번호를 자리별로 분리 반환
 * @param phoneNum
 * @param type('0':마스킹 전 전화번호, '1': 마스킹 후 전화번호)
 * @returns resultValue
 */
var getSplitPhoneNum = function(phoneNum, type) {
	var resultValue = ['','',''];									// 결과값 배열
	var regExp = eval('_regExps.splitPhoneNum'+type);	// 정규식
	
	for(var i=0; i < 3; i++) {
		resultValue[i] = phoneNum.replace(regExp, '$'+(i+1));
	}
	
	return resultValue;
};

/**
 * 전화번호 포맷으로 반환
 * @param phoneNum
 * @param type('0':마스킹 안된 전화번호, '1': 마스킹된 전화번호)
 * @returns phoneNum
 */
var formatPhoneNum = function(phoneNum, type) {
	phoneNum = phoneNum.replace(eval('_regExps.formatPhoneNum'+type), '$1-$2-$3');
	
	return phoneNum;
};

/**
 * 전화번호 포맷 변경
 * @param cellval
 * @returns cellval
 */
var gridPhoneNum = function(cellval) {
	return formatPhoneNum(cellval, '1');
};

/**
 * 날짜 포맷 변경
 * @param date
 * @returns date
 */
var formatDate = function(date) {
	var resultValue = '';		// 결과값
	var sep = '-';				// 포맷형식
	
	// 데이터 치환
	date = date.replace(/\.0$/, '');
	date = date.replace(/[^\d+]/g, '');
	
	// YYYYMMDDHH24MISS
	if(date.length == 14) {
		resultValue = date.replace(_regExps.gridDate14, '$1'+sep+'$2'+sep+'$3 $4:$5:$6');
	
	// YYYYMMDD
	} else if(date.length == 8) {
		resultValue = date.replace(_regExps.gridDate8, '$1'+sep+'$2'+sep+'$3');
	
	// YYYYMM
	} else if(date.length == 6) {
		resultValue = date.replace(_regExps.gridDate6, '$1'+sep+'$2');
	
	// YYYYMMDDHH24MISSFF2
	} else if(date.length == 16) {
		resultValue = date.replace(_regExps.gridDate16, '$1'+sep+'$2'+sep+'$3 $4:$5:$6.$7');
	
	} else {
		resultValue = date;
		
	}
	
	return resultValue;
};

/**
 * 암호화 날짜 포맷 변경
 * @param date
 * @returns date
 */
var formatDateDecode = function(date) {
	var resultValue = '';		// 결과값
	var sep = '-';				// 포맷형식
	
	// YYYYMMDD
	if(date.length == 8) {
		resultValue = date.replace(_regExps.gridDecodeDate8, '$1'+sep+'$2'+sep+'$3');
	}
	
	return resultValue;
};

/**
 * 날짜 간격 일수 반환
 * @param startDtVal
 * @param endDtVal
 * @returns dateGap
 */
var getDateGap = function(startDtVal, endDtVal) {
	startDtVal = onlyNumber(startDtVal);
	endDtVal = onlyNumber(endDtVal);
	var startDt = new Date(startDtVal.substr(0,4), (startDtVal.substr(4,2) -1), startDtVal.substr(6,2));		// 조회 시작일
	var endDt = new Date(endDtVal.substr(0,4), (endDtVal.substr(4,2) -1), endDtVal.substr(6,2));		// 조회 종료일
	var dateGap = (Date.parse(endDt) - Date.parse(startDt)) / (1000 * 60 * 60 * 24);						// 날짜 간격 일수
	
	return dateGap;
};

/**
 * 월 간격 반환
 * @param startDtVal
 * @param endDtVal
 * @returns monthGap
 */
var getMonthGap = function(startDtVal, endDtVal) {
	startDtVal = onlyNumber(startDtVal);
	endDtVal = onlyNumber(endDtVal);
	var startDt = new Date(startDtVal.substr(0,4), (startDtVal.substr(4,2) -1), 0);				// 조회 시작일
	var endDt = new Date(endDtVal.substr(0,4), (endDtVal.substr(4,2) -1), 0);					// 조회 종료일
	var startYear = startDt.getFullYear();																// 시작 년
	var startMonth = startDt.getMonth();															// 시작 월
	var monthGap = 1;
	
	while(startDt < endDt) {
		startDt = new Date(startYear, startMonth+monthGap, 0);
		monthGap++;
	}
	
	monthGap = monthGap - 2;
	
	return monthGap;
};

/**
 * 생일년도, 내외국인구분, 남/여구분에 따른 성별 코드값 반환
 * @param birthYY(생일년도)
 * @param frgnrClCd(내국인:L, 외국인:F)
 * @param sex(M:남, F:여)
 * @returns sexVal
 * 1 : 2000년 이전출생 내국인 남성
 * 2 : 2000년 이전출생 내국인 여성 
 * 3 : 2000년 이후출생 내국인 남성
 * 4 : 2000년 이후출생 내국인 여성 
 * 5 : 2000년 이전출생 외국인 남성 
 * 6 : 2000년 이전출생 외국인 여성 
 * 7 : 2000년 이후출생 외국인 남성
 * 8 : 2000년 이후출생 외국인 여성
 * 9 : 1900년 이전출생 내국인 남성
 * 0 : 1900년 이전출성 내국인 여성
 */
var setSexVal = function(birthYY, frgnrClCd, sex) {
	var sexVal = '';
	
	if(birthYY < 1900) {
		if(frgnrClCd == 'L') {
			if(sex == 'M') {
				sexVal = '9';
			} else {
				sexVal = '0';
			}
		} else {
			if(sex == 'M') {
				sexVal = '5';
			} else {
				sexVal = '6';
			}
		}
	} else if(birthYY < 2000) {		
		if(frgnrClCd == 'L') {
			if(sex == 'M') {
				sexVal = '1';
			} else {
				sexVal = '2';
			}
		} else {
			if(sex == 'M') {
				sexVal = '5';
			} else {
				sexVal = '6';
			}
		}
	} else if(birthYY >= 2000) {
		if(frgnrClCd == 'L') {
			if(sex == 'M') {
				sexVal = '3';
			} else {
				sexVal = '4';
			}
		} else {
			if(sex == 'M') {
				sexVal = '7';
			} else {
				sexVal = '8';
			}
		}
	} else {
		sexVal = sex;
	}
	
	return sexVal;
}

/**
 * datepicker의 달력버튼 위치 보정
 * @param 
 * @returns 
 */
var setDatepickerBtn = function() {
	$('img.ui-datepicker-trigger').css({'vertical-align':'top', 'cursor':'pointer'});
	$('.datepicker').css({'margin-top':'1px'});
};

/**
 * class가 datepicker로 지정된 객체에 datepicker를 바인드
 * @param 
 * @returns 
 */
var getDatepicker = function() {
	$.datepicker.regional['ko'] = {
			closeText: '닫기',
			prevText: '이전달',
			nextText: '다음달',
			currentText: '오늘',
			monthNames: ['1월(JAN)','2월(FEB)','3월(MAR)','4월(APR)','5월(MAY)','6월(JUN)',
							'7월(JUL)','8월(AUG)','9월(SEP)','10월(OCT)','11월(NOV)','12월(DEC)'],
			monthNamesShort: ['1월','2월','3월','4월','5월','6월',
									'7월','8월','9월','10월','11월','12월'],
			dayNames: ['일','월','화','수','목','금','토'],
			dayNamesShort: ['일','월','화','수','목','금','토'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
			weekHeader: '주',
			dateFormat: 'yy-mm-dd',
			firstDay: 0,
			isRTL: false,
			showMonthAfterYear: true,
			yearSuffix: '',
			yearRange: '1900:2050'
	};
	
	$.datepicker.setDefaults($.datepicker.regional['ko']);
	
	$('.datepicker').datepicker({ 
		showOn: 'button',											// input 우측에 달력 표시
		buttonImage: '/resource/images/calendar_btn.png', 	//이미지 url
		buttonImageOnly: true,									// 달력 아이콘 표시
		buttonText: "달력",
		changeMonth: true,										// 월 선택 셀렉트 박스 표시
		changeYear: true,											// 년 선택 셀렉트 박스 표시
		showButtonPanel: true										// 오늘, 닫기 버튼 표시
	});
	
	// 달력 아이콘 위치 보정
	setDatepickerBtn();
};

/**
 * 시간 셀렉트 박스 옵션 생성
 * @param objId
 * @param term 
 * @returns 
 */
var createTimeOption = function(objId, term) {
	var $selectObj = $('#'+objId);						// 대상 셀렉트 박스 객체
	var item = objId.match('Hour') ? 'H' : 'M';		// 시, 분 항목
	var itemTxt = (item == 'H') ? '시' : '분';			// 시, 분 항목명
	var itemMax = (item == 'H') ? 23 : 59;			// 시, 분 항목에 따른 최대값
	var addOptVal = (item == 'H') ? '' : '00';		// 옵션에 더할 값(초)
	var optVal;											// 옵션 값
	
	// 1. 셀렉트 박스 초기화
	$selectObj.empty();
	
	// 2. 셀렉트 박스 기본 옵션 생성
	$selectObj.append('<option value="S">선택</option>');

	// 3. 셀렉트 박스 옵션 생성
	for(var i=0; i <= itemMax; i += term) {
		optVal = (i < 10) ? ('0' + String(i)) : String(i);
		$selectObj.append('<option value="'+ optVal + addOptVal +'">' + optVal + itemTxt + '</option>');
	}
};

/**
 * 년/월 셀렉트 박스 옵션 생성
 * @param objId 
 * @returns 
 */
var createDateOption = function(objId) {
	var $selectObj = $('#'+objId);									// 대상 셀렉트 박스 객체
	var type = objId.match('Year') ? 'YR' : 'MN';					// 년, 월 구분
	var minYear = 2015;											// 최소 년 
	var minMonth = 1;												// 최소 월
	
	var today = new Date();										// 현재날짜
	var nowYear = today.getFullYear();							// 현재 년
	var nowMonth = today.getMonth() + 1;					// 현재 월
	
	var itemTxt = (type == 'YR') ? '년' : '월';						// 년, 월 항목명
	var itemMax = (type == 'YR') ?  nowYear : 12;				// 주, 월 항목에 따른 최대값
	var itemMin = (type == 'YR') ? minYear : minMonth;		// 년, 월 항목에 따른 최소값
	var optVal;														// 옵션 값
	
	// 1. 셀렉트 박스 초기화
	$selectObj.empty();
	
	// 2. 셀렉트 박스 옵션 생성
	for(var i=itemMin; i <= itemMax; i ++) {
		optVal = (i < 10) ? ('0' + String(i)) : String(i);
		$selectObj.append('<option value="'+ optVal +'">' + optVal + itemTxt + '</option>');
	}
};

/**
 * 주 셀렉트 박스 옵션 생성
 * @param objId
 * @param type 
 * @returns 
 */
var createWeekOption = function(objId, year, month) {
	var $selectObj = $('#'+objId);									// 대상 셀렉트 박스 객체
	var itemTxt = '주';												// 주 항목명
	var itemMax = getWeekCount(year, month);				// 주 최대값
	var optVal;														// 옵션 값
	
	// 1. 셀렉트 박스 초기화
	$selectObj.empty();
	
	// 2. 셀렉트 박스 옵션 생성
	for(var i=1; i <= itemMax; i ++) {
		optVal = (i < 10) ? ('0' + String(i)) : String(i);
		$selectObj.append('<option value="'+ optVal +'">' + optVal + itemTxt + '</option>');
	}
};

/**
 * 년/월 셀렉트 박스 옵션 선택
 * @param objId
 * @param subMonthVal 0 : 현재 월, -D : 이전 월
 * @returns 
 */
var setDateOption = function(objId, subMonthVal) {
	var today = new Date();													// 현재날짜
	var nowYear = today.getFullYear();										// 현재 년
	var nowTmpMonth = today.getMonth() + 1;							// 현재 월
	var nowMonth = (nowTmpMonth < 10) ? ('0' + String(nowTmpMonth)) : String(nowTmpMonth);
	
	var prevDay = new Date();													// 이전 월 날짜
	prevDay.setMonth(prevDay.getMonth() + Number(subMonthVal));	// 이전 월 수 설정
	var prevYear = prevDay.getFullYear();									// 이전 년
	var prevTmpMonth = prevDay.getMonth() + 1;						// 이전 월
	var prevMonth = (prevTmpMonth < 10) ? ('0' + String(prevTmpMonth)) : String(prevTmpMonth);
	
	for(var i=0; i<objId.length; i++) {
		var setVal;
		if(Number(subMonthVal) < 0) {
			setVal = objId[i].match('Year') ? prevYear : prevMonth;
		} else {
			setVal = objId[i].match('Year') ? nowYear : nowMonth;
		}
		
		$('#'+objId[i]).val(setVal);
	}
};

/**
 * 셀렉트 박스 기본값 처리
 * @param objId
 * @param value
 * @returns 
 */
var getSelectValue = function(objId, value) {
	if(String(value) == '' || value == null) {
		return $('#'+objId).children('option:eq(0)').val();
	
	} else {
		return value;
	
	}
};


/**
 * 년 월을 파라미터로 받아 해당년월의 최대 주차수를 구함
 *
 * 월요일이 주 시작일
 * 월 마지막주의 목요일이 어느월에 존재하느냐에 따라 월 마지막주차 또는 월첫주차 결정
 * 
 * @param  year   해당년
 * @param  month  해당월
 * @returns 해당년월의 최대주차수
 */
function getWeekCount(year,month){
	
	var startDate = new Date(year,month-1,1); // 해당년월의 시작일
	var endDate   = new Date(year,month,0);   // 해당년월의 마지막일
	var endDateYN = true;                     // 해당년월의 마지막일의 해당월 주차에 포함여부
	
	var endDateDay = endDate.getDate(); // 해당년월의 마지막일자
	
	// 해당년월의 마지막일자가 해당년월의 주차에 포함여부 판단.
	var endDateWeekDay = endDate.getDay(); // 해당월의 마지막일자의 요일 체크
	if(0==endDateWeekDay || endDateWeekDay>3) endDateYN = true;
	else endDateYN = false;
	
	//alert('마지막일자 주차포함여부 : ' + endDateYN);
	
	// 전달받은 년도 월의 첫일자의 요일체크 하여 해당월에 주차로 시작하는지 체크
	// 1일이 월요일(1),화요일(2),수요일(3),목요일(4)일 경우에는 해당월의 1주차에 포함되는걸로 판단
	// 월요일이 아닌경우 각 요일에 해당하는 요일 계산하여 전달의 월요일의 날짜를 계산 -> 1주차 시작일자 계산
	
	var startWeekDate; // 해당년월 1주차 시작일
	var endWeekDate;   // 해당년월 1주차 종료일
	
	// 해당년월1일자의 요일계산
	var weekDay = startDate.getDay();
	
	// 해당년월의 1주차 시작일/종료일 계산
	if(0<weekDay && weekDay<5){ // 해당년월 시작주차에(1주차) 포함
		//alert(weekDay + " : 1주차 포함");
		if(weekDay == 1){ // 월요일(1)
			startWeekDate = startDate;
			endWeekDate   = new Date(year,month-1,7);
		}
		else{ // 화요일,수요일,목요일(2,3,4)
			startWeekDate = new Date(year,month-1,(2-weekDay)); 
			endWeekDate   = new Date(year,month-1,(8-weekDay));
		}
	}
	else{ // 전달의 마지막주차에 포함
		//alert(weekDay + " : 1주차 미포함"); 
		if(weekDay == 0){ // 일요일(0) 
			startWeekDate = new Date(year,month-1,2);
			endWeekDate   = new Date(year,month-1,8);
		}
		else{ // 금요일,토요일(5,6)
			startWeekDate = new Date(year,month-1,(weekDay==5 ? 4:3)); 
			endWeekDate   = new Date(year,month-1,(weekDay==5 ? 10:9)); 
		}
	}
	
	//alert('1주차 시작일 : ' + startWeekDate.getFullYear() + '년 ' +  (startWeekDate.getMonth()+1) + '월 ' +startWeekDate.getDate() + '일' + '\n' + 
    //      '1주차 종료일 : ' + endWeekDate.getFullYear() + '년 ' +  (endWeekDate.getMonth()+1) + '월 ' +endWeekDate.getDate() + '일');
	
	// 주차의 종료일의 일자
	var endWeekDateDay = endWeekDate.getDate();
	
	var cnt = 0;
	
	// 해당주차 종료일이 해당월 마지막일자보다 작은경우, 
	// 해당월의 마지막일자가 해당월의 주차에 포함되며 해당주차 종료일 해당월 마지막일자+7일(4일이상:목요일이상일때 포함됨)보다 작을경우
	while(endWeekDateDay < endDateDay || (endWeekDateDay < endDateDay+7 && endDateYN)){
		endWeekDateDay += 7;
		cnt++;	
	}
	
	//alert(year + '-' + month + " : " + cnt);
	
	return cnt;
}

/**
 * 년월주차를 파라미터로 하여 해당 년월주차의 시작일/종료일 계산
 *
 * 월요일이 주 시작일
 * 월 마지막주의 목요일이 어느월에 존재하느냐에 따라 월 마지막주차 또는 월첫주차 결정
 * 
 * @param  year   해당년
 * @param  month  해당월
 * @param  month  해당주차
 *
 * @returns 해당년월주차의 시작일(startWeek)/종료일(endWeek) 포함한 객체리턴
 */
function getWeekTerm(year,month,week){
	
	var startDate = new Date(year,month-1,1); // 해당년월의 시작일
	
	// 전달받은 년도 월의 첫일자의 요일체크 하여 해당월에 주차로 시작하는지 체크
	// 1일이 월요일(1),화요일(2),수요일(3),목요일(4)일 경우에는 해당월의 1주차에 포함되는걸로 판단
	// 월요일이 아닌경우 각 요일에 해당하는 요일 계산하여 전달의 월요일의 날짜를 계산 -> 1주차 시작일자 계산
	
	var startWeekDate; // 해당년월 주차 시작일
	var endWeekDate;   // 해당년월 주차 종료일
	
	// 해당년월1일자의 요일계산
	var weekDay = startDate.getDay();
	
	// 해당년월의 1주차 시작일/종료일 계산
	if(0<weekDay && weekDay<5){
		//alert(weekDay + " : 1주차 포함");
		if(weekDay == 1){ // 월요일(1)
			startWeekDate = startDate;
			endWeekDate   = new Date(year,month-1,7);
		}
		else{// 화요일,수요일,목요일(2,3,4)
			startWeekDate = new Date(year,month-1,(2-weekDay)); 
			endWeekDate   = new Date(year,month-1,(8-weekDay));
		}
	}
	else{
		//alert(weekDay + " : 1주차 미포함"); // 전달의 마지막주차에 포함
		if(weekDay == 0){ // 일요일(0) 
			startWeekDate = new Date(year,month-1,2);
			endWeekDate   = new Date(year,month-1,8);
		}
		else{// 금요일,토요일(5,6)
			startWeekDate = new Date(year,month-1,(weekDay==5 ? 4:3)); 
			endWeekDate   = new Date(year,month-1,(weekDay==5 ? 10:9)); 
		}
	}
	
	//alert('1주차 시작일 : ' + startWeekDate.getFullYear() + '년 ' +  (startWeekDate.getMonth()+1) + '월 ' +startWeekDate.getDate() + '일' + '\n' + 
    //      '1주차 종료일 : ' + endWeekDate.getFullYear() + '년 ' +  (endWeekDate.getMonth()+1) + '월 ' +endWeekDate.getDate() + '일');
	
	// 해당주차 시작일/종료일 계산
	var startYear = startWeekDate.getFullYear();
	var startMon = startWeekDate.getMonth();
	var startDay = startWeekDate.getDate();
	
	var endYear = endWeekDate.getFullYear();
	var endMon= endWeekDate.getMonth();
	var endDay = endWeekDate.getDate();
	
	startDay = startDay + (week-1)*7;
	endDay   = endDay   + (week-1)*7;
	
	startWeekDate = new Date(startYear,startMon,startDay);
	endWeekDate   = new Date(endYear,endMon,endDay);
	
	//alert(week + '주차 시작일 : ' + startWeekDate.getFullYear() + '년 ' +  (startWeekDate.getMonth()+1) + '월 ' +startWeekDate.getDate() + '일' + '\n' + 
	//	  week + '주차 종료일 : ' + endWeekDate.getFullYear() + '년 ' +  (endWeekDate.getMonth()+1) + '월 ' +endWeekDate.getDate() + '일');

	var result = {};
	result.startWeek = '' + startWeekDate.getFullYear() 
	                      + ((startWeekDate.getMonth()+1) <10 ? '0'+(startWeekDate.getMonth()+1) : (startWeekDate.getMonth()+1))
                          + (startWeekDate.getDate() <10 ? '0'+ startWeekDate.getDate() : startWeekDate.getDate());
	result.endWeek   = '' + endWeekDate.getFullYear() 
                          + ((endWeekDate.getMonth()+1) <10 ? '0'+(endWeekDate.getMonth()+1) : (endWeekDate.getMonth()+1))
                          + (endWeekDate.getDate() <10 ? '0'+ endWeekDate.getDate() : endWeekDate.getDate());
	
	return result;
}

/**
 * 빈값인지 체크
 * 특히 space값만 입력한 경우 빈값으로 간주한다.
 * @param objId
 * @param value
 * @returns 
 */
var isEmpty = function(value) {
	if(value == null) return true;
	if(value == "NaN") return true;
	if(new String(value).valueOf() == 'undefined') return true;
	
	var chkStr = new String(value);
	if(chkStr.valueOf() == 'undefined') return true;
	if(chkStr == null) return true;
	if(chkStr.toString().length == 0) return true;
	
	var count = 0;
    for (var i = 0; i < chkStr.length; i++) {
        if (chkStr.charCodeAt(i) == 32) count++;
    }	
    if(count == chkStr.length) {
        return true;
    }
    
	return false;
};

var nvl = function(value,defValue) {
	return (isEmpty(value)? defValue:value);
};




/////////////////////////////////////////////////////////////////////
// FROM MKIS_COMMON.js 
/////////////////////////////////////////////////////////////////////

/*
 * Date 객체를 지정한 날짜 포맷으로 반환하는 함수
 *
 * @param f 문자열로 구성된 날짜 포맷
 * yyyy : 전체연도(2012)
 * yy : 두자리수 연도(12)
 * MM : 두자리수 월(06)
 * dd : 두자리수 일(08)
 * E : 요일(월요일)
 * hh : 두자리수 시간(12)
 * mm : 두자리수 분(11)
 * ss : 두자리수 초(20)
 * a/p : 오전/오후(오후)
 *
 * 포맷에서 위 문자열을 숫자로 치환하는 방식으로 구성
 *
 * yyyy-MM-dd -> 2012-06-08
 * yy/MM/dd hh:ss -> 12/06/08 12:11
 *
 * ex)
 * new Date().format('yyyy-MM-dd') : 2012-06-08
 *
 */
Date.prototype.format = function(f){
	if(!this.valueOf()) return "";
	var weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일' ];
	var d = this;
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1){
		switch($1){
		case 'yyyy': return d.getFullYear();
		case 'yy': return (d.getFullYear()%1000)<10 ? '0'+(d.getFullYear()%1000) : (d.getFullYear()%1000);
		case 'MM': return d.getMonth()<9 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
		case 'dd': return d.getDate()<10 ? '0'+d.getDate() : d.getDate();
		case 'E': return weekName[d.getDay()];
		case 'hh': return d.getHours()<10 ? '0'+d.getHours() : d.getHours();
		case 'mm': return d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
		case 'ss': return d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
		case 'a/p': return d.getHours()<12?"오전":"오후";
		}
	});
}

/*
 * <p>시작일, 종료일을 입력하는 경우 사용</p>
 *
 * @param sPeriod 문자열로 구성된 기간(일:d, 월:m)
 * @param sStartDateSelector 시작일 Selector
 * @param sEndDateSelector 종료일 Seletor
 *
 * onClick시 이벤트 설정  ex)onclick="setPeriodDate('-7d', '#start_dt', '#end_dt');"
 * parameter(mod, objId)
 * 		mod: 3일 전 인 경우 -3d, 7일 후인 경우 7d, 1달 전인 경우 -1m
 * 		sObjId: 시작일 input box name
 * 		eObjId: 종료일 input box name
*/
function setPeriodDate(sPeriod, sStartDateSelector, sEndDateSelector){
	if(sPeriod != undefined && sPeriod != null && sPeriod.length > 0 ){
		//if(!isEmpty($(sStartDateSelector).val()) && isEmpty($(sEndDateSelector).val())) { // start dt만 있는 경우
		if(!isEmpty($(sStartDateSelector).val()) ) { // start dt가 있는 경우	
			
			var dStartDt = $(sStartDateSelector).val().replace(/\-/gi,"").replace(/\./gi,"");///시작일
			if(!checkDate(dStartDt, 'Y')) {
				alert('시작일 입력값이 올바르지 않습니다.');
				$(sStartDateSelector).focus();
				return false;
			}
		
			sUnit = sPeriod.substring(sPeriod.length-1);
			sPeriod = sPeriod.substring(0,sPeriod.length-1);
			sPeriod = (parseInt(sPeriod) * -1) + sUnit;
			//alert(sPeriod);
			
			$(sEndDateSelector).val(setPeriodDateFormat(sPeriod,'yyyy-MM-dd',$(sStartDateSelector).val()));
		} else {
			$(sStartDateSelector).val(setPeriodDateFormat(sPeriod,'yyyy-MM-dd'));
			$(sEndDateSelector).val(setPeriodDateFormat('0d','yyyy-MM-dd'));
		}
	}
}

/*
 * <p>시작일, 종료일을 입력하는 경우 날짜를 자동을 셋팅하는 함수</p>
 * <p>날짜 입력하는 input box 가 2개인 경우 사용</p>
 *
 * onClick시 이벤트 설정  ex)onClick="setPeriodDateFormat(-7, 'start_dt', 'end_dt', 'yyyy-MM-dd');"
 * parameter(mod, objId)
 * 		mod: 3일 전 인 경우 -3, 7일 후인 경우 7
 * 		sObjId: 시작일 input box name
 * 		eObjId: 종료일 input box name
 * @param mod
*/
function setPeriodDateFormat(sPeriod, format, startDt){
	var sType = '', iPeriod = 0, sReturnDate = '';
	if(sPeriod != undefined && sPeriod != null && sPeriod.length > 0 ){
		sType = sPeriod.substring(sPeriod.length-1, sPeriod.length);
		iPeriod = parseInt(sPeriod);
	}
	if(format == undefined || format == null || format == '') format = 'yyyy-MM-dd';
	
	var baseDt;
	if(!isEmpty(startDt)) {
		startDt = onlyNumber(startDt);
		baseDt = new Date(startDt.substr(0,4), (startDt.substr(4,2) -1), startDt.substr(6,2));
	} else {	
		baseDt = new Date();
	}	
		
	if(sType == 'd'){
		sReturnDate = (new Date(baseDt.getFullYear(), baseDt.getMonth(), baseDt.getDate()+iPeriod)).format(format);
	}else if(sType == 'm'){
		sReturnDate = (new Date(baseDt.getFullYear(), baseDt.getMonth()+iPeriod, baseDt.getDate())).format(format);
	}else{
		sReturnDate = '';
	}		
		
	return sReturnDate;
}


/*
 * <p>시작일, 종료일을 날짜 유효성 체크</p>
 *
 * parameter(sObjId, eObjId, period, isRequired, msg)
 * 		sObjId: 시작일 input box name
 * 		eObjId: 종료일 input box name
 * 		period: 체크할 기간(일자로 입력)
 * 		isRequired : 필수입력여부(Y/N). default:Y 
 * 		msg: 메시지
 * @param mod
*/
function isValidPeriodDate(sObjId, eObjId, period, isRequired, msg){

	var startDt = $(sObjId);
	var endDt = $(eObjId);
	if(startDt) dStartDt = startDt.val().replace(/\-/gi,"").replace(/\./gi,"");///시작일
	if(endDt) dEndDt = endDt.val().replace(/\-/gi,"").replace(/\./gi,"");///종료일

	isRequired = nvl(isRequired,'Y');	
	
	if(msg == undefined) msg='';

	if(!checkDate(dStartDt, isRequired)){
		alert(msg+'시작일 입력값이 올바르지 않습니다.');
		startDt.focus();
		return false;
	}else if(isRequired == 'Y' && dEndDt == ""){
		alert(msg+'종료일을 입력해 주세요.');
		endDt.focus();
		return false;
	}
	else if(!checkDate(dEndDt, isRequired)){
		alert(msg+'종료일 입력값이 올바르지 않습니다.');
		endDt.focus();
		return false;
	}
	if(dStartDt != "" && dEndDt != ""){
		if(dStartDt > dEndDt){
			alert( msg+'시작일이 종료일보다 빠릅니다. 다시 입력해 주세요');
			startDt.focus();
			return false;
		}
	}
	if(period != ""){
		if(dEndDt - dStartDt > period){
			alert(msg+'기간은 최대 '+period+'일 까지 입력 가능합니다.');
			startDt.focus();
			return false;
		}
	}
	return true;
}

/// 날짜체크 함수
function checkDate(date, isRequired){
	if(isRequired == "N" && date == "")return true;
	
	else if(date.length == 8 && isAllNumber(date)){
		var pYear = date.substring(0, 4);
		var pMonth = date.substring(4, 6);
		var pDay = date.substring(6, 8);
		var compDate = new Date(pYear, (parseInt(pMonth.replace(/^0/, ""))-1), pDay);
		var year = compDate.getFullYear();
		var month = (compDate.getMonth() < 9 ? "0" + (compDate.getMonth() + 1) : (compDate.getMonth() +1) ) ;
		var day = (compDate.getDate() < 10 ? "0" + compDate.getDate() : compDate.getDate() ) ;
		var compDateStr = year+""+ month +""+ day;

		if(date != compDateStr){
			return false;
		}else{
			return true;
		}
	}else{
		return false;
	}
}

/*
 * 숫자체크(소수점 허용하지 않음)
 * 전체가 숫자로 이루어졌는지 체크
 */
function isAllNumber(x){
    var x;
    //var anum=/(^\d+$)|(^\d+\.\d+$)/;
    var anum=/(^\d+$)/;
    if (anum.test(x))
        return true;
    else{
        return false;
    }
}

/*
 * Xss 방지를 위한 '<' -> &lt; 로 변환 '>' -> '&gt;'로 변환
 * 전체가 숫자로 이루어졌는지 체크
 * 사용 XssFilter('<script>')
 */
var xssFilter = function(content){
	return content.replace(/</g,"&lt;").replace(/>/g,"&gt;").replaceAll(unescape('%u200B'),"&#8203;");
	//return content.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/*
 * db에 저장할때 사용
 */
var convertSourceToHtml = function(s){
	if (s != null && s != ""){
		s = s.replaceAll(";", "&#59;");
		s = s.replaceAll("&(?!lt;|gt;|aute;|quot;|#37;|#33;|#45;|#59;)",  "&amp;");
		s = s.replaceAll("<",  "&lt;");
		s = s.replaceAll(">",  "&gt;");
		s = s.replaceAll("\'", "&acute;");
		s = s.replaceAll("\"", "&quot;");
		s = s.replaceAll("\n", "<br>");
		s = s.replaceAll("%", "&#37;");
		s = s.replaceAll("_", "&#95;");
	}
	return s;
}

/*
 * db에서 가져와서 화면에 보여 줄대 사용
 */
var convertHtmlToSource = function(s){
	if (s != null && s != ""){
		s = s.replaceAll("&amp;",	"&");
		s = s.replaceAll("&lt;", 	"<");
		s = s.replaceAll("&gt;", 	">");
		s = s.replaceAll("&acute;", "\'");
		s = s.replaceAll("&quot;", 	"\"");
		s = s.replaceAll("<br>", 	"\n");
		s = s.replaceAll("&#59;", ";");
		s = s.replaceAll("&#37;", "%");
		s = s.replaceAll("&#95;", "_");
	}
	return s;
}

// 팝업
function popup_center(url,id, w, h, s, r) {
	 
	 width=screen.width;
	 height=screen.height;
	 
	 x=(width/2)-(w/2);
	 y=(height/2)-(h/2)-30;
	 
	 if(y < 0) y = 0;
	 
	 opt = "left=" + x + ", top=" + y + ", width=" + w + ", height=" + h;
	 opt = opt + ", toolbar=no,location=no,directories=no,status=no,menubar=no";
	 opt = opt + ",scrollbars=" + s;
	 opt = opt + ",resizable=" + r;
	 window.open(url,id, opt);
	 
}

function opener_popup_center(url,id, w, h, s, r) {
	 
	 width=screen.width;
	 height=screen.height;
	 
	 x=(width/2)-(w/2);
	 y=(height/2)-(h/2)-30;
	 
	 if(y < 0) y = 0;
	 
	 opt = "left=" + x + ", top=" + y + ", width=" + w + ", height=" + h;
	 opt = opt + ", toolbar=no,location=no,directories=no,status=no,menubar=no";
	 opt = opt + ",scrollbars=" + s;
	 opt = opt + ",resizable=" + r;
	 	 
	 if(opener == null) { // opener가 닫혔을 때 스크립트 에러 발생
		window.open(url,id, opt);	
	 } else {
	 	opener.window.open(url,id, opt);
	 }
}

/**
 * replace all 
 */
String.prototype.replaceAll = function(search,replace) {
	if(!search) return this;
	return this.replace(new RegExp(search,'g'), replace);
}

// 2023.12 정규식 미사용 replaceAllBySplit 추가 / P051230 / 고도화 프로젝트
// 위의 replaceAll 처리시 search에 정규식 특수문자(" .*+?^${}()|[] 등등 ")가 존재하면 제대로 replace가 안되어 추가 
String.prototype.replaceAllBySplit = function(search,replace) {
	return this.split(search).join(replace);
}

/**
 * 핸드폰번호 유효성 검사
 */ 
function isValidPhoneNum(phoneNum){
    var isValid = true;

    if(isEmpty(phoneNum)){
        alert("전화번호를 입력하십시요.");
        return false;
    }
    
    var regex=/^01(0|1|[6-9])[0-9]{7,8}$/;
    var arr = phoneNum.split(";");
    
    for(var i=0; i< arr.length; i++){
        if(!regex.test(arr[i])){
        	isValid = false;
            alert(arr[i]+"는 유효한 번호가 아닙니다.");
            return false;
        }
    }
    return true;
}

/**
 * SMS/MMS byte length 유효성 검사
 */ 
function alarmMsglength(type1, type2, content) {
	
	/*var maxByte = "80";
	
	if(type1=="SMS" && type2=="MSG_CTT"){
		maxByte = "80";
		//var cnt = document.main.msg_ctt;
	}
	if(type1=="MMS" && type2=="TITLE"){
		maxByte = "80";
		//var cnt = document.main.title;
	}
	if(type1=="MMS" && type2=="MSG_CTT"){
		maxByte = "2000";
		//var cnt = document.main.msg_ctt;
	}*/
	
	return getByte(content);
	
	/*var iByteLength = 0;
	for ( var i = 0; i < content.length; i++) {

		//var sChar = escape(cnt.value.charAt(i));
		
		
		var sChar = escape(content.charAt(i));

		if(iByteLength > maxByte - 2) {
			return iByteLength;
		}
		if (sChar.length == 1) {
			iByteLength++;
		} else if (sChar.indexOf("%u") != -1) {
			iByteLength += 2;
		} else if (sChar.indexOf("%") != -1) {
			iByteLength += sChar.length / 3;
		}
	}*/
}

/**
 * Byte수 체크
 * @param s
 * @returns {Number}
 */
function getByte(s) {
    var sum = 0;
    if (typeof s == 'undefined') return 0;
    var len = s.length;
    for (var i = 0; i < len; i++) {
        var ch = s.substring(i, i + 1);
        var en = escape(ch);

        if (en.length <= 4) {
            sum++;
        }
        else {
            sum += 2;
        }
    }
    return sum;
}


function sliceMaxLen(s, maxLen) {
    var sum = 0;
    if (typeof s == 'undefined') return 0;
    var len = s.length;
    var ch = 0;
    for (var i = 0; i < len; i++) {
         ch = s.charCodeAt(i);        
         var en = escape(ch);

        if (en.length <= 4) {
            sum++;
        }
        else {
            sum += 2;
        }
        
        if(sum > maxLen){
			return s.substring(0, i);
		}
    }       
    return s;
}

/**
 * 전체 인쇄 탭 인쇄
 * @param callBackFn
 * @returns 
 */
function printTabContent(tabIndex, printTitle, callBackFn){

	var browser = checkBrowser();
	
	// IE인 경우
	if(browser.indexOf('ie') > -1 || browser.indexOf('edge') > -1) {
		// 프로그래스 Start
		$('body').ctrlLoading();		
	} else {
		// 프로그래스 Start
		parent.$('body').ctrlLoading();		
	}

	var tab_html="";
	var tabcount = tabIndex;
	
	// !!! 전체인쇄시 이부분이 실행된다.
	if(tabIndex != undefined && typeof(tabIndex) == 'number' ) {
		
			// 선택한 탭인덱스를 변수에 저장
			var tidx=0;
			$("body").find("#tabDtlNmSpan li").each(function() {
				if($(this).attr('class') == 'on') {
					gPrintTabIndex = tidx; 
					return;
				}
				tidx++;
			});			

			//$('.view_content').each(function(){	
			for(var i=0; i<tabcount; i++){
				
				var tab_name = eval("tabTitleNm"+parseInt(i+1));
				var tab_content = eval("tabContent"+parseInt(i+1));				
				tab_html += tab_name+"<br><br>";
				tab_html += tab_content+"<br><br>";
	
				if(parseInt(i+1) != tabcount){
					if(checkBrowser()=='chrome') { // !! 크롬에서는 작동안하므로 페이지넘기기 안하고 그대로 붙여서 출력한다.
						tab_html += "<p/><p/>";	
					} else {
						//tab_html += "<p style='page-break-before: always'><br style='height:0;line-height:0'>";
						tab_html += "<div style='page-break-before: auto'>";	 // always -> auto:자동으로계산
					}
					 
				}
			}
			
			tab_name = eval("tabTitleNm"+parseInt(99));
			tab_content = eval("tabContent"+parseInt(99));				
			tab_html += tab_name+"<br><br>";
			tab_html += tab_content+"<br><br>";
			//}); 
	}
	// !!!!!! 현재화면 인쇄시 이 부분이 실행된다.
	else if(tabIndex != undefined && typeof(tabIndex) == 'string' ){			
		
		gPrintTabIndex = parseInt(tabIndex)-1; // 나중에 클릭한 탭 선택 상태로 가기 위해 변수에 저장					
		
		var tab_name = eval("tabTitleNm"+parseInt(tabIndex));
		var tab_content = eval("tabContent"+parseInt(tabIndex));		
		tab_html += tab_name+"<br><br>";
		tab_html += tab_content;

		if(checkBrowser()=='chrome') { // !! 크롬에서는 작동안하므로 페이지넘기기 안하고 그대로 붙여서 출력한다.
			tab_html += "<p/><p/>";	
		} else {
			//tab_html += "<p style='page-break-before: always'><br style='height:0;line-height:0'>";
			tab_html += "<div style='page-break-before: auto'>";	// always -> auto:자동으로계산
		}
	}
	
	////////////////////////////////////////////////////////////////////////////////////>S
	//# 프린트 워터마크 추가
	
	var _IEversion;
	
	if (navigator.appVersion.split('MSIE')[1]) {
		_IEversion = parseFloat(navigator.appVersion.split('MSIE')[1].split(';')[0].split(' ').join(''));
	}
	
	var html = "";
	var opt1 = ' width="600" height="500" ';
	var opt2 = ' width="750" height="500" ';
	var pos1 = ' y="100" x="0" ';
	var pos2 = ' y="350" x="0" ';
	var text = G_LOGINID;
	if(text == null || text == ""){
		var opt1 = ' width="900" height="600" ';
		text = "SK Telecom";
	}	
	
	var date = new Date();

	if(_IEversion < 10){
		//console.log("IE 9 이하...");
	}else{
		html = "";
		html += '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="left:0px;top:0px;right:0px;bottom:0px;position:fixed;z-index:9999;pointer-events:none">';
		html += '<defs>';
		//사번
		html += '<pattern id="textstripe" patternUnits="userSpaceOnUse" '+opt1+' patternTransform="rotate(-20)">';
		html += '<text '+pos1+' font-size="120" style="color:#000;opacity:0.04;font-family:\'맑은 고딕\', \'나눔 고딕\', Dotum, \'droid sans fallback\', \'AppleGothic\', sans-serif">'+text+'</text>';
		html += '</pattern>';
		//날짜
		html += '<pattern id="textstripe2" patternUnits="userSpaceOnUse" '+opt2+' patternTransform="rotate(-20)">';
		html += '<text '+pos2+' font-size="120" style="color:#000;opacity:0.04;font-family:\'맑은 고딕\', \'나눔 고딕\', Dotum, \'droid sans fallback\', \'AppleGothic\', sans-serif">'+getFormatDate(date)+'</text>';
		html += '</pattern>';
		html += '</defs>';
		html += '<rect width="100%" height="100%" fill="url(#textstripe)" />';
		html += '<rect width="100%" height="100%" fill="url(#textstripe2)" />';
		html += '</svg>';
	}

	tab_html += html;
		
////////////////////////////////////////////////////////////////////////////////////>E	
	
	$("#printHtml").html(tab_html);
	
	printPreview("printHtml",printTitle,callBackFn);
	
}

////////////////////////////////////////////////////////////////////////////////////>S
var getFormatDate = function(date){
	var year = date.getFullYear();
	var month = (1 + date.getMonth());
	month = month >= 10 ? month : '0' + month;
	var day = date.getDate();
	day = day >= 10 ? day : '0' + day;

	return  year + '-' + month + '-' + day;
}
////////////////////////////////////////////////////////////////////////////////////>E


function postUpOnCreationForMobile() {
		
	if(!isEmpty(atfilList) && $("#uploadHolder")){
			$("#dext5thumbdownloadDiv").html("");
			
			var htmlAtfilListTag = '<div id="DEXT_fiVe_UP_file_temp" class="DEXT_fiVe_UP_uploadbox_txt" style="position:relative; overflow-y:scroll; height:88px" tabindex="-1">';
			htmlAtfilListTag += '<ol id="file_list" class="">';
			for(var f in atfilList){
				//console.log('savePathNm:'+domainStr+atfilList[f].savePathNm+' fileId:'+atfilList[f].fileId);
				var enctyptSavePathNm = escape(atfilList[f].enctyptSavePathNm);
		        var atfilNm = escape(atfilList[f].atfilNm);
		        
				if(atfilList[f].fileClCd == '02'){//세일즈컨텐츠 썸네일
					var imgTag = "<img id='thumbNailImgTag' src=/iface/streamFile.do?filePath="+enctyptSavePathNm+" alt='"+atfilList[f].atfilNm+"' width='60' height='80'>";
					
					$("#dext5thumbdownloadDiv").append(unescape(imgTag));
				}else{
					// 실제 서버상의 파일을 작성합니다.
			        var ext = (atfilList[f].atfilNm).substring((atfilList[f].atfilNm).lastIndexOf(".")+1);
			        var kbSize = (atfilList[f].atfilSize/1024).toFixed(2);
			        
			        htmlAtfilListTag += '<li style="line-height:1.8">'+
											  '<ul class="border_none" style="color:#000;font-size: 12px;font-family: dotum,돋움,tahoma,sans-serif;">'+
											  '<li class="fname" style="width:557px;float:left;"><img src="/resource/common/dext5upload/images/'+getDext5IconName(ext)+'.png" alt="'+ext+'" style=""><span title="'+atfilList[f].atfilNm+'" style="color: rgb(50, 50, 49);padding:3px 10px 2px 10px;"><a href="javascript:callMobileFileViewer(\''+ enctyptSavePathNm+'\',\''+ atfilNm+'\',\''+ nvl(atfilList[f].atfilSize,"0")+'\')">'+atfilList[f].atfilNm+' </a></span></li>'+
											  '<li class="fsize" style="display: block; right: 0px; color: rgb(50, 50, 49); border-left-width: 1px;float:right;"><span name="DEXT_fiVe_UP_fsize" title="'+kbSize+' KB">'+kbSize+' KB</span></li>'+
											  '</ul>'+
											  '</li>';
				}
			}
			
			htmlAtfilListTag += '</ol>';
		htmlAtfilListTag += '</div>';
		$("#uploadHolder").html(htmlAtfilListTag);			
		}
}
 	

function getDext5IconName(ext){
	var returnExtName = "";
	if(ext.length > 3){
		if(ext == "html"){
			returnExtName = ext;
		}
		else if(ext == "jpeg"){
			returnExtName = "jpg";
		}
		else{
			returnExtName = ext.substring(0,3);	
		}
	}
	else{
		returnExtName = ext;
	}
	return returnExtName;
}

function callMobileFileViewer(enctyptSavePathNm, atfilNm, atfilSize){

	if(Number(atfilSize) > (2 * 1024 * 1024)){//모바일에선 2M 조회제한
		alert("모바일에서는 2MB이상 조회가 제한됩니다.");
		return false;
	} 
	
	 var arr = {};
	 arr.mid = "CMS";
	 arr.userId = G_USERID;
	 arr.filePath = unescape(enctyptSavePathNm);
	 arr.fileName = unescape(atfilNm);
	 //alert(JSON.stringify(arr))
	 
	 var jsonStr = JSON.stringify(arr);
	 window.swingtm.callSwingJS("polarisOffice", jsonStr);
}


function commonNaviPopup(obj, goUrl, width, height, targetName){
	obj.attr("method","POST");
	
	if(G_MOBILEHIDE == "mobile_hide"){    		
		obj.attr("action",goUrl).submit();
	}
	else{
		if(pop == null || pop.closed){
	    	pop = popup_center("",targetName,width,height,'yes','yes');
	    	obj.attr("target",targetName);
	    	obj.attr("action",goUrl).submit();
	    }
	    else
	        pop.focus();
	}	
}

function commonNaviOpenerPopup(obj, goUrl, width, height, targetName){
	obj.attr("method","POST");
	
	if(G_MOBILEHIDE == "mobile_hide"){    		
		obj.attr("action",goUrl).submit();
	}
	else{
		if(pop == null || pop.closed){
	    	pop = opener_popup_center("",targetName,width,height,'yes','yes');
	    	obj.attr("target",targetName);
	    	obj.attr("action",goUrl).submit();
	    }
	    else
	        pop.focus();
	}	
}

function callBackOpenerPopup(){
	
	if(typeof(privateCallBackOpenerPopup) == 'function' ) {
		privateCallBackOpenerPopup();
	}else if(typeof(getList) == 'function' ) {
		getList(1);
	}else{
	}	
}

/*
 * namo 데이터인지 체크
 */
function dextEditorNamoChk(data) {

	var tempData = data.toLowerCase();
	
	if(tempData.indexOf("activesquare") > -1){
		dext_chk = true;
	}else{
		dext_chk = false;
	}
}

//excel 파일 다운로드
function downloadExcel(url, data, errorMsg) {
    if(url) {
        var inputs = '';
        $.each(data, function(key,value){
            inputs+='<input type="hidden" name="'+ key +'" value="'+ value +'" />';
        });

        // request를 보낸다.
        var formObj = $('<form action="'+ url +'" method="'+ 'post' +'">'+inputs+'</form>');
        formObj.appendTo('body');
        
        formObj.submit(function(event){
            $('body').ctrlLoading();
            
            $.ajax({
                  url      : url
                , method   : 'POST'
                , async: true
                , data     : data
                , contentType : 'application/x-www-form-urlencoded; charset=UTF-8'
                , processData: true
                , success  : function(data) {
                	$('body').ctrlLoading();	                	
                }
                , error : function(jqXHR, textStatus, errorThrown) {
                	$('body').ctrlLoading();
                	AjaxError(jqXHR, textStatus, errorThrown, errorMsg);
                }
            });  
        });
        
        formObj.submit().remove();
    };
};

// 브라우저체크
function checkBrowserType() {
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

// 2019-07-04 Validation Check - text input 길이제한 - P126820 김나리
function inputLengthCheck(eventInput) {
	var inputText = $(eventInput).val();
	var inputMaxLength = $(eventInput).prop("maxlength");
	
	var j = 0;
	var count = 0;
	
	for(var i = 0; i < inputText.length; i++) {
		val = escape(inputText.charAt(i)).length;
		
		if(val == 6) {
			j++;
		}
		
		j++;
		
		if(j <= inputMaxLength) {
			count++;
		}
	}
	
	if(j > inputMaxLength) {
		$(eventInput).val(inputText.substr(0, count));
		$(eventInput).trigger("onkeyup");
	}
}

// 2019-07-04 Validation Check - text input 길이제한 - P126820 김나리
function inputLengthDraw(eventInput) {
	var inputText = $(eventInput).val();
	
	var j = 0;
	var count = 0;
	
	for(var i = 0; i < inputText.length; i++) {
		val = escape(inputText.charAt(i)).length;
		
		if(val == 6) {
			j++;
		}
		
		j++;
	}
	
	var emId = $(eventInput).prop("id") + "Byte";
	$(document.getElementById(emId)).text("/ " + j + "byte");
	
}

// 2021-05-27 전화번호 자동완성 - P126820 김나리
function inputSvcPhonNum(eventInput) {
	var str = $(eventInput).val();
	str = str.replace(/[^0-9,*]/g, '');

    var tmp = '';
    
    var result = str;

    if(str.length < 4) {
    	result = str;
    }
    else if(str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        
        result = tmp;
    }
    else if(str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);

        result = tmp;
    }
    else {              
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);

        result = tmp;
    }
    
    $(eventInput).val(result);
}

// 2023.12 클릭 로그 CLOSE 함수 정의 / P051230 / 고도화 프로젝트
function initCloseClkLog(logSerNum){
	
	//ie가 아니면 self.close가 beforeunload를 인식못해 close 재정의
	if(checkBrowserType().indexOf("ie") < 0){
 		var ovr_close = window.close;
	 	window.close = function (){
			fnRgstCloseClkLog(logSerNum).then(function () {
				setTimeout(function(){
					ovr_close();
				}, 100);
			});
			
	 	}
	}
 	
 	// 팝업창을 닫을 때 클릭 로그 CLOSE 시간 기록
	window.addEventListener('beforeunload', function(event) {
		fnRgstCloseClkLog(logSerNum).then(function () {});
	});
}

// 2023.12 promise 추가 / P051230 / 고도화 프로젝트
function fnRgstCloseClkLog(logSerNum) {
	
	//console.log('fnRgstCloseClkLog start');			
	var deferred = $.Deferred();
	
	rgstCloseClkLog(logSerNum);
		
	deferred.resolve();	
	//console.log('fnRgstCloseClkLog end');
	
	return deferred.promise();
	
}

// 2023.12 팝업창을 닫을 때 클릭 로그 CLOSE 시간 기록 / P051230 / 고도화 프로젝트
function rgstCloseClkLog(logSerNum) {
		
	var paramData = {};
	
	//logSerNum이 없는 경우는 기록하지 않고 종료
	if ( isEmpty(logSerNum) ){
		return;
	}

	paramData.logSerNum	= logSerNum;

	$.ajax({
		url      : '/front/contents/rgstCloseClkLog.ajax'
		, method   : 'GET'					//크롬,엣지는 정상, 익스에서는 CLOSE시 POST로 하면 async를 true로 하면 logSerNum이 전달이 안됨. GET으로 수정
		, data     : paramData
		, dataType : 'json'
		, async    : true
		, traditional : true
		, success  : function(data) {						
			//var rsInt = data.rsInt;		//	결과
			//console.log("rgstCloseClkLog resultVal:" + resultVal);
		}
		, error : function(jqXHR, textStatus, errorThrown) {
			console.log("rgstCloseClkLog 실패");
			//AjaxError(jqXHR, textStatus, errorThrown, errorMsg);
		}
	});
		
}

// 2023-08-01 컨텐츠 단위변경 P126820 김나리
// 해당 값이 정상적인 값인지 체크
function isNotValue(value) {
	var result = false;
	
	if(value == null || typeof value == "undefined") result = false;
	else if(value == "")  result = false;
	else result = true;
	
	return result;
}