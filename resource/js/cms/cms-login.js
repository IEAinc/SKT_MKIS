/**
 * 전자서식관리 시스템 로그인 과정에서 사용하는 함수
 * 
 * AES, RSA 암호화 로직 추가
 */

/**
 *  패스워드 유효성 체크
 */
var checkPWD = function(text){
	// 패스워드 길이 9자리 이상
	if(text.length < 9){
		alert('패스워드 길이는 9자리 이상 입력하셔야 합니다.');
		return false;
	}
	
	var regExp = new Array();
	// 공백체크 
	regExp[0] = { pattern : /\s/	, message : '공백이 입력되었습니다.' }; 
	// 영문자 및 숫자,밑줄(_), 특수문자(?~!@#$%^&*) 이외 체크
	regExp[1] = { pattern : /[^\w_?~!@#$%^&*]/	, message : '영문자,숫자,밑줄(_),특수문자(?~!@#$%^&*)만 입력가능합니다.' };
	// 동일한 영문자/숫자가 연속 4번 입력
 	regExp[2] = { pattern : /(\w)\1\1\1/	, message : '동일한 영문자/숫자가 연속 4번 입력되었습니다.'	};
 	
    // 대소영문자  조합여부
 	regExp[3] = { pattern : /[a-zA-Z]/	     , message : '영대문자, 영소문자 중 반드시 하나이상 조합되어야 합니다.' }; 
    // 숫자  조합여부
	regExp[4] = { pattern : /[\d]/	         , message : '숫자는 반드시 하나이상 조합되어야 합니다.' };  
	// 특수문자 조합여부 
	regExp[5] = { pattern : /[_?~!@#$%^&*]/ , message : '특수문자(_?~!@#$%^&*)중 반드시 하나이상 조합되어야 합니다.' };  
	
 	
 	var chk = true;
	for( var i in regExp){
		var patt = regExp[i].pattern;
		if(i <3 && patt.test(text)){
			//alert("\'" + patt.exec(text) + "\' 문자는 사용할수 없습니다.\n" + regExp[i].message);
			alert(regExp[i].message);
			chk = false;
			break;
		}
		else if(i >2 && !patt.test(text)){
			alert(regExp[i].message);
			chk = false;
			break;
		}
		
	}
	
	//  연속문자열 체크
	if(chk){
		chk = checkContinueChar(text,4);
	}
	
    return chk;
};


/**
 * 연속문자열 체크
 * text        : 체크할 문자열
 * continueCnt : 연속문자열 크기
 */
var checkContinueChar = function(text, continueCnt){
	
	if(continueCnt == undefined || isNaN(continueCnt) ||continueCnt < 2){
		alert('연속 문자열 크기는  최소 2자리 이상이어야 합니다.');
		return false;;
	}
	
	if(text == undefined || text == '' || text.length < continueCnt){
		alert('체크할 문자열은 점검할 연속 문자열 크기보다 크거나 같아야 합니다.');
		return false;;
	}
	
	var baseString = {
		upper :	'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, (26 - continueCnt +1)),
		lower : 'abcdefghijklmnopqrstuvwxyz'.substring(0, (26 - continueCnt +1)),
		digit : '0123456789'.substring(0,(10 - continueCnt +1))
	};
	
	/*alert(baseString.upper);
	alert(baseString.lower);
	alert(baseString.digit);*/
	
	var strCnt = continueCnt -1;   // 연속문자구성시 추가할 문자갯수
	var max = text.length - strCnt; // 검증할 문자열의 검증최대길이
	
	for(var i=0;i<max;i++){
		var chkStr = text.substring(i,i+1);
        var chkAsciiChar = chkStr.charCodeAt(0); // 연속문자열 체크 첫문자의 아스키코드값
        //alert(chkStr + " : " + chkAsciiChar);
		if(baseString.upper.indexOf(chkStr)>-1       // 영문대문자 체크
			|| baseString.lower.indexOf(chkStr)>-1   // 영문소문자 체크
			|| baseString.digit.indexOf(chkStr)>-1 ){ // 숫자체크
			
			for(var j=1;j<=strCnt;j++){
				chkStr += String.fromCharCode(chkAsciiChar + j);
			}
			//alert(chkStr);
			var patt = new RegExp(chkStr);
			if(patt.test(text)){
				alert(chkStr + '의 연속된 문자열이 존재합니다.');
				return false;
			}
		}
		else continue;
	}
	return true;
};

/**
 * Stop Watch 객체
 * 
 * @param obj 타이머 객체
 * @param seconds 대기시간
 * @param callback 타임아웃시 수행할 함수
 * @returns
 */
var _StopWatchTimer = null;
var StopWatch = function(obj, seconds,callback){
	
	if(obj == undefined || typeof obj != 'object'){
		alert('타이머 객체를 설정해 주십시요.');
		return false;;
	}
	
	if(seconds == undefined || isNaN(seconds) ||seconds > 3599){
		alert('올바른 제한시간을 설정해주십시요. [1시간미만(3599)]');
		return false;;
	}
	
	if(callback == undefined || typeof callback != 'function'){
		alert('타임아웃시 수행할 함수를 설정해주십시요');
		return false;;
	}
	
	this.createWatch = function(){
		if(_StopWatchTimer != null){
			alert('현재 타이머가 사용중입니다.');
			return false;
		}
		
		_StopWatchTimer = setInterval(function(){
			seconds -= 1;
			if(seconds > -1){
				var min = parseInt(seconds/60);
				var sec = parseInt(seconds%60);
				obj.html((min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec);
			}
			else{
				obj.html('00:00');
				clearInterval(_StopWatchTimer);
				_StopWatchTimer = null;
				
				callback();
			}
		},1000);
	};
	
	this.clearWatch = function(){
		//alert('clearWatch');
		if(_StopWatchTimer != null) {
			clearInterval(_StopWatchTimer);
			_StopWatchTimer = null;
		}
	};
	
	return this;
};

/********************************************************************
 * AES/RSA 암호화 관련 함수
 * 
 * 사이트내 로그인시 사용하는 기능만 구현
 * 
 *******************************************************************/

/**
 * AES/RSA 암호화 처리
 * @param plainText
 * @param m
 * @param e
 * @returns {@G}
 */
var EFMEncrypt = function(plainText,m,e){
	
	var securKey = "";  // AES 암호화 key
	var cipherTextStr = "";  
	var cipherText = new Array();

	// AES 암호화 key 생성 : 128bits (16bytes)
	var i;
    var bytes = new Array();
    for (i=0; i<16; i++)
    	bytes[i] = Math.round(Math.random()*127); // 아스키코드범위내로 제한
    
    securKey = byteToString(bytes);
    //console.log('생성된 securKey : [' + securKey + ']');
    
	// 암호화 할 문자열 스페이스 패딩 처리
    var j;
	var nCount = 16 - (plainText.length % 16);
	for (j=0;j<nCount;j++) 
		plainText += ' ';
	//console.log('plainText : [' + plainText + ']');
	
	// 배열로 변환
	plainText = plainText.split("");

	var k;
    for (k=0; k<plainText.length; k++)
    	plainText[k] = plainText[k].charCodeAt(0) & 0xFF;
    
	
	// expandedKey 생성
	var expandedKey = new keyExpansion(securKey);
	//console.log('expandedKey : [' + expandedKey + ']');
	
	// 암호화된 바이트배열 생성
	var aBlock;
	for (var block=0; block<plainText.length / 16; block++) {
	    aBlock = plainText.slice(block*16, (block+1)*16);
	    cipherText = cipherText.concat(AESencrypt(aBlock, expandedKey));
	}
	//console.log('cipherText : [' + cipherText + ']');
	
	// AES 암호키 암호화
	var rsa = new RSAKey();
    rsa.setPublic(m,e);

    var aesKey = rsa.encrypt(securKey);
    //console.log('aesKey : [' + aesKey + ']');
    
	this.securKey   = $.base64.encode(hexToString(aesKey));      // 암호키
	this.cipherTextStr = $.base64.encode(byteToString(cipherText));  // ID+PWD
	
	return this;    
}

var AdminEncrypt = function(id,pwd,m,e){
	var plainText = id + "|" + pwd;
	
	return EFMEncrypt(plainText,m,e)
}



