//document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
//var userId = localStorage.getItem("userId"),
//	token = localStorage.getItem("token");

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
							if(xiu.hotNum[xiu.items.index()] < xiu.pages[xiu.items.index()]){
								xiu.hotNum[xiu.items.index()] ++;
								xiu.load(xiu.xiuClass,xiu.items,xiu.hotNum[xiu.items.index()]);
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
				data: {'userId': userId,'token': token,'xiuClass':xiuClass,'pageNum':pageNum,'pageSize':3},
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
		hotNum: ["1","1","1","1"],
		xiuClass: 0,
		pages:[]
	}
	xiu.init();
})