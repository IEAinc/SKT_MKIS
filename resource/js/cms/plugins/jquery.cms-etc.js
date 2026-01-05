/**
 * Checkbox Generate Plugin
 * 
 * 1. createCombo(options)
 * 일반 콤보 구성.
 * 
 * default options {
 * 			   url: ''
 *   		 , param: ''
 *  		 , listName: ''
 *   		 , returnInfo:{CODE: 'CODE' , VALUE: 'VALUE' } 
 *   		 , optionType : 'N'              
 *   		 , valueType  : 'V'
 *           , defaultVal : ''
 * 			}
 * 
 * url        : 조회 URL 정보
 * param      : 조회시 필요한 파라미터 값 객체
 * listName:  : 조회후 결과값 리스트의 Key 값 정보
 * returnInfo :{CODE: , VALUE: } -> 결과 리스트상에서 select 객체의 Text/Code 값의 Key값 정보
 * optionType : 옵션객체 첫항목 추가설정 ( 전체(A)/선택(S)/ALL없이 나오게(E) /없음(N)  )
 * 
 * --------------------------------------------------
 * 2. createCommCheckbox(groupId,optionType,id,callbackFunc)
 * groupId,optionType,id
 * 공통코드 전용
 * 
 * groupId    : 공통코드 그룹ID
 * optionType : 옵션객체 첫항목 추가설정 : 전체(A)/선택(S)/ALL없이 나오게(E) /없음(N) 
 * id  : 체크박스객체 생성시 지정할 ID,NAME속성
 * callbackFunc : 클릭시 콜백펑션
 */

;(function($){
	
	$.fn.createCommCheckbox = function(groupId,optionType,id,callbackFunc,successCb) {
		// 공통코드용 설정값 설정
		var commOpts = {
		      url: '/common/codeList.ajax' 
			, param: {groupId :groupId} 
			, listName: 'codeList'
			, returnInfo:{CODE: 'code', VALUE: 'value'}
			, optionType : optionType    
			, id : id
			, callbackFunc: callbackFunc
			, successCb:successCb
		};		
		
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createCommCheckbox.base, commOpts);
		
		// 유효성 체크
		validate(opts);
		
		/* public function List */
		
		this.load = function(defaultVal){
			generateCheckbox(this,opts);
			return this;
		};
		
		/*this.setOptions = function(userOptions){
			opts = $.extend({}, opts, userOptions);
			validate(opts);
			return this;
		};
		
		this.clear = function(){
			$('option', this).remove();
			return this;
		};
		
		this.reload = function(userOptions){
			this.setOptions(userOptions);
			
			$('option', this).remove();
			
			generateCombo(this,opts);
			return this;
		};*/
		
		/* Default Return */
		return this.each(function(){
			
		});		
	} 
	
	// 직접 조회데이터를 이용한 체크박스객체 구성
	$.fn.createNonCommCheckbox = function(param,optionType,id,callbackFunc,successCb,url) {
		// 공통코드용 설정값 설정
		var commOpts = {
		      //url: '/common/codeList.ajax' 
			  url: url
			, param: param 
			, listName: 'codeList'
			, returnInfo:{CODE: 'code', VALUE: 'value'}
			, optionType : optionType    
			, id : id
			, callbackFunc: callbackFunc
			, successCb:successCb
		};		
		
		if(typeof param.async != "undefined") {
			commOpts.async = param.async;
		}
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createCommCheckbox.base, commOpts);
		
		// 유효성 체크
		validate(opts);
		
		/* public function List */
		
		this.load = function(defaultVal){
			generateCheckbox(this,opts);
			return this;
		};
		
		/*this.setOptions = function(userOptions){
			opts = $.extend({}, opts, userOptions);
			validate(opts);
			return this;
		};
		
		this.clear = function(){
			$('option', this).remove();
			return this;
		};
		
		this.reload = function(userOptions){
			this.setOptions(userOptions);
			
			$('option', this).remove();
			
			generateCombo(this,opts);
			return this;
		};*/
		
		/* Default Return */
		return this.each(function(){
			
		});		
	} 	
	
	// Options Validate
	function validate(opts){		
		if(opts == "undefined" || opts == "" || opts == null){
			alert("createCheckbox options 객체가 설정되지 않았습니다.");
			return;
		}
		else if(opts.id == "undefined" || opts.id == "" || opts.id == null){
			alert("createCheckbox options 객체의 id가 설정되지 않았습니다.");
			return;
		}		
		else if(opts.url == "undefined" || opts.url == "" || opts.url == null){
			alert("createCheckbox options 객체의 url이 설정되지 않았습니다.");
			return;
		}
		else if(opts.listName == "undefined" || opts.listName == "" || opts.listName == null){
			alert("createCheckbox options 객체의 리스트 객체명이 설정되지 않았습니다.");
			return;
		}
		else if(opts.returnInfo == "undefined" || opts.returnInfo == "" || opts.returnInfo == null){
			alert("createCheckbox options 객체의 리스트내의 객체정보가 설정되지 않았습니다.");
			return;
		}
		else if(opts.returnInfo.CODE == "undefined" || opts.returnInfo.CODE == "" || opts.returnInfo.CODE == null){
			alert("createCheckbox options 객체의 리스트내의 객체정보의 CODE가 설정되지 않았습니다.");
			return;
		}
		else if(opts.returnInfo.VALUE == "undefined" || opts.returnInfo.VALUE == "" || opts.returnInfo.VALUE == null){
			alert("createCheckbox options 객체의 리스트내의 객체정보의 VALUE가 설정되지 않았습니다.");
			return;
		}
	}
	
	// 체크박스를 구성할 데이터를 조회후 체크박스구성
	function generateCheckbox(obj,opts){
		$.ajax({
	          url    : opts.url
	        , method : 'POST'
	        , data   : opts.param
	        , dataType : 'json'
	        , async  : (typeof opts.async != "undefined" ? opts.async : true) // jquery ajax의 async default = true
	        , success:function(data){
	        	// 기존 객체 삭제
	        	obj.empty();
	        	
	        	//var options = new Array() ; 
    			var callbackFunc = opts.callbackFunc;
    			if(!(callbackFunc == "undefined" || callbackFunc == "" || callbackFunc == null)) {
    				callbackFunc = "onclick='"+callbackFunc+"(this)'";
    			}
	        	
	    		if(opts.optionType == 'A' || opts.optionType == 'S'){
	    			obj.append("<label class='label_check'><input type='checkbox' name='"+opts.id+"' id='"+opts.id+"' value='' "+callbackFunc+"><i></i><em>전체</em></label>");
	    		}
	        	
	        	var list = data[opts.listName];
	        	
	        	if(list.length < 1) {
	        		return obj;
	        	}
	        	
	        	var successCb = opts.successCb;
	        	if(typeof successCb == "function"){
	        		return successCb(obj, opts.id, list, callbackFunc);	        		
	        	}
	        	// 체크박스객체 구성
	        	for(var i in list) {
	        		var code = list[i];
	        		obj.append("<label class='label_check'><input type='checkbox' name='"+opts.id+"' id='"+opts.id+"' value='"+code.code+"' "+callbackFunc+"><i></i><em>"+code.value+"</em></label>");
	        	}
	        	
	        	return obj;
	        }
			, error : function( jqXHR, textStatus, errorThrown ){
				AjaxError(jqXHR, textStatus, errorThrown, "CREATE COMBO ERROR");
				return null;
			}
		});
	}	
	
	/* Default Setting Value Object */
	$.fn.createCommCheckbox.base = {id:'', url:'', param:'' , listName:'' , returnInfo:{CODE: 'CODE', VALUE: 'VALUE'}, optionType:'N', callbackFunc:''};
})(jQuery);
