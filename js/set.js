$(function(){
	$('.gosecure').click(function(){
		window.location.href='../html/secure.html';
	});
	$('.goupdate').click(function(){
		window.location.href='../html/update.html';
	});
	$('.goabout').click(function(){
		window.location.href='../html/about.html';
	});

	$(".chk_2").click(function(){
		if($('input[name="notice"]').prop("checked")){
            layer.open({content: '推送开启',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
		}else{
        	layer.open({content: '推送关闭',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
		};		
	});
	
	var userId = localStorage.getItem('userId'),
		token = localStorage.getItem('token');
	var setting = {
		init: function(){
			var _this = this;
			_this.getinfo();
		},
		getinfo: function(){
			$.ajax({
			 	url:"/star/user/getInfo",
			 	type:"post",
			 	data: {'userId':userId,'token':token},
			 	dataType:"json",
			 	success:function(data){
			 		console.log(data);
			 		switch(data.result){
			 			case "1":
				 			var user = data.data.user;
				 			var html = '';
				 			if(user.isOpenedHomepage == false){
								html += '<li class="messUser3"><span>公开主页</span><div class="messRight"><input type="checkbox" name="homepage" id="checkbox_c1" class="chk_3 chk_1" /><label for="checkbox_c1"></label></div></li>';
				 			}else{
				 				html += '<li class="messUser3"><span>公开主页</span><div class="messRight"><input type="checkbox" name="homepage" id="checkbox_c1" class="chk_3 chk_1" checked="checked"/><label for="checkbox_c1"></label></div></li>';
				 			}				 			
							$('.messUser3').before(html);
							$(".chk_1").click(function(){
								if($('input[name="homepage"]').prop("checked")){
						            var isOpened = "1";
						            setting.homepage(isOpened);
								}else{
						        	var isOpened = "0";
						        	setting.homepage(isOpened);
								}	
							});
			 				break;
			 			case "200": layer.open({content: '用户名不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
			 	},
			 	error:function(){
					layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
		 	})
		},
		homepage: function(isOpened){
			$('.btn-confirm').on('click',function(){
				$.ajax({
					url:"/star/user/modifyHomepageAccess",
				 	type:"post",
				 	data: {'userId':userId,'token':token,'isOpened':isOpened},
				 	dataType:"json",
				 	success:function(data){
				 		console.log(data);
				 		switch(data.result){
				 			case "1": layer.open({content: '操作成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;		 			
				 			case "100": layer.open({content: '请求参数不正确',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
				 			case "200": layer.open({content: '用户名不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
							default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
				 		}
				 	},
				 	error:function(){
				 		layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				 	}
				});
			})
		}
	}
	setting.init();
})