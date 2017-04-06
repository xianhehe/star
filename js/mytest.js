;$(function(){
	//快速清空
	$(".Num input").on('input propertychange',function(){
		if($(this).val() !==""&& $(this).val() !== $(this).attr('placeholder')){
			$(this).next().show();
		}else{
			$(this).next().hide();
		}
	})
	$('.icon-shanchu').click(function(){
		$(this).hide().prev().val('');
		$('.testSub p').css("background-color", "#605f6a");
	})
	
	//登录按钮变色
	$('.Num input').on('input  propertychange', function() {
		if($('.userI').val() != "" && $('.userI').val() != $('.userI').attr('placeholder') && $('.userN').val() != "" && $('.userN').val() != $('.userN').attr('placeholder')) {
			$('.testSub p').css("background-color", "#ff296a");
		} else {
			$('.testSub p').css("background-color", "#605f6a");
		}
	})
})