/**
 * Form Object Plugin
 * Form 객체를 생성하여 기본적인 유효성 체크를 수행한다.
 * 
 * Form element 객체 설정 내용 : 배열로 구성함.
 *	{elements : [    
 *	    {  id       : 영문명 (태그상에서는 id, name 동일)
 *	     , name     : 한글명 (validation 체크시 알림시 사용)
 *	     , type     : 데이터타입 : string, number, date, time, datetime, tel, mobile, email, url, kor, eng
 *	     , value    : 데이터 초기값 : 미정의시 빈문자열로 자동설정 ('')
 *	     , required : 필수여부 :true/false
 *	    },
 *	    {},{}.....
 *	]} 
 * 
 * 
 * 
 */

;(function($){
	
	var regExp = {
			  string    : /.+/ // 문자열
			, number    : /^[\d]*$/ // 숫자
			, date      : /^(\d{1,4})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/           // 날짜 YYYYMMDD
			, time      : /^(0[0-9]|1[0-9]|2[0-4])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])$/ // 시간 hhmmss
			, datetime  : /^(\d{1,4})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-4])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])$/ // 날짜시간 YYYYMMDDhhmmss
			, tel       : /^(0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70))(\d{3,4})(\d{4})$/   // 일반전화
			, mobile    : /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/         // 모바일
			, email     : /^[._\da-zA-Z-]+@[\da-zA-Z-]+(.[_\da-zA-Z-]+)*$/          // 이메일
			, url       : /^(https?:\/\/|\/){1}[^\/\/][a-z0-9-+&@#\/%?=~_|!:,.;]*/ // url
			, kor       : /^[ㄱ-ㅎ|가-힣|\d|_?~!@#$%^&*]*$/ // 한글,숫자전용,밑줄(_),특수문자(?~!@#$%^&*)
			, eng       : /^[\w_?~!@#$%^&*]*$/              // 영문,숫자전용,밑줄(_),특수문자(?~!@#$%^&*)
		};
	
	// 로그인후 권한별로 메뉴리스트 객체 구성
	$.fn.createForm = function(options){
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createForm.base, options);
		
		init(opts);
		
		/* public function List */
		
		this.setOptions = function(userOptions){
			opts = $.extend({}, opts, userOptions);
			init(opts);
			
			return this;
		};
		
		
		this.reload = function(userOptions){
			this.setOptions(userOptions);
			
			return this;
		};
		
		this.validate = function(){
			var result = true;
			$.each(opts.elements, function(index,element){
				//console.log(index);
				if(!validateElement(element)) {
					result = false;
					
					return false;// each 문 중단 (true:continue, false:break)
				}
			});
			
			return result;
		};
		
		this.reset = function(){
			$.each(opts.elements, function(index,element){
				var ele = $('#'+element.id);
				ele.val(element.value);
			});
			
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	

	/* private function List */
	function init(opts){
        if(opts.elements == null || opts.elements.length == 0){
    	   alert('Form 객체의 요소설정 정보가 존재하지 않습니다.');
    	   return;
        }
        
        // 최소 유효성 체크 및 기본값 설정 : id,name은 존재해야 함.
        $.each(opts.elements, function(index,element){
    		var id        =  element.id;        // 영문명 (태그상에서는 id, name 동일)
    		var name      =  element.name;      // 한글명 (validation 체크시 오류 알림메세지사용)
    		var type      =  element.type;      // 데이터타입 : string, number, date, time, datetime, tel, mobile, email, url, kor, eng
    		var value     =  element.value;     // 초기값
    		var required  =  element.required;  // 필수여부 : true/false
    		
    		if(id == 'undefined' || $.trim(id) == ''){
    			alert('id가 설정되지 않은 요소가 존재합니다.');
    			return false;
    		}
    		
    		if(name == 'undefined' || $.trim(name) == ''){
    			alert('name이 설정되지 않은 요소가 존재합니다.');
    			return false;
    		}
    		
    		if(type == 'undefined' || $.trim(type) == ''){    
    			element.type = 'string';
    		}

    		if(required == 'undefined' || $.trim(required) == ''){
    			element.required = false;
    		}
    		
    		if(value == 'undefined' || $.trim(value) == ''){
    			element.value = '';
    		}
    		else{ // 기본값설정
    			var ele = $('#'+element.id);
				ele.val(element.value);
    		}
    		
    		return true;
		});
        
	}
	
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
    
	function validateElement(element){
		var id        =  $.trim(element.id);        // 영문명 (태그상에서는 id, name 동일)
		var name      =  $.trim(element.name);      // 한글명 (validation 체크시 오류 알림메세지내용 사용)
		var type      =  $.trim(element.type);      // 데이터타입 : string, number, date, time, datetime, tel, mobile, email, url, kor, eng
		var value     =  $.trim(element.value);     // 초기값
		var maxlength =  $.trim(element.maxlength); // 최대바이트길이
		var minlength =  $.trim(element.minlength); // 최소바이트길이
		var required  =  element.required;          // 필수여부 : true/false
		
		var ele = $('#'+id);
		value = ele.val();

		//console.log("id: " + id + "| name: " + name +"| type: " + type + "| value: " + value +"| required: " + required );
		
		var patt;
		switch(type){
			case 'string':  patt = regExp.string;
							if(!patt.test(value)  && required){
								alert(name + ' 항목은 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
				          break;				          
				          
			case 'number':  patt = regExp.number;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 숫자 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 숫자타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
						  break;
				          
			case 'date':  patt = regExp.date;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 날짜 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 날짜(YYYYMMDD) 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;					          

			case 'time':  patt = regExp.time;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 시간 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 시간(hhmmss) 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
							break;			
							
			case 'datetime':  patt = regExp.datetime;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 날짜시간 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 날짜시간(YYYYMMDDhhmmss) 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;				
				          
			case 'tel':  patt = regExp.tel;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 유선번호 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 유선번호 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;					     
				          
			case 'mobile':  patt = regExp.mobile;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 무선번호 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 무선번호 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;					  
          
			case 'email':  patt = regExp.email;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 이메일 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 이메일 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;					  
          
			case 'url':  patt = regExp.url;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 URL 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 URL 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;					  	          
          
			case 'kor':  patt = regExp.kor;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 한글,숫자 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 한글,숫자 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;		
          
			case 'eng':  patt = regExp.eng;
							if((value == 'undefined' || value == '') && required){
								alert(name + ' 항목은 영문,숫자 타입의 필수입력 항목입니다.');
								ele.focus();
								return false;
							}
							else if(!(value == 'undefined' || value == '') && !patt.test(value)){
								alert(name + ' 항목타입이 영문,숫자 타입이 아닙니다.');
								ele.val('');
								ele.focus();
								return false;
							}
				          break;	
		    default : 
		    	     return true;
		}
		
		if(! isEmpty(maxlength) && getByte(value) > maxlength) {
			alert(name + ' 항목이 입력제한('+maxlength+'byte)을 초과했습니다.('+getByte(value)+'byte)');
			return false;
		}
		if(! isEmpty(minlength) && getByte(value) < minlength) {
			alert(name + ' 항목이 최소입력('+minlength+'byte)에 미달했습니다.('+getByte(value)+'byte)');
			return false;
		}		
		
		return true;
	}

	/* Default Setting Value Object */
	
	// createForm Default Option Value
	$.fn.createForm.base = {elements :[] };
	
})(jQuery);


////////////////////////////////////////////////////////////////////////////////////>S
/**
 * 워터마크 태그 html 리턴
 */
function getWatermarkTag() {

	var _IEversion;
	if (navigator.appVersion.split('MSIE')[1]) {
		_IEversion = parseFloat(navigator.appVersion.split('MSIE')[1].split(';')[0].split(' ').join(''));
	}
	
	var html = "";
	var opt1 = ' width="920" height="500" ';
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
		html += '<text '+pos1+' font-size="120" style="color:#000;opacity:0.02;font-family:\'맑은 고딕\', \'나눔 고딕\', Dotum, \'droid sans fallback\', \'AppleGothic\', sans-serif">'+text+'</text>';
		html += '</pattern>';
		//날짜
		html += '<pattern id="textstripe2" patternUnits="userSpaceOnUse" '+opt2+' patternTransform="rotate(-20)">';
		html += '<text '+pos2+' font-size="120" style="color:#000;opacity:0.02;font-family:\'맑은 고딕\', \'나눔 고딕\', Dotum, \'droid sans fallback\', \'AppleGothic\', sans-serif">'+getFormatDate(date)+'</text>';
		html += '</pattern>';
		html += '</defs>';
		html += '<rect width="100%" height="100%" fill="url(#textstripe)" />';
		html += '<rect width="100%" height="100%" fill="url(#textstripe2)" />';
		html += '</svg>';
	}
	
	return html;
}	
////////////////////////////////////////////////////////////////////////////////////>E



/**
 * 워터마크 표시
 */
function displayWatermark() {
    //워터마크
	if(typeof typeOfIframe === 'undefined' || typeOfIframe == false) {
	    var watermark_text = G_LOGINID;
	    UI.fn.watermark(watermark_text);		
	}	
}

window.onload = displayWatermark;
