/**
 * Pager Generate Plugin
 * 
 * 
 */

;(function($){
	
	// 페이저 객체 구성
	$.fn.pager = function(options){
		/* options
		 * 	opts.pageSize;   // 페이지사이즈(페이지당row갯수)
	   		opts.currPage;   // 현재페이지			java:page
	   		opts.totCnt  ;   // 총건수(목록)			
	   		opts.pageCnt;    // pager에 보여지는 최대페이지수
		 */

		/* User Option Value Setting */
		var opts = $.extend({}, $.fn.pager.base, options);
		
		// 초기화
		init(options);
//		console.log('초기화:'+options);
		
		/* public function List */
		this.load = function(){
			if(calculate(this,opts)) generatePager(this,opts);
			return this;
		};
		
		this.clear = function(){
			this.empty();
			return this;
		}
		
		this.reload = function(){						
		    if(opts.totCnt == 0) {
			    this.empty();
			    return this;
		    }
		   
		    if(calculate(this,opts)) generatePager(this,opts);
			return this;
		};
		
		/* Default Return */
		return this.each(function(){
			
		});
		
	}
	
	/* private function List */
	
	// Options Validate
	function init(opts){
       if(opts.gridObj == null || opts.gridObj === 'undefined'){
    	   alert('페이징처리할 그리드 객체가 존재하지 않습니다.');
    	   return;
       }

       var pageSize = (opts.pageSize == null || opts.pageSize === 'undefined')? 10:opts.pageSize;
       var currPage = (opts.currPage == null || opts.currPage === 'undefined')? 1:opts.currPage;
       var totCnt = (opts.totCnt == null || opts.totCnt === 'undefined')? 0:opts.currPage;
       opts.pageSize  = pageSize   // 페이지사이즈
       opts.currPage  = currPage;  // 현재페이지
       opts.totCnt = totCnt;  // 총건수
       
/*console.log('-------- init');
console.log('opts.pageSize: '+opts.pageSize);       
console.log('opts.currPage: '+opts.currPage);
console.log('opts.totCnt: '+opts.totCnt);*/
	}
	
	// 페이징 구성할 각 항목계산
	function calculate(obj,opts){
		
	   var pageSize = opts.pageSize;   // 페이지사이즈
	   var currPage = opts.currPage;   // 현재페이지
	   var totCnt   = opts.totCnt  ;   // 총건수(목록)
	   var pageCnt  = parseInt(opts.pageCnt);    // pager에 보여지는 최대페이지수
   
/*console.log('-------- calculate'); 
console.log('opts.pageSize: '+opts.pageSize);       
console.log('opts.currPage: '+opts.currPage);
console.log('opts.totCnt: '+opts.totCnt);
console.log('opts.pageCnt: '+opts.pageCnt);*/	
	   
	   if(totCnt == 0) return false;
	   
	    var totPage;                                 // 총페이지수 
		var firstPage, prevPage, nextPage, lastPage; // 첫페이지,전페이지,다음페이지,마지막페이지
		var startPage, endPage;                      // 리스팅시작페이지, 리스팅종료페이지
		
		totPage = Math.ceil(totCnt/pageSize); // 올림
		
		//alert("현재페이지(" + currPage +") : 총페이지수 (" + totPage +") / 페이지사이즈 (" + pageSize +") / 총건수 (" + totCnt +")" );
		
        if(totPage <= pageCnt){
        	firstPage = -1;
        	prevPage  = -1;
        	
        	startPage = 1;
        	endPage   = totPage;
        	
        	nextPage  = -1;
        	lastPage  = -1;
        }
        else if((parseInt(currPage/pageCnt) < 1) && (pageCnt <= totPage)){
        	
        	firstPage = -1;
        	prevPage  = -1;
        	
        	startPage = 1;
        	endPage   = pageCnt;
        	
    		nextPage  = (endPage == totPage) ? -1 : endPage + 1;
    		lastPage  = (endPage == totPage) ? -1 : totPage;
        	
        }
        else if((parseInt(currPage/pageCnt) >= 1) && ((parseInt(currPage/pageCnt)) * pageCnt <= totPage)){  	
        	
        	firstPage = 1;
        	
        	if(currPage%pageCnt == 0){
        		startPage = currPage - pageCnt + 1;
        		endPage   = currPage
        	}
        	else{
        		startPage = parseInt(currPage/pageCnt) * pageCnt + 1;
        		endPage   = (parseInt(currPage/pageCnt) * pageCnt + pageCnt) < totPage 
        		              ? (parseInt(currPage/pageCnt) * pageCnt + pageCnt)
        		              : totPage;
        	}
    		
    		prevPage  = (startPage == 1) ? -1 : parseInt(startPage) - 1;
    		nextPage  = (endPage == totPage) ? -1 : parseInt(endPage) + 1;
    		lastPage  = (endPage == totPage) ? -1 : parseInt(totPage);
        }
        else{
        	alert("PAGER ERROR");
        	
        	obj.empty();
        	return false;
        }
        
        //alert("현재페이지(" + currPage +") : firstPage (" + firstPage +") / prevPage (" + prevPage +") / startPage (" + startPage +") / endPage(" + endPage +") / nextPage (" + nextPage +") / lastPage (" + lastPage +") ");
        
        opts.pageObj.firstPage = firstPage;
        opts.pageObj.prevPage  = prevPage;
        opts.pageObj.startPage = startPage;
        opts.pageObj.endPage   = endPage;
        opts.pageObj.nextPage  = nextPage;
        opts.pageObj.lastPage  = lastPage;
        
        return true;		
	}
	
	function generatePager(obj,opts){
		
	   var pageObj  = opts.pageObj;
//	   var elem     = obj.addClass('admin-ui-pager');  //$('<div/>').addClass('admin-ui-pager');
	   var elem     = obj.addClass('paginate');  //$('<div/>').addClass('admin-ui-pager');
	   var callback = opts.callbackfun;
	   
	   
	   // pager 초기화
	   obj.empty();
	   
	   var firstPage = opts.pageObj.firstPage;
	   var prevPage  = opts.pageObj.prevPage;
	   var startPage = opts.pageObj.startPage;
       var endPage   = opts.pageObj.endPage;
       var nextPage  = opts.pageObj.nextPage;
	   var lastPage  = opts.pageObj.lastPage;
	   
	   var currPage  = opts.currPage;
	   
	   if(firstPage < 0){
		   elem.append($('<a/>', {
			   title: "처음",
			   href:href="javascript:;",
			   class:"ctrl start disabled"
		   }).html('<i></i>'));
	   }
	   else{
		   elem.append($('<a/>', {            
			    title: "처음("+firstPage+")",
			    href:href="javascript:;",
			    class: "ctrl start",
		        click:function(){
		        	callback(firstPage);
		        }
		    }).html('<i></i>'));
	   }
	   
	   if(prevPage < 0){
		   elem.append($('<a/>', {
			   title: "이전",
			   href:href="javascript:;",
			   class:"ctrl prev"
		   }).html('<i></i>'));
	   }
	   else{
		   elem.append($('<a/>', {            
			    title: "이전("+prevPage+")",
			    href:href="javascript:;",
			    class:"ctrl prev",
		        click:function(){
		        	callback(prevPage);
		        }
		    }).html('<i></i>'));
	   }

	   if(endPage > 0){
		   elem.append($('<span/>', {            
			    class: "pages"
		    }).html(''));
		   
		   var pages = $(obj.selector+" > .pages");

		   for(var i=startPage;i<(parseInt(endPage)+1);i++){
				
	    	   if(currPage == i){
	    		   pages.append($('<a/>', {
	    			   page: i,
	      			   title:"현재페이지",
	      			 href:href="javascript:;",
	      			   class: "curr",
	      			    click:function(){
	      		        	var page = $(this).attr('page');
	      		        	callback(page);
	      		        }
	      		    }).html(i));
	    		   
	    	   }
	    	   else{
	    		   pages.append($('<a/>', {
	    			   page: i,
	    			   title: i +"페이지", 
	    			   href:href="javascript:;",
		   			   click:function(){
		   		        	var page = $(this).attr('page');
		   		        	callback(page);
		   		       }
	    		   }).html(i));
	    	   }
	       }		   
       
       
	   }

	   if(nextPage < 0){
		   elem.append($('<a/>', {
			   title: "다음",
			   href:href="javascript:;",
			   class:"ctrl next"
		   }).html('<i></i>'));
	   }
	   else{
		   elem.append($('<a/>', {            
			    title: "다음("+nextPage+")",
			    href:href="javascript:;",
			    class:"ctrl next",
			    click:function(){
		        	callback(nextPage);
		        }
		    }).html('<i></i>'));
	   }
	   
	   if(lastPage < 0){
		   elem.append($('<a/>', {
			   title: "끝",
			   href:href="javascript:;",
			   class:"ctrl end disabled"
		   }).html('<i></i>'));
	   }
	   else{
		   elem.append($('<a/>', {            
			    title: "끝("+lastPage+")",
			    href:href="javascript:;",
			    class:"ctrl end",
			    click:function(){
		        	callback(lastPage);
		        }
		    }).html('<i></i>'));
	   }

	   obj.append(elem);
			   
	   return obj;
	}
	
	/* Default Setting Value Object */
	
	// pager Default Option Value
	$.fn.pager.base = {
		   	gridObj  : null,
		   	pageCnt  : 10,    // pager에 보여지는 최대페이지수
		   	pageSize : 10,
		   	currPage : 1,
		   	totCnt   : 0,
		   	pageObj  : {},
	        callbackfun:null
	   };

})(jQuery);