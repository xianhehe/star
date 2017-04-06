$(document).ready(function() {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
})

mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: false, //默认为false，不监听
		release: false //默认为false，不监听
	},
	options: {
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: false, //是否显示滚动条
		deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
		bounce: true //是否启用回弹
	},
	pullRefresh: {

		container: '#pullrefresh', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			height: 50, //可选.默认50.触发上拉加载拖动距离
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

function pulldownRefresh() {
	setTimeout(function() {

		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed

	}, 1500);

}
var count = 0;

function pullupRefresh() {
	mui('.mui-scroll-wrapper').scroll({
		indicators: false
	});

	$('.mui-scrollbar-indicator').css('display', 'none');
	setTimeout(function() {
		count++;
		ajax(count)
	}, 150);
}

if(mui.os.plus) {
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});

	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();

	}, 1000);

} else {
	mui.ready(function() {

		mui('#pullrefresh').pullRefresh().pullupLoading();

	});
}

var userId = localStorage.getItem('userId');
var token = localStorage.getItem('token');
var url = '/star/message/unReadList';
var ajax = function(count) {

	mui.ajax(url, {
		data: {
			'userId': userId,
			'token': token,
			'pageNum': count,
			'pageSize': 15
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型

		success: function(data) {
			//					console.log(data.data);
			if(data.result == 1) {
				if(count > data.data.pages) {
					count = data.data.pages;
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

				} else {
					var html = '';
					$.each(data.data.list, function(obj, news) {
						if(news.readStatus == 0) {
							html += '<li class="mui-table-view-cell" data-id="' + news.id + '"><input class="check_box" type="checkbox"><div><h3><span class="lastUpdatedTime">' + news.lastUpdatedTime.substring(0, 10) + '</span>' + news.title + '</h3><span class="list_body"></span><span></span>' + news.body + '</div></li>';
						};
						if(news.readStatus == 1) {
							html += '<li class="mui-table-view-cell" data-id="' + news.id + '"><input class="check_box" type="checkbox"><div><h3><span class="lastUpdatedTime">' + news.lastUpdatedTime.substring(0, 10) + '</span>' + news.title + '</h3><span class="list_body">' + news.body + '</span></div></li>';
						};
					});
					$('.mui-table-view').append(html);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

				}
			} else {
				console.log('消息获取失败');
			}
		},
		error: function(xhr, type, errorThrown) {
			alert('fail');
			//			popover('请求失败');
		}
	})

}

//全部已读


	
	 $("body").on('click','.check_box',function() {
			if($(this).prop("checked") == true) {
			var messageIds = $(this).parent('li').attr("data-id");
//			console.log(messageIds);
			$.ajax({
				type: "post",
				async: true,
				url: '/star/message/read',
				dataType: "json",
				data: {
					'userId': userId,
					'token': token,
					'messageIds': messageIds
				},
				success: function(data) {
					console.log(data);
					if(data.result == 1) {} else if(data.result == 811) {
						console.log('消息已查看');
					} else if(data.result == 812) {
						console.log('消息没有全部插入');
					}
				},
				error: function() {
					alert('fail');
				}
			});
		}
		});
	
//		if($(this).prop("checked") == true) {
//			var messageIds = $(this).parent('li').attr("data-id");
//			console.log(messageIds);
//			$.ajax({
//				type: "post",
//				async: true,
//				url: '/star/message/read',
//				dataType: "json",
//				data: {
//					'userId': userId,
//					'token': token,
//					'messageIds': messageIds
//				},
//				success: function(data) {
//					if(data.result == 1) {} else if(data.result == 811) {
//						console.log('消息已查看');
//					} else if(data.result == 812) {
//						console.log('消息没有全部插入');
//					}
//				},
//				error: function() {
//					alert('fail');
//				}
//			});
//		}


//取消
$(".cancel").click(function() {
	$(this).css('color', '#fff');
	
});
//删除
$(".deletes").click(function() {
	$(this).css('color', '#fff');
	$(".check_box:checkbox").each(function() {
		if($(this).prop("checked") == true) {
			var messageIds = $(this).parent('li').attr("data-id");
			$(this).parent('li').remove();
			console.log(userId, token, messageIds)
			$.ajax({
				url: '/star/message/delete',
				type: "post",
				dataType: "json",
				data: {
					'userId': userId,
					'token': token,
					'messageIds': messageIds,
				},
				success: function(data) {
					if(data.result == 1) {
						console.log('删除消息成功');
					} else {
						console.log('删除消息失败');
					}
				},
				error: function() {
					alert('删除失败');
				}
			});
		}
	})
})

//$(function() {
//	
//	var pageNum=1
//	var refresh = {
//		init: function() {
//			$.ajax({
//				url: '/star/message/unReadList',
//				type: "post",
//				dataType: "json",
//				data: {
//					'userId': userId,
//					'token': token,
//					'pageNum': pageNum,
//					'pageSize': 15
//				},
//				success: function(data) {
////					console.log(data.data);
//					if(data.result == 1) {
//						if(pageNum > data.data.pages) {
//							pageNum =data.data.pages;
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
//							
//						} else {
//							var html = '';
//							$.each(data.data.list, function(obj, news) {
//								if(news.readStatus == 0) {
//									html += '<li data-id="' + news.id + '"><input class="check_box" type="checkbox"><div><h3><span>' + news.lastUpdatedTime.substring(0, 10) + '</span>' + news.title + '</h3><p><span></span>' + news.body + '</p></div></li>';
//								};
//								if(news.readStatus == 1) {
//									html += '<li data-id="' + news.id + '"><input class="check_box" type="checkbox"><div><h3><span>' + news.lastUpdatedTime.substring(0, 10) + '</span>' + news.title + '</h3><p>' + news.body + '</p></div></li>';
//								};
//							});
//							$('.mui-table-view').append(html);
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
//							pageNum++;
//						}
//					} else {
//						console.log('消息获取失败');
//					}
//				},
//				error: function() {
//					alert('fail');
//				}
//			});
//
//		}
//	};
//	refresh.init();
//

//
//})