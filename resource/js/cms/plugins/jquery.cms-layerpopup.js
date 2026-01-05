/**
 * Layer PopUp Generate Plugin
 * 
 * 
 */

;(function($){
	var OBJECT;
	
	// 레이어팝업객체 구성
	$.fn.layerpopup = function(){
		/* User Option Value Setting */
		OBJECT = this;
		
		/* public function List */
		this.open = function(){
			// 중앙위치 고정
			var top  = Math.max(0, (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop()) + "px";
			var left = Math.max(0, (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft())  + "px";

			this.css({'top':top,'left':left});
			this.show();
			
			//화면의 높이와 너비를 구한다.
			var maskHeight = $(document).height();  
			var maskWidth = $(window).width();  

			//마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
			$('.layermask').css({'width':maskWidth,'height':maskHeight});  
			// 80% 불투명도
			$('.layermask').fadeTo("slow",0.7);  
			
			var resizeTimer;
			$(window).bind('resize', function(e) {
				OBJECT.close();
			    
			    clearTimeout(resizeTimer);
			    resizeTimer = setTimeout(function() {
			    	OBJECT.open();
			    }, 200);
			});
			
			return $(this);
		};
		
		this.close = function(){
			$('.layermask').hide();
			this.hide();
			
			$(window).unbind('resize');
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	
	/* private function List */

	/* Default Setting Value Object */
	
	// Layer PopUp Default Option Value
	//$.fn.layerpopup.base = {top:'', left:''};
	
})(jQuery);