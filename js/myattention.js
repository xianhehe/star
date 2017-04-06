$(document).ready(function() {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
});

mui.init({
	pullRefresh: {
		container: '#pullrefresh', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			auto: false, //可选,默认false.自动上拉加载一次
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: pullupRefresh
		},
		down: {
			callback: pulldownRefresh
		}
	}
});

mui('.mui-scroll-wrapper').scroll({
	indicators: false
});

function pulldownRefresh() {
	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 1500);
}
var count = 0;

function pullupRefresh() {
	//setTimeout(function() {
		count++;
		ajax(count)
	//}, 150);
}

if(mui.os.plus) {
	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();
	}, 1000);
}else{
	mui.ready(function() {	
		mui('#pullrefresh').pullRefresh().pullupLoading();
	});
}
 
 

var userId = localStorage.getItem('userId');
var token = localStorage.getItem('token');
var url = "/star/dynamic/list";

var userId = localStorage.getItem('userId');
var token = localStorage.getItem('token');
var url='/star/user/followed/list'
var ajax = function(count) {

	mui.ajax(url, {
		data: {
			'userId': userId,
			'token': token,
			'pageNum': count,
			'pageSize': 10
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型

		success: function(data) {
			console.log(data);
			var length = data.data.list.length;
			
			if(data.result == 1) {
				if(data.data.list.length == 0){
					var html = '<div class="backImg"><span>大咖专家在等你哦~</span></div>';
					$('#attentionTab').append(html);
					mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
				}else if(count>data.data.pages) {
					count = data.data.pages;
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				} else {					
					var html = '';
					$.each(data.data.list, function(obj, news) {
						html +='<li class="gohome" data-id="'+ news.id +'">\
									<p class="userAvatar"><img src="' + news.avatar + '"></p>\
									<p class="reName">' + news.name +'</p>\
								</li>';
					});																								
					$('#attentionTab').append(html);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);	
										
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
			if(data.result == 200){
				layer.open({content: '用户不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
			}
			if(data.result == 217){
				layer.open({content: '用户未开启个人主页',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
			}
		},	
		error: function() {		
			layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
		}
	})
};





