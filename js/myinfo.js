$(document).ready(function() {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
});


;$(function(){
	var userId = localStorage.getItem('userId'),
		token = localStorage.getItem('token');
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
	 			html += '<div class="sLable">\
	 						<ul>\
								<li><img src="' + user.avatar + '" /></li>\
								<li><p>' + user.name + '</p><p>' + user.enounce + '</p></li>\
								<li class="iconfont"><a href="../html/mymess.html">&#xe600;</a>\
							</ul>\
						</div>\
						<div class="useSec">\
							<ul>\
								<li><a href="../html/myupload.html"><p>' + user.videoTotal + '</p><p>视频</p></a></li>\
								<li><a href="../html/myforward.html"><p>' + user.shareTotal + '</p><p>转发</p></a></li>\
								<li><a href="../html/myattention.html"><p>' + user.followTotal + '</p><p>关注</p></a></li>\
								<li><a href="../html/myfans.html"><p>' + user.fansTotal + '</p><p>粉丝</p></a></li>\
							</ul>\
						</div>';
						$('.newSlist').before(html);
						$('.myattention').click(function(){
							window.location.href='../html/myattention.html';
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
    
	mui('.mui-bar').on('tap','a',function(){
		var id = this.getAttribute('href');
		var href = this.href;				
		mui.openWindow({
			id:id,
			url: this.href,
			styles:{
				top: 0,
				bottom: '50px',
				bounce: 'vertical'
			}
			
		})
	})
	$('.gomymess').click(function(){
		window.location.href='../html/mymess.html';
	});
	$('.gomytest').click(function(){
		window.location.href='../html/mytest.html';
	});
	$('.golabelmana').click(function(){
		window.location.href='../html/labelmana.html';
	});
	$('.gomynews').click(function(){
		window.location.href='../html/mynews.html';
	});
	$('.gofeedback').click(function(){
		window.location.href='../html/feedback.html';
	});
	$('.goset').click(function(){
		window.location.href='../html/set.html';
	});
	$('.myattention').click(function(){
		alert('111');
		window.location.href='../html/myattention.html';
	});
	
});