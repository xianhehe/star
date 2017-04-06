$(function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
	var userId = localStorage.getItem('userId');
	var token = localStorage.getItem('token');
	var pageNum = 0;
	
	var myfans = {
		getFansList: function(pageNum){
			$.ajax({
				type:"post",
				url:"/star/user/fans/list",
				dataType: "json",
				data: {'userId': userId,'token': token,'pageNum': pageNum,'pageSize': 10},
				success: function(data){
					console.log(data);
					if(data.result == 1) {
						if(data.data.list.length == 0){
							var html = '<div class="backImg"><span>还没有粉丝呢~</span></div>';
							$('#fansTab').append(html);
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
						}else if(pageNum > data.data.pages) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						} else {
							var html = '';
							$.each(data.data.list, function(obj, news) {
								html += '<li class="gohome" data-id="'+ news.id +'">\
									<p class="userAvatar"><img src="' + news.avatar + '"></p>\
									<p class="reName">' + news.name +'</p>\
								</li>';
							});
							$('#attentionTab').append(html);
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);	
							myfans.goOtherHome();						
						}
					}
					if(data.result == 200){
						layer.open({content: '用户不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					}
					if(data.result == 217){		
						layer.open({content: '用户未开启个人主页',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					}
				}
			});
		},
		goOtherHome: function(){
			$(".gohome").on("tap",function(){
				var otherid = $(this).attr("data-id");
				$.ajax({
					type:"post",
					url:"/star/user/getVisitInfo",
					data: {'userId':userId,'token':token,'visitUserId':otherid},
					success: function(data){
						if(data.data.user.isOpenedHomepage == false){
							layer.open({content: '用户未开启主页!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
						}else{
							localStorage.setItem('otherid', otherid);
							window.location.href = '../html/myhome.html';
						}
					}
				});
			});	
		}
	
	}
	
	
	mui.init({
		pullRefresh: {
			container: '#pullrefresh', 
			up: {
				auto: true, 
				contentrefresh: "正在加载...",
				contentnomore: '没有更多数据了', 
				callback: pullupRefresh
			},
			down: {
				callback: pulldownRefresh
			}
		}
	});
	function pulldownRefresh() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
		}, 1500);
	}
	function pullupRefresh() {
		myfans.getFansList(++pageNum);
	}

	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});
		
		
		
		
		

	
	
	
	
});


