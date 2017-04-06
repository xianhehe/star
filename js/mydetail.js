;$(function(){
	
	var messageIds=localStorage.getItem('dataid');
	var userId=localStorage.getItem('userId');
	var token=localStorage.getItem('token');
	var newsTitle=localStorage.getItem('newsTitle');
	var newsBody=localStorage.getItem('newsBody');
	
	$('.sysTime').html(newsTitle);
	$('.syeCont').html(newsBody);
	$.ajax({
				type: "post",
				async: true,
				url: '/star/message/read',
				dataType: "json",
				data:{'userId':userId,'token':token,'messageIds':messageIds},
				success: function(data) {
//					var mm='';
					console.log(data);
					if(data.result == 1) {
						console.log(data.data);						
					}
					else if(data.result == 811){
						console.log('消息已查看');
					}
					else if(data.result == 812){
						console.log('消息没有全部插入');
					}
				},
				error: function() {
					alert('fail');
				}
	});
});