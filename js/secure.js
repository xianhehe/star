$(function(){
	var userId = localStorage.getItem('userId'),
		token = localStorage.getItem('token');
		
	$('.btn-confirm').on('click',function(){
		window.location.href='../html/login.html';
	});
	$.ajax({
		type: "get",
		url: '/star/user/getBindStatus',
		dataType: "json",
		data: {'userId':userId,'token':token},
		success: function(data) {
			switch(data.result){
				case "1": 
				var phone = '',
					email = '';
				if(data.data.phoneBindStatus == 0) {
					phone += '未绑定';
					$('.safephone').click(function(){
						window.location.href='../html/bindphone.html';
					});					
				}else {
					phone += '已绑定';
				};
				
				if(data.data.emailBindStatus == 0) {
					email += '未绑定';
					$('.safemail').click(function(){
						window.location.href='../html/bindmailbox.html';
					});
				}else if(data.data.emailBindStatus == 1){
					email += '等待绑定';
					$('.safemail').click(function(){
						window.location.href='../html/bindmailbox.html';
					});
				}else {
					email += '已绑定';
				};
				$('.safephone .sad span').append(phone);
				$('.safemail .sad span').append(email);				
				break;
				case "200": layer.open({content: '用户不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});break;
				default: layer.open({content: '网络出错，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});break;
			}
		},
		error: function() {
			layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
		}
	});
})
