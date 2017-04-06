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

	pullRefresh: {

		container: '#pullrefresh', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			height: 50, //可选.默认50.触发上拉加载拖动距离
			auto: true, //可选,默认false.自动上拉加载一次
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
	setTimeout(function() {
		count++;
		ajax(count)
	}, 150);
}

if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 1000);

	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();
	});
}

$(document).ready(function() {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
});

var url = "/star/dynamic/list";
var userId = localStorage.getItem('userId');
var token = localStorage.getItem('token');

//触发下拉时出发ajax
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
			
			if(count >= data.data.list.pages) {
				count = data.data.list.pages;
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			}

			if(data.result == 1) {
				var videoList = '';
				mui.each(data.data.list.list, function(obj, video) {

					videoList += '<div class="reContent">\
								<div class="reHeader">\
									<ul>\
										<li data-id="' + video.fromUserId + '"><a class="myhome"><img src="' + video.uAvatar + '" /></a></li>\
										<li>\
											<p class="reName"><span class="name">' + video.fromUserName + '</span><span class="yo-ico">' + video.createdTime.substring(0, 10) + '</span></p>\
										</li>\
									</ul>\
								</div>\
								<div class="reImg">\
									<video src="' + video.videoUrl + '" width="100%" height="100%" autobuffer="" autoplay="autoplay" style="position: relative;">当前浏览器不支持 video直接播放，点击这里下载视频</video>\
									<p class="reMess">' + video.name + '</p>\
								</div>\
								<ul class="reShare">\
									<li class="tap-share" data-thumbUrl="' + video.thumbUrl + '" data-videoUrl="' + video.videoUrl + '" data-videoName="' +
						video.name + '" data-id="' + video.id + '"><a class="share" href="#middlePopover"><i class="iconfont share">&#xe60a;</i>分享</a></li>\
									<li class="tap-comment"><a class="comment" href="javascript:void(0)"><i class="iconfont iconfont_comment">&#xe610;</i>评论</a></li>';
					if(video.isFavour == "1") {
						videoList += '<li class="tap-like"><i class="iconfont dianzan relike">&#xe60b;</i><span>' + video.hot + '</span></li></ul></div>';
					} else {
						videoList += '<li class="tap-like"><i class="iconfont dianzan">&#xe60b;</i><span>' + video.hot + '</span></li></ul></div>';
					}
				});
				$(".recommend").append(videoList);
			} else {
				popover('获取数据失败');
			}
		},
		error: function(xhr, type, errorThrown) {
		
			popover('请求失败');
		}
	})
};

function jsonAjax(type, url, param, datat, callback) {
	$.ajax({
		type: type, //类型 
		url: url, //地址 
		data: param, // 发送到服务器的数据
		dataType: datat, //数据返回类型json 
		success: callback,
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest, textStatus, errorThrown)
		}
	});
}
//进入他人主页
function jump() {
	mui('body').on('tap', '.myhome', function() {
		var otherid = $(this).parent('li').attr("data-id");
		localStorage.setItem('otherid', otherid);

		jsonAjax('post', '/star/user/getVisitInfo', {
			'userId': otherid,
			'visitUserId': userId
		}, 'json', function(data) {

			if(data.result == 1) {
				if(data.data.user.isOpenedHomepage) {
					window.location.href = '../html/myhome.html';
				} else {
					popover('该用户没有开通个人主页');
				}

			} else {
				popover('获取数据失败');
			}
		})
	})
}
jump();

//弹出层
function popover(text) {
	$('.layermcont').html(text);
	mui('#commentPopover').popover("show");
	$('#commentPopover').css({
		'zIndex': 998,
		'display': 'block'
	}).siblings('.mui-popover').css({
		'display': 'none'
	});
	setTimeout(function() {
		$('.mui-backdrop').css('display', 'none');
		mui('#commentPopover').popover("hide");
	}, 2000);
}

var shareId; // 分享视频ID
var imgSrc; // 头像
var userName; // 用户名
var videoTitle; // 视频标题
var videoUrl; // 视频地址
var videoName; //
var thumbUrl; // 视频缩略图地址

$(document).on("tap", function(e) {
	//	
	//	// 点击分享时获取视频ID

	if(e.target.className == "iconfont share") {

		//				mui('#pullre').pullRefresh().setStopped(true);//暂时禁止滚动	
		
		shareId = $(e.target).parent().parent().attr("data-id");
		videoUrl = $(e.target).parent().parent().attr("data-videoUrl");
		videoName = $(e.target).parent().parent().attr("data-videoName");
		thumbUrl = $(e.target).parent().parent().attr("data-thumbUrl");
		var reParent = $(e.target).parent().parent().parent();
		share(reParent);
	}
	if(e.target.className == "share") {
		//		mui('#pullre').pullRefresh().setStopped(true);//暂时禁止滚动	
		shareId = $(e.target).parent().attr("data-id");
		videoUrl = $(e.target).parent().attr("data-videoUrl");
		videoName = $(e.target).parent().attr("data-videoName");
		thumbUrl = $(e.target).parent().attr("data-thumbUrl");
		var reParent = $(e.target).parent().parent();
		share(reParent);
	}
	if(e.target.className == "tap-comment" || e.target.className == 'comment' || $(e.target).hasClass("iconfont_comment")) {

		popover('该视频未开启评论!');

	}

});
$('#middlePopover').css({
	'width': '100%',
	'height': '100%',
	'zIndex': 999
});
$('#commentPopover').css({
	'width': '100%',
	'height': '100%',
	'display': 'none'
});

//点赞
var clicktag = 0;
dianzan();

function dianzan() {
	mui('body').on("tap", '.dianzan', function() {
		if(clicktag == 0) {
			clicktag = 1;
		}
		if(clicktag == 1) {
			var videoId = $(this).parent().siblings('.tap-share').attr("data-id");
			var hotNum = parseInt($(this).parent().text().slice(1));

			if($(this).hasClass("relike")) {
				hotNum = hotNum - 1;
				$(this).removeClass("relike").next().text(hotNum);
			} else {
				hotNum = hotNum + 1;
				$(this).addClass("relike").next().text(hotNum);
			}
			$.ajax({
				type: "post",
				url: "/star/video/favour",
				data: {
					'userId': userId,
					'token': token,
					'videoId': videoId
				},
				success: function(data) {
					

				},
				error: function() {
					popover('请求失败');
				}
			});
			setTimeout(function() {
				clicktag = 0
			}, 1000)

		}

	});
}

//分享
function share(reParent) {

	imgSrc = reParent.siblings(".reHeader").find('img').attr('src');
	userName = reParent.siblings(".reHeader").find('.name').text();
	mobShare.config({
		debug: true, // 开启调试，将在浏览器的控制台输出调试信息	 
		appkey: '178ebbfdd38af', // appkey	 
		params: {
			url: videoUrl, // 分享链接
			title: videoName, // 分享标题
			description: '', // 分享内容
			pic: thumbUrl // 分享图片
		}
	});

	if(isWeiXin()) {
		$(".weixin").parent().css("display", "block");
		$(".friend").parent().css("display", "block");
	}

}
//微信
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}
// 举报
$("#reportPopover").on("tap", function(e) {
	var reason;
	if(e.target.innerHTML === "广告") {
		reason = 1;
		report();
	} else if(e.target.innerHTML === "色情") {
		reason = 2;
		report();
	} else if(e.target.innerHTML === "政治敏感") {
		reason = 3;
		report();
	} else if(e.target.innerHTML === "人身攻击") {
		reason = 4;
		report();
	} else if(e.target.innerHTML === "其他") {
		reason = 5;
		report();
	}

	function report() {
		jsonAjax('post', '/star/report/add', {
			'userId': userId,
			'token': token,
			'reportType': 1,
			'reason': reason,
			'videoId': shareId
		}, 'json', function(data) {
			if(data.result == "1") {
				popover('操作成功!');			
			}
		})

	}

});

// 关闭分享弹出层
$("#channel1").click(function() {
	mui('#middlePopover').popover('hide');
	//		mui('#pullre').pullRefresh().setStopped(false);//开启禁止滚动
});
// 关闭举报弹出层
$("#channel2").click(function() {
	mui('#reportPopover').popover('hide');
	//		mui('#pullre').pullRefresh().setStopped(false);//开启禁止滚动
});

// 分享到希望之星弹出层
$(".star").on("tap", function() {
	mui('#starPopover').popover('show');
	$("#starPopover").addClass("mui-active").attr("style", "top: 0.5rem;left: 0.12rem;");
	console.log(userName, videoName);
	var html = '';
	html += '<dt><img src="../images/' + imgSrc + '" alt="" /></dt>\
			 <dd><p class="star-user">@' + userName + '</p><p class="star-info">' + videoName + '</p></dd>';
	$(".star-content").html("").append(html);
	if($(".star-info").css("height") <= "21px") {
		$("dd p").css("margin-top", "0px");
	}
});

// 关闭希望之星分享
$("#star-close").on("tap", function() {
	$(".star-text").val("说点什么吧(20字以内)").css("color", "#858585").siblings("#star-btn").css({
		"color": "#fff",
		"background-color": "#343240"
	}).attr("disabled", "disabled");
	mui('#starPopover').popover('hide');

});

//// 填写评论信息
$(".star-text").focus(function() {
	if($(this).val() == "说点什么吧(20字以内)") {
		$(this).val("").css("color", "#fff");
	}
	$(this).keyup(function() {
		$(this).siblings("#star-btn").removeAttr("disabled").css("background-color", "#ff004d");
		if($(this).val() == "") {
			$(this).siblings("#star-btn").attr("disabled", "disabled").css("background-color", "#343240");
		}
	});
});
$(".star-text").blur(function() {
	if($(this).val() == "") {
		$(this).val("说点什么吧(20字以内)").css("color", "#858585").siblings("#star-btn").css({
			"color": "#fff",
			"background-color": "#343240"
		}).attr("disabled", "disabled");
	}
})

//// 分享转发到我的希望之星
$("#star-btn").on("tap", function() {
	var comment = $(this).siblings(".star-text").val();

	if(comment != "说点什么吧(20字以内)" && comment != "") {
		$.ajax({
			type: "post",
			url: "/star/share/add",
			data: {
				'userId': userId,
				'token': token,
				'videoId': shareId,
				'comment': comment
			},
			dataType: "json",
			success: function(data) {
				if(data.result == "1") {
					popover('分享成功!');
				} else if(data.result == "803") {
					popover('分享评论超过20个字!');
				} else if(data.result == "401") {
					popover('视频不存在!');
				} else if(data.result == "406") {
					popover('不能分享自己的视频!');
				} else if(data.result == "408") {
					popover('视频已分享!');
				}
				window.setTimeout(function() {
					mui('#starPopover').popover('hide');
				}, 2000);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(xhr, type, errorThrown);
			}
		});
	}
});
//返回顶部

// 	$('#back-to-top').on('tap', function(e) {
//			e.stopPropagation();
//			mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 1000);//滚动到顶部
//			window.scrollTo(0, 1000);
//	});

//$(function() {
//	var userId = localStorage.getItem('userId');
//	var token = localStorage.getItem('token');
//	var active = {
//		init: function() {
//			var _this = this;
//			_this.other();
//			_this.load();
//		},
//		load: function() {
//			$.ajax({
//				type: "post",
//				url: '/star/dynamic/list',
//				dataType: "json",
//				data: {
//					'userId': userId,
//					'token': token
//				},
//				success: function(data) {
//					if(data.result == 1) {
//						console.log(data);
//						//						var videoList = '';	
//						//						$.each(data.data.videoList, function(obj, video) {							
//						//							videoList += '<div class="reContent">\
//						//								<div class="reHeader">\
//						//									<ul>\
//						//										<li data-id="' + video.userId + '"><a  class="myhome"><img src="' + video.uAvatar + '" /></a></li>\
//						//										<li>\
//						//											<p class="reName"><span>' + video.uName + '</span><span class="yo-ico">' + video.auditTime.substring(0, 10) + '</span></p>\
//						//										</li>\
//						//									</ul>\
//						//								</div>\
//														<div class="reImg">\
//															<video src="' + video.videoUrl + '" width="100%" height="100%" autobuffer="" autoplay="autoplay" style="position: //relative;">当前浏览器不支持 video直接播放，点击这里下载视频</video>\
//				<p class="reMess">' + video.name + '</p>\
//						//								</div>\
//						//								<ul class="reShare">\
//						//									<li class="tap-comment"><span class="iconfont">&#xe60a;</span>分享</li>\
//						//									<li class="tap-comment"><span class="iconfont">&#xe610;</span>评论</li>\
//						//									<li class="tap-like"><span class="iconfont rehear">&#xe60b;</span>' + video.hot + '</li>\
//						//								</ul>\
//						//							</div>';
//					};
//					//						$('.recommend').append(videoList);
//					//						var myScroll = new IScroll("#index-scroll", {
//					//							click: true,
//					//							tap: true
//					//						});
//					//						$('.myhome').on('click',function(){
//					//							var otherid = $(this).parent('li').attr("data-id");			
//					//							localStorage.setItem('otherid',otherid);	
//					//							window.location.href='../html/myhome.html';		
//					//						})
//					//						$('.tap-comment').on('click',function(){
//					//							layer.open({content: '该视频未开启评论!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
//					//						})
//					//					}else{
//					//						layer.open({content: '网络出错,请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
//					//					}
//					//				},
//					//				error: function() {
//					//					layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
//					//				}
//				}
//			})
//		},
//		other: function() {
//			//			var menu = null,
//			//				main = null;
//			//			var showMenu = false;
//			//			mui('.mui-bar').on('tap', 'a', function() {
//			//				var id = this.getAttribute('href');
//			//				var href = this.href;
//			//				mui.openWindow({
//			//					id: id,
//			//					url: this.href,
//			//					styles: {
//			//						top: 0,
//			//						bottom: '50px',
//			//						bounce: 'vertical'
//			//					}
//			//				})
//			//			})
//			//			$('.gomenu').click(function() {
//			//				window.location.href = '../html/menu.html';
//			//			});
//			//			$('.gostar').click(function() {
//			//				window.location.href = '../html/star.html';
//			//			});
//			//			$('.gomyhome').click(function() {
//			//				window.location.href = '../html/myhome.html';
//			//			});
//			//			$('.btn-search').click(function() {
//			//				window.location.href = '../html/menu.html';
//			//			});
//		}
//	}
//	active.init();
//})