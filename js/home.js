var userId = localStorage.getItem("userId"),
	token = localStorage.getItem("token"),
	matchAreaId = localStorage.getItem("matchAreaId"),
	matchArea = localStorage.getItem("matchArea"),
	matchId = localStorage.getItem("matchId"),
	match = localStorage.getItem("match"),
	matchAgeId = localStorage.getItem("matchAgeId"),
	matchAge = localStorage.getItem("matchAge");
var matchNum = 1;
if(matchAreaId == null) {
	matchAreaId = 0;
}
if(matchId == null) {
	matchId = 0;
}
if(matchAgeId == null) {
	matchAgeId = 0;
}

if(matchAreaId == 0 && matchId == 0 && matchAgeId == 0) {
	$(".hot-nav").append("<i>全国</i>");
} else if(matchAgeId == 0) {
	$(".hot-nav").append("<i>" + matchArea + "-</i><i>" + match + "</i>");
} else {
	$(".hot-nav").append("<i>" + matchArea + "-</i><i>" + match + "-</i><i>" + matchAge + "</i>");
}

mui.init({
	pullRefresh: {
		container: '#matchRefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: matchPullupRefresh
		}
	},
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: false, //默认为false，不监听
		release: false //默认为false，不监听
	}
});
if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#matchRefresh').pullRefresh().pullupLoading();
		}, 1000);

	});
} else {
	mui.ready(function() {
		mui('#matchRefresh').pullRefresh().pullupLoading();
	});
}

function matchPullupRefresh() {
	$.ajax({
		type: "post",
		url: "/star/video/match/list",
		data: {
			'userId': userId,
			'token': token,
			'pageNum': matchNum,
			'matchAreaId': matchAreaId,
			'matchId': matchId,
			'matchAgeId': matchAgeId,
			'pageSize': 10
		},
		dataType: "json",
		success: function(data) {

			if(data.result == 1) {
				if(matchNum <= data.data.videoList.pages) {
					matchListInit(data);
					matchNum++;
					mui('#matchRefresh').pullRefresh().endPullupToRefresh(false);
				} else {
					mui('#matchRefresh').pullRefresh().endPullupToRefresh(true);
				}
			}

			mui('.mui-scroll-wrapper').scroll({
				indicators: false //是否显示滚动条
			});
			tap.other();
		}
	});
}
$("#goSelect").on("tap", function() {
	mui.openWindow({
		url: "select.html"
	});
});

function matchListInit(data) {
	var matchList = '';
	$.each(data.data.videoList.list, function(index, ele) {
		matchList += '<li>\
							<p class="goVideoDetails" data-videoId="' + ele.id + '">\
								<img src="' + ele.thumbUrl + '">\
							</p>\
							<div class="avator" data-visitUserId="' + ele.userId + '">\
								<img src="' + ele.uAvatar + '">\
							</div>\
							<p><span>' + ele.uName + '</span>';
		if(ele.isFavour == 1) {
			matchList += '<span class="iconfont rehear">&#xe60f;</span><span>' + ele.hot + '</span>';
		} else {
			matchList += '<span class="iconfont">&#xe60f;</span><span>' + ele.hot + '</span>';
		}
		matchList += '</p><p>' + ele.name + '</p>\
						</li>';
	});
	$("#matchList").append(matchList);

}

var tap = {
	init: function() {
		var _this = this;
		_this.ad();
		_this.other();
	},
	ad: function() {
		$.ajax({
			type: "post",
			url: "/star/video/advert/list",
			dataType: "json",
			success: function(data) {
				if(data.result == 1) {
					var advertList = '<div class="swiper-wrapper">';
					$.each(data.data, function(index, ele) {
						advertList += '<div class="swiper-slide advert" data-h5Url="' + ele.h5Url + '" style="background-image:url(' + ele.imageUrl + ')"></div>';
					});
					advertList += '</div><div class="swiper-pagination"></div>';
					$("#upswiper").append(advertList);
					var upSwiper = new Swiper('#upswiper', {
						loop: true,
						pagination: '.swiper-pagination',
						grabCursor: true,
						autoplay: 3000,
						autoplayDisableOnInteraction: false,
					});
				}
			}
		});
	},
	other: function() {
		document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";

		document.querySelector('#item1mobile').addEventListener("swiperight", function() {
			mui("#main").slider().gotoItem(0);
		});

		$(document).on("tap", function(e) {
			var target = $(e.target);
			if(target.hasClass("advert")) { // 广告链接
				var goh5Url = target.attr("data-h5Url");
				//window.location.href = goh5Ur;
				mui.openWindow({
					url: goh5Ur
				});
			} else if(target.parent().hasClass("goVideoDetails")) {
				var videoId = target.parent().attr("data-videoid");
				localStorage.setItem("videoId", videoId);
				mui.openWindow({
					url: "videodetails.html"
				});
			} else if(target.parent().hasClass("avator")) {
				var visitUserId = target.parent().attr("data-visitUserId");
				localStorage.setItem("otherid", visitUserId);
				mui.openWindow({
					url: "myhome.html"
				});
			}
		});
	}
}
tap.init();
//我秀部分的功能
$(function() {
	mui.init();
	(function($) {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		$('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: false, //是否显示滚动条
			deceleration: deceleration
		});
		$.ready(function() {
			//循环初始化所有下拉刷新，上拉加载。
			$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				$(pullRefreshEl).pullToRefresh({
					down: {
						callback: function() {
							var self = this;
							setTimeout(function() {
								var ul = self.element.querySelector('.mui-table-view');
								self.endPullDownToRefresh();
							}, 1000);
						}
					},
					up: {
						callback: function() {
							var self = this;
							setTimeout(function() {
								var ul = self.element.querySelector('.mui-table-view');
								self.endPullUpToRefresh();
							}, 1000);
							if(xiu.xiuNum[xiu.items.index()] < xiu.pages[xiu.items.index()]){
								xiu.xiuNum[xiu.items.index()] ++;
								xiu.load(xiu.xiuClass,xiu.items,xiu.xiuNum[xiu.items.index()]);
							}else{
								xiu.items.find(".mui-pull-bottom-wrapper").text("没有更多数据了");
								return;
							}

						}
					}
				});
			});

		});
		
	})(mui);
	var xiu = {
		init: function(){
			var _this = this;
			_this.category();
			_this.load(_this.xiuClass,_this.items);
			_this.tabload();
		},
		category: function(){
			$.ajax({
				type:"get",
				url:"/star/video/xiu/category",
				dataType:"json",
				success: function(data){
					switch(data.result){
						case "1":
							var category = '';
							$.each(data.data.xiuClassList, function(obj, categorys) {
								var index = obj+2;
								category += '<a class="mui-control-item" href="#item' + index + 'mobile">' + categorys.name +'</a>';
							});
							$('#sliderSegmentedControl .mui-scroll').append(category);
							break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
				},
				error: function() {
					layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
			});
		},
		load: function(xiuClass,items,pageNum){
			var pageNum = pageNum==undefined?1:pageNum;
			var _this = this;
			$.ajax({
				type:"post",
				url:"/star/video/xiu/list",
				data: {'userId': userId,'token': token,'xiuClass':xiuClass,'pageNum':pageNum},
				dataType:"json",
				success: function(data){
					_this.pages[items.index()] = data.data.videoList.pages;
					switch(data.result){
						case "1":
							var hotlist = '';
							$.each(data.data.videoList.list, function(obj, hot) {
								hotlist += '<li class="mui-table-view-cell">\
								<p class="goVideoDetails" data-videoid="' + hot.id + '"><img src="' + hot.thumbUrl + '"></p>\
								<div class="avator" data-visituserid="' + hot.userId + '"><img src="' + hot.uAvatar + '"></div>\
								<p><span>' + hot.uName + '</span>\
								<span class="yo-ico iconfont">&#xe60f;' + hot.hot + '</span></p>\
								<p>' + hot.name + '</p>\
								</li>';
							});
							items.find('.mui-table-view').append(hotlist);
							break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
				},
				error: function() {
					layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
			});
		},
		tabload:function(){
			var _this = this;
			document.getElementById('slider').addEventListener('slide', function(e) {
				_this.xiuClass = e.detail.slideNumber;
				_this.items = $('#item'+ (e.detail.slideNumber+1) +'mobile');
				if(_this.items.find(".matchList>li").length==0){
					xiu.load(_this.xiuClass,_this.items);
				}
			});
		},
		items: $('#item1mobile'),
		xiuNum: ["1","1","1","1"],
		xiuClass: 0,
		pages:[]
	}
	xiu.init();
})