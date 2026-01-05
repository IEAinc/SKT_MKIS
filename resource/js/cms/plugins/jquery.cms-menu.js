/**
 * Menu Generate Plugin
 * 
 */

;(function($){
	
	// 로그인후 권한별로 메뉴리스트 객체 구성
	$.fn.createMenu = function(options){
		
		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.createMenu.base, options);
		
		/* public function List */
		
		this.load = function(foldYn){
			if(foldYn == 'undefined' || foldYn == '' || foldYn == 'Y'){
				opts.FOLD = 'fold';
			}
			else if(foldYn == 'N'){
				opts.FOLD = '';
			}
			generateMenu(this,opts);
			return this;
		};
		
		this.setOptions = function(userOptions){
			opts = $.extend({}, opts, userOptions);
			return this;
		};
		
		
		this.reload = function(userOptions){
			this.setOptions(userOptions);
			
			this.empty();
			
			generateMenu(this,opts);
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	

	/* private function List */
	
	// 권한별 메뉴리스트를 구성할 데이터를 조회후 구성
	function generateMenu(obj,opts){
		
		$.ajax({
	          url    : opts.url
	        , method : 'POST'
	        , data   : ''
	        , dataType : 'json'
	        , success:function(data){
	        	
	        	// 기존 객체 삭제
	        	obj.empty();
	        	
	        	var list = data[opts.listName];
	        	//alert("길이 : " + list.length);
	        	
	        	if(list.length < 1){
	    			//alert("메뉴 데이터가 존재하지 않습니다.");
	    			return obj;
	    		}
	        	
	        	// form 객체 생성
	        	var form = $('<form/>',{id:'menuFrom',target:'contents',method:'post'});
	        	//form.append($('<input/>',{id:'',name:'',type:'hidden'}));
	        	form.append($('<input/>',{id:'MENU_GRP_ID',name:'MENU_GRP_ID',type:'hidden'}));
	        	form.append($('<input/>',{id:'MENU_GRP_NM',name:'MENU_GRP_NM',type:'hidden'}));
	        	form.append($('<input/>',{id:'MENU_ID',name:'MENU_ID',type:'hidden'}));
	        	form.append($('<input/>',{id:'MENU_NM',name:'MENU_NM',type:'hidden'}));
	        	
	        	obj.append(form);
	        	
	        	// 메뉴체크객체 구성
	        	var oldGrpId = '';
	        	var elem = $('<dl/>');
	    		for(var i in list){
	     			var menu = list[i];
	     			//alert(menu.MENU_ID + " : " + menu.MENU_NM+ " : " + menu.MENU_GRP_ID+ " : " + menu.MENU_GRP_NM+ " : " + menu.MENU_URL);
	     			
	     			// 메뉴그룹
	     			if(oldGrpId != menu.MENU_GRP_ID){
	     				var dt = $('<dt/>',{
	     				       name : menu.MENU_GRP_ID,
	     					   click:function(){
	     						  //alert($(this).attr('name') + ' : ' + $('dd[name="'+$(this).attr('name')+'"]').length);
	     						 $('dd[name="'+$(this).attr('name')+'"]').toggleClass('fold');
	     					}
	     				}).html(menu.MENU_GRP_NM);
	     				
	     				elem.append(dt);
	     				
	     				oldGrpId = menu.MENU_GRP_ID;
	     			}
	     			
	     			var dd = $('<dd/>', {
	     				name      : menu.MENU_GRP_ID,
	     				menuGrpNm : menu.MENU_GRP_NM,
	     				menuNm    : menu.MENU_NM,
	     				menuId    : menu.MENU_ID,
	     				menuUrl   : menu.MENU_URL,
	     				click:function(){
	     					//alert($(this).attr('menuUrl') + ' : ' + $(this).attr('name') + ' : ' + $(this).attr('menuGrpNm') + ' : ' +  $(this).attr('menuId') + ' : ' +  $(this).attr('menuNm'));
	     					
	     					$('#MENU_GRP_ID').val($(this).attr('name'));
	     					$('#MENU_GRP_NM').val($(this).attr('menuGrpNm'));
	     					$('#MENU_ID').val($(this).attr('menuId'));
	     					$('#MENU_NM').val($(this).attr('menuNm'));
	     					
	     					$('#menuFrom').attr({action:$(this).attr('menuUrl')}).submit(); 
	     					
	     				}
	     			}).addClass(opts.FOLD).html('- ' + menu.MENU_NM); 
     				elem.append(dd);
	    		}
	    		
	    		obj.append(elem);
	    		return obj;
	        }
			, error : function( jqXHR, textStatus, errorThrown ){
				AjaxError(jqXHR, textStatus, errorThrown, "CREATE MENU ERROR");
				return null;
			}
		});
	}
	
	/* Default Setting Value Object */
	
	// createMenu Default Option Value
	$.fn.createMenu.base = {url:'/common/menuList.ajax', AUTH_CD: '', listName:'menuList', FOLD:'fold'};
	
})(jQuery);