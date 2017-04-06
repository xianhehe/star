SPA.defineView('comment', {
  html: tplcomment,
  plugins: ['delegated'],
  styles: {
    'background': '#2b2938 !important'
  },
  bindActions: {
  	'tap.exit': function(e, data) {
         this.hide();
   },
   'show.add-comment':function(e,data){

   	  
      fnUtil.setActive(e.el);
          SPA.show('addcomment', {
          ani: {
             name: 'actionSheet',
                    distance: 0
            
            
          },
          param: {
            view: this
          }
        }); 
  



   }
  },
  bindEvents: {
    'beforeShow': function() {
    	$(".comment").click(function(){
    		$(".down-comment").show();
    	});
//tab切换
$(".self-comment ul li").eq(2).click(function(){
	$(".replay-comment").eq(0).css("display","none")
});
$(".self-comment ul li").eq(1).click(function(){
	$(".replay-comment").eq(0).css("display","block")
});
//选中标签
$(".replay-comment  span").click(function(){
	$('.sub').css("background","#fb4a74");
	var newes=$(this).text();
		$(".write-comment").text(newes);
});
$(".sub").click(function(){
    		$(".down-comment").hide();
    });
    }
  }
});