/**
 * Auth Menu Generate Plugin
 * 
 */

;(function($){
	
	// 권한별 메뉴리스트 객체 구성
	$.fn.createAuthMenu = function(options){
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createAuthMenu.base, options);
		
		/* public function List */
		
		this.load = function(){
			generateAuthMenu(this,opts);
			return this;
		};
		
		this.setOptions = function(userOptions){
			opts = $.extend({}, opts, userOptions);
			return this;
		};
		
		
		this.reload = function(userOptions){
			this.setOptions(userOptions);
			
			this.empty();
			
			generateAuthMenu(this,opts);
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	

	/* private function List */
	

	
	// 권한별 메뉴리스트를 구성할 데이터를 조회후 구성
	function generateAuthMenu(obj,opts){
		
		var param = {}
		param.AUTH_CD = opts.AUTH_CD;
		
		$.ajax({
	          url    : opts.url
	        , method : 'POST'
	        , data   : param
	        , dataType : 'json'
	        , success:function(data){
	        	
	        	// 기존 객체 삭제
	        	obj.empty();
	        	
	        	var list = data[opts.listName];
	        	//console.log("크기 : " + list.length);
	        	
	        	if(list.length < 1){
	    			//alert("메뉴 데이터가 존재하지 않습니다.");
	    			return obj;
	    		}
	        	
	        	// 메뉴체크객체 구성
	        	var checked = false;
	        	var divCnt = 1;
	        	var currID = 0;
	        	
	        	var preMenuGroupId = '';
	        	
	    		for(var i in list){
	     			var authMenu = list[i];
	     			//alert(preMenuGroupId + " : " + authMenu.MENU_ID + " : " + authMenu.MENU_NM+ " : " + authMenu.MENU_GRP_ID+ " : " + authMenu.MENU_GRP_NM+ " : " + authMenu.MENU_URL);
	     			
	     			// 메뉴그룹
	     			if(preMenuGroupId == '' || preMenuGroupId != authMenu.MENU_GRP_ID){
	     				
	     				preMenuGroupId = authMenu.MENU_GRP_ID;
	     				//console.log(preMenuGroupId);
	     				//console.log(divCnt);
	     				if(divCnt%5 == 1) {
	     					currID++;
	    	    			//console.log(divCnt + ' : ' + authMenu.MENU_GRP_NM);
	
	    	    			var objDiv = $('<div/>',{id: 'menuGroup'+currID});
	    	    			obj.append(objDiv)
	     				}
	     				
	     				$('<br/>').appendTo('#menuGroup'+currID);
	     				
	     				var h = $('<h/>').addClass('authMenuGroup').html(authMenu.MENU_GRP_NM);
	     				h.appendTo('#menuGroup'+currID);
	     				$('<br/>').appendTo('#menuGroup'+currID);
	     				
	     				divCnt++;
	     			}
	     			
	     			// 메뉴체크 리스트 구현
	     			if(authMenu.CHK == 'T') checked = true;
	     			else checked = false;
	     			
	     			var check = $('<input />', { type: 'checkbox', id: authMenu.MENU_ID, name:authMenu.MENU_GRP_ID, value: authMenu.MENU_ID, checked:checked });
	     			var label = $('<label />', { 'for': authMenu.MENU_ID, text: authMenu.MENU_NM });
	     			
	     			check.appendTo('#menuGroup'+currID);
	     			label.appendTo('#menuGroup'+currID);
	     			$('<br/>').appendTo('#menuGroup'+currID);

	    		}
	    		
	    		return obj;
	        }
			, error : function( jqXHR, textStatus, errorThrown ){
				AjaxError(jqXHR, textStatus, errorThrown, "CREATE AUTHMENU ERROR");
				return null;
			}
		});
	}
	
	/* Default Setting Value Object */
	
	// createAuthMenu Default Option Value
	$.fn.createAuthMenu.base = {url:'/menu/authMenuList.ajax', AUTH_CD: '', listName:'authMenuList'};
	
})(jQuery);