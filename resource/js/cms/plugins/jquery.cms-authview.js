/**
 * Auth View Generate Plugin
 * 
 */

;(function($){
	
	// 권한별 화면리스트 객체 구성
	$.fn.createAuthView = function(options){
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createAuthView.base, options);
		
		/* public function List */
		
		this.load = function(){
			generateAuthView(this,opts);
			return this;
		};
		
		this.setOptions = function(userOptions){
			opts = $.extend({}, opts, userOptions);
			return this;
		};
		
		
		this.reload = function(userOptions){
			this.setOptions(userOptions);
			
			this.empty();
			
			generateAuthView(this,opts);
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	

	/* private function List */
	function checkView(mainViewId){
		
		alert(mainViewId);
	}

	
	// 권한별 화면리스트를 구성할 데이터를 조회후 구성
	function generateAuthView(obj,opts){
		
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
	    			//alert("화면 데이터가 존재하지 않습니다.");
	    			return obj;
	    		}
	        	
	        	// 화면체크객체 구성
	        	var checked = false;
	        	var divCnt = 1;
	        	var currID = 0;
	        	
	        	var preViewGroupId = '';
	        	
	    		for(var i in list){
	     			var authView = list[i];
	     			//alert(authView.VIEW_ID + " : " + authView.VIEW_NM+ " : " + authView.VIEW_GRP_ID+ " : " + authView.VIEW_GRP_NM+ " : " + authView.VIEW_URL);
	     			
	     			// 화면그룹
	     			if(preViewGroupId == '' || preViewGroupId != authView.VIEW_GRP_ID){	
	     				
	     				preViewGroupId = authView.VIEW_GRP_ID;
	     				
	     				//console.log(divCnt);
	     				if(divCnt%4 == 1) {
	     					currID++;
	    	    			//console.log(divCnt + ' : ' + authView.VIEW_GRP_NM);
	
	    	    			var objDiv = $('<div/>',{id: 'viewGroup'+currID}).css({'margin-bottom':'15px'});
	    	    			obj.append(objDiv)
	     				}
	     				
	     				$('<br/>').appendTo('#viewGroup'+currID);
	     				
	     				var h = $('<h/>', {name:authView.VIEW_GRP_ID}).addClass('authViewGroup').html(authView.VIEW_GRP_NM);
	     				/*h.on('click',function(){
                    		alert( $(this).attr('name'));
                    		$("input[name*='" +  $(this).attr('name') +"']").prop('checked',true);
	     				});*/
	     				
	     				h.appendTo('#viewGroup'+currID);
	     				$('<br/>').appendTo('#viewGroup'+currID);
	     				
	     				divCnt++;
	     			}
	     			
	     			// 화면체크 리스트 구현
	     			if(authView.CHK == 'T') checked = true;
	     			else checked = false;
	     			
	     			var check = $('<input />', { type: 'checkbox', id: authView.VIEW_ID, name:authView.MAIN_VIEW_ID
	     				                        , value: authView.VIEW_ID, checked:checked});
	     			
	     			if(authView.VIEW_TYP_CD == 'MA'){
	     				check.on('click',function(){
			                        		//alert( this.name + " : " + this.checked);
			                        		$("input[name='" + this.name +"']").prop('checked',this.checked);
	     				           });
	     			}
	     			
	     			var label = $('<label />', { 'for': authView.VIEW_ID, text: authView.VIEW_NM });
	     			
	     			if(authView.VIEW_TYP_CD == 'AC'){
	     				check.css({'margin-left':'15px'}).appendTo('#viewGroup'+currID);  
	     			}
	     			
	     			check.appendTo('#viewGroup'+currID);
	     			label.appendTo('#viewGroup'+currID);
	     			$('<br/>').appendTo('#viewGroup'+currID);
	    		}
	    		
	    		return obj;
	        }
			, error : function( jqXHR, textStatus, errorThrown ){
				AjaxError(jqXHR, textStatus, errorThrown, "CREATE AUTHVIEW ERROR");
				return null;
			}
		});
	}
	
	/* Default Setting Value Object */
	
	// createAuthView Default Option Value
	$.fn.createAuthView.base = {url:'/view/authViewList.ajax', AUTH_CD: '', listName:'authViewList'};
	
})(jQuery);