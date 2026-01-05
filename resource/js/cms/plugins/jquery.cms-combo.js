/**
 * Combo Generate Plugin
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
 * optionType : 옵션객체 첫항목 추가설정 ( 전체(A)/선택(S)/없음(N) )
 * valueType  : select객체의 text 값표현방법 (V: 공통코드값 , C: 공통코드값[공통코드])
 * defaultVal : 사용자가 초기 설정한 값
 * --------------------------------------------------
 * 2. createCommCombo(groupId,optionType,valueType,defaultVal)
 * 공통코드 전용
 * 
 * groupId    : 공통코드 그룹ID
 * optionType : 옵션객체 첫항목 추가설정 : 전체(A)/선택(S)/없음(N) 
 * valueType  : select객체의 text 값표현방법 (V: 공통코드값 , C: 공통코드값[공통코드])
 * defaultVal : 사용자가 초기 설정한 값
 *
 * --------------------------------------------------
 * 3. setCombo(options)
 *  사용자가 직접 세팅
 * 
 * default options {
 * 			   returnInfo:{CODE: 'CODE' , VALUE: 'VALUE' } 
 *           , setInfo:[]
 *   		 , optionType : 'N'              
 *   		 , valueType  : 'V'
 *           , defaultVal : ''
 * 			}

 * returnInfo :{CODE: , VALUE: } -> 결과 리스트상에서 select 객체의 Text/Code 값의 Key값 정보
 * setInfo    : select 옵션객체에 들어갈 값을 배열로 설정
 * optionType : 옵션객체 첫항목 추가설정 ( 전체(A)/선택(S)/없음(N) )
 * valueType  : select객체의 text 값표현방법 (V: 공통코드값 , C: 공통코드값[공통코드])
 * defaultVal : 사용자가 초기 설정한 값
 * 
 */

;(function($){
	
	// 일반콤보객체 구성
	$.fn.createCombo = function(options){
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createCombo.base, options);
		
		// 유효성 체크
		validate(opts);
		
		/* public function List */
		
		this.load = function(defaultVal){
			if(defaultVal != undefined){
    			opts.defaultVal = defaultVal;
    		}
			
			generateCombo(this,opts);
			return this;
		};
		
		this.setOptions = function(userOptions){
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
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	
	// 공통코드 전용 콤보객체 구성
	$.fn.createCommCombo = function(groupId,optionType,valueType,defaultVal){
		// 공통코드용 설정값 설정
		var commOpts = {
		      url: '/common/codeList.ajax' 
			, param: {groupId :groupId} 
			, listName: 'codeList'
			, returnInfo:{CODE: 'code', VALUE: 'value'}
			, optionType : optionType            
			, valueType  : valueType
			, defaultVal : defaultVal
		};
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createCombo.base, commOpts);
		
		// 유효성 체크
		if(opts.param.groupId == "undefined" || opts.param.groupId == "" || opts.param.groupId == null){
			alert("createCommCombo options 파라미터 객체중 그룹ID가 설정되지 않았습니다.");
			return this;;
		}
		
		/* public function List */
		
		this.load = function(defaultVal){
			// 초기값이 존재하면 설정
    		if(defaultVal != undefined){
    			opts.defaultVal = defaultVal;
    		}
			
			generateCombo(this,opts);
			return this;
		};
		
		this.setOptions = function(groupId,optionType,valueType,defaultVal){
			
			var comm = {
					  param: {groupId :groupId} 
					, optionType : optionType            
					, valueType  : valueType
					, defaultVal : defaultVal
				};
			
			opts = $.extend({}, opts, comm);
			
			// Validation 체크
			if(opts.param.groupId == "undefined" || opts.param.groupId == "" || opts.param.groupId == null){
				alert("createCommCombo options 파라미터 객체중 그룹ID가 설정되지 않았습니다.");
				return this;
			}
			
			return this;
		};
		
		this.clear = function(){
			$('option', this).remove();
			return this;
		};
		
		this.reload = function(groupId,optionType,valueType,defaultVal){
			this.setOptions(groupId,optionType,valueType,defaultVal);
			
			$('option', this).remove();
			
			generateCombo(this,opts);
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	
	// 콤보구성값을 배열로 직접 전달하여 구성
	$.fn.setCombo = function(options){
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.setCombo.base, options);
		
		this.clear = function(){
			$('option', this).remove();
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
			// 콤보객체의 옵션객체 추가설정
        	var setOpt = new Array() ;
        	var select = $(this); 
        	
    		if(select.prop) setOpt = select.prop('options');
    		else            setOpt = select.attr('options');
    		
    		if(opts.optionType == 'A' || opts.optionType == 'S'){
    			//alert(optionType);
    			setOpt[0] = new Option((opts.optionType == 'A' ? '전체' : '선택'), opts.optionType);
    		}
    		
			var list = opts.setInfo;
			
			// 콤보객체 구성
    		for(var i in list){
     			var code = list[i];
     			
     		    // 콤보 Text값 표현방법 코드 설정
     			if(opts.valueType == "C"){
     				setOpt[setOpt.length] = new Option(code[opts.returnInfo.VALUE] + ' [' + code[opts.returnInfo.CODE] + ']', code[opts.returnInfo.CODE]);  // Option(text,code)
     			}
     			else { // if(valueType == "undefined" || valueType == "")
     				setOpt[setOpt.length] = new Option(code[opts.returnInfo.VALUE] , code[opts.returnInfo.CODE]);  // Option(text,code)
     			}
    		}
    		
    		// 초기값이 존재하면 설정
    		if(opts.defaultVal != undefined && opts.defaultVal != ''){
    			select.val(opts.defaultVal);
    		}
    		
		});
	}
	
//////////////////////// S	
	
	// 직접 조회데이터를 이용한 콤보객체 구성
	//$.fn.createNonCommCombo = function(groupId,optionType,valueType,defaultVal,searhUrl){
	$.fn.createNonCommCombo = function(param,optionType,valueType,defaultVal,url){		
		// 공통코드용 설정값 설정
		var commOpts = {
		      //url: '/common/codeList.ajax' 
		      url: url		    	  
			, param: param 
			, listName: 'codeList'
			, returnInfo:{CODE: 'code', VALUE: 'value', BLTNBASDT: 'bltnBasDt'} // 2023-08-01 메뉴별 게시기간 설정 P126820 김나리
			, optionType : optionType
			, valueType  : valueType
			, defaultVal : defaultVal
		};
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createNonCommCombo.base, commOpts);
		
		// 유효성 체크
		//if(opts.param.groupId == "undefined" || opts.param.groupId == "" || opts.param.groupId == null){
		if(opts.url == "undefined" || opts.url == "" || opts.url == null){			
			alert("createNonCommCombo options 파라미터 객체중 url이 설정되지 않았습니다.");
			return this;;
		}
		
		/* public function List */
		
		this.load = function(defaultVal){
			// 초기값이 존재하면 설정
    		if(defaultVal != undefined){
    			opts.defaultVal = defaultVal;
    		}
			
			generateCombo(this,opts);
			return this;
		};
		
		//this.setOptions = function(groupId,optionType,valueType,defaultVal){
		this.setOptions = function(param,optionType,valueType,defaultVal,url){			
			
			var comm = {
					  param: param 
					, url: url	
					, optionType : optionType            
					, valueType  : valueType
					, defaultVal : defaultVal
				};
			
			opts = $.extend({}, opts, comm);
			
			// Validation 체크
			if(opts.url == "undefined" || opts.url == "" || opts.url == null){			
				alert("createNonCommCombo options 파라미터 객체중 url이 설정되지 않았습니다.");
				return this;;
			}
			
			return this;
		};
		
		this.clear = function(){
			$('option', this).remove();
			return this;
		};
		
		//this.reload = function(groupId,optionType,valueType,defaultVal){
		this.reload = function(param,optionType,valueType,defaultVal,url){	
			//this.setOptions(groupId,optionType,valueType,defaultVal);
			this.setOptions(param,optionType,valueType,defaultVal,searhUrl);
			
			$('option', this).remove();
			
			generateCombo(this,opts);
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}	
	
//////////////////////// E	
	
	/* private function List */
	
	// Options Validate
	function validate(opts){
		if(opts == "undefined" || opts == "" || opts == null){
			alert("createCombo options 객체가 설정되지 않았습니다.");
			return;
		}
		else if(opts.url == "undefined" || opts.url == "" || opts.url == null){
			alert("createCombo options 객체의 url 객체가 설정되지 않았습니다.");
			return;
		}
		else if(opts.listName == "undefined" || opts.listName == "" || opts.listName == null){
			alert("createCombo options 객체의 리스트 객체명이 설정되지 않았습니다.");
			return;
		}
		else if(opts.returnInfo == "undefined" || opts.returnInfo == "" || opts.returnInfo == null){
			alert("createCombo options 객체의 리스트내의 객체정보가 설정되지 않았습니다.");
			return;
		}
		else if(opts.returnInfo.CODE == "undefined" || opts.returnInfo.CODE == "" || opts.returnInfo.CODE == null){
			alert("createCombo options 객체의 리스트내의 객체정보의 CODE가 설정되지 않았습니다.");
			return;
		}
		else if(opts.returnInfo.VALUE == "undefined" || opts.returnInfo.VALUE == "" || opts.returnInfo.VALUE == null){
			alert("createCombo options 객체의 리스트내의 객체정보의 VALUE가 설정되지 않았습니다.");
			return;
		}
	}
	
	// 콤보를 구성할 데이터를 조회후 콤보구성
	function generateCombo(obj,opts){
		$.ajax({
	          url    : opts.url
	        , method : 'POST'
	        , data   : opts.param
	        , dataType : 'json'
	        , success:function(data){
	        	// 기존 Option 객체 삭제
	        	$('option', obj).remove();
	        	
	        	// 콤보객체의 옵션객체 추가설정
	        	var options = new Array() ;
	        	var select = obj; 
	        	
	    		if(select.prop) options = select.prop('options');
	    		else            options = select.attr('options');
	    		
	    		if(opts.optionType == 'A' || opts.optionType == 'S'){
	    			//alert(optionType);
	    			//options[0] = new Option((opts.optionType == 'A' ? '전체' : '선택'), opts.optionType);
	    			//===> 빈값으로 세팅
	    			options[0] = new Option((opts.optionType == 'A' ? '전체' : '선택'), '');
	    		}

	    		var list = data[opts.listName];

	    		if(list.length < 1){
	    			//alert("콤보 데이터가 존재하지 않습니다.");
	    			return obj;
	    		}
	      
	    		//alert(opts.returnInfo.VALUE);
	    		//alert(opts.returnInfo.CODE);
	    		
	    		// 콤보객체 구성
	    		/*for(var i in list){
	     			var code = list[i];
	     			
	     		    // 콤보 Text값 표현방법 코드 설정
	     			if(opts.valueType == "C"){
	     				options[options.length] = new Option(code[opts.returnInfo.VALUE] + ' [' + code[opts.returnInfo.CODE] + ']', code[opts.returnInfo.CODE]);  // Option(text,code)
	     			}
	     			else { // if(valueType == "undefined" || valueType == "")
	     				options[options.length] = new Option(code[opts.returnInfo.VALUE] , code[opts.returnInfo.CODE]);  // Option(text,code)
	     			}
	    		}*/
	    		
	    		
	    		var optionStr = "";
	    		
	    		for(var i in list){
	     			var code = list[i];
	     			
	     			var selected = "";
	     			if(code[opts.returnInfo.CODE] == opts.defaultVal) {
	     				selected = "selected";
	     			} else {
	     				selected = "";
	     			}

					// 2023-08-01 메뉴별 게시기간 설정 P126820 김나리
					var bltnBasDt = "";
					
					if(typeof opts.returnInfo.BLTNBASDT != "undefined") {
						if(typeof code[opts.returnInfo.BLTNBASDT] != "undefined" && code[opts.returnInfo.BLTNBASDT] != "" && code[opts.returnInfo.BLTNBASDT] != null) {
							bltnBasDt = code[opts.returnInfo.BLTNBASDT];
						}
					}	
									
	     		    // 콤보 Text값 표현방법 코드 설정
	     			if(opts.valueType == "C"){
	     				optionStr += "<option value='" + code[opts.returnInfo.CODE] + "' " + selected + (bltnBasDt != "" ? " data-bltnBasDt='" + bltnBasDt + "'" : "") +">"
	     					+ code[opts.returnInfo.VALUE]
	     					+ "</option>";
	     			}
	     			else { // if(valueType == "undefined" || valueType == "")
	     				optionStr += "<option value='" + code[opts.returnInfo.CODE] + "' " + selected + (bltnBasDt != "" ? " data-bltnBasDt='" + bltnBasDt + "'" : "") +">"
	     					+ code[opts.returnInfo.VALUE]
	     					+ "</option>";
	     			}
	    		}
	    		//console.log($(select[0]));
	    		//select.append();
	    		
	    		// 초기값이 존재하면 설정
	    		/*if(opts.defaultVal != undefined && opts.defaultVal != ''){
	    			obj.val(opts.defaultVal);
	    		}*/
	    		
	    		$(select[0]).attr('data-select','true').append(optionStr);
	    		//console.log($(select[0]).append(optionStr));
	    		UI.fn.form();

	    		return obj;
	        }
			, error : function( jqXHR, textStatus, errorThrown ){
				AjaxError(jqXHR, textStatus, errorThrown, "CREATE COMBO ERROR");
				return null;
			}
		});
	}
	
	/* Default Setting Value Object */
	
	// createCombo Default Option Value
	$.fn.createCombo.base = {url:'', param:'' , listName:'' , returnInfo:{CODE: 'CODE', VALUE: 'VALUE'}, optionType:'N', valueType:'V', defaultVal : '' };
	// setCombo Default Option Value
	$.fn.setCombo.base = {returnInfo:{CODE: 'CODE', VALUE: 'VALUE'}, setInfo:[], optionType:'N', valueType:'V', defaultVal : '' };
	
})(jQuery);