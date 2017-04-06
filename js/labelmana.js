function getStyle(obj,attr){  
	$('.addtags').on('click',function(){
		window.location.href='../html/addtags.html';
	});
    var ie = !+"\v1";//简单判断ie6~8  
 if(attr=="backgroundPosition"){//IE6~8不兼容backgroundPosition写法，识别backgroundPositionX/Y  
  if(ie){         
   return obj.currentStyle.backgroundPositionX +" "+obj.currentStyle.backgroundPositionY;  
     }  
 }  
  return document.defaultView.getComputedStyle(obj,null)[attr];  
} 

function getCurrentTab(){
	var color = getStyle(document.getElementById("firstTab"),"color");
	if(color == "rgb(203, 33, 119)"){
		return 1;
	}else{
		return 2;
	}
}

$('.addtags').on('click',function(){
	window.location.href='../html/addtags.html';
})

$(function() {
	var userId = localStorage.getItem('userId'),
		token = localStorage.getItem('token');
		
		var firstPageNum = 1;	//第一个当前页数
		var secondPageNum = 1;	//第二个tab当前页数
		
		var isAvaliableLastPage = false;	//可使用是否是最后一页
		var isReviewLastPage = false;	//审核中是否是最后一页
		
		var currentTab = 1;	//当前所在tab
		
		var action = 1;	//操作 1、下拉 2、上拉
	mui.init();
	
	(function($) {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		$('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
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
							
							action = 1;
							
							var currentTab = getCurrentTab();
							if(currentTab == 1){
								firstPageNum = 1;
								isAvaliableLastPage = false;
								labelmana.loadFirstTab();
							}
							if(currentTab == 2){
								secondPageNum = 1;
								isReviewLastPage = false;
								labelmana.loadSecondTab();
							}
						}
					},
					up: {
						callback: function() {
							action = 2;
							var self = this;
							
							var currentTab = getCurrentTab();
							if(currentTab == 1 && isAvaliableLastPage){
								document.getElementsByClassName("mui-pull-loading")[0].innerHTML = "没有更多数据了";
							}
							if(currentTab == 2 && isReviewLastPage){
								document.getElementsByClassName("mui-pull-loading")[1].innerHTML = "没有更多数据了";
							}
							
							setTimeout(function() {
								var ul = self.element.querySelector('.mui-table-view');
								self.endPullUpToRefresh();
								
								if(currentTab == 1){
									if(isAvaliableLastPage){
										document.getElementsByClassName("mui-pull-loading")[0].innerHTML = "";
									}
								}
								if(currentTab == 2){
									if(isReviewLastPage){
										document.getElementsByClassName("mui-pull-loading")[1].innerHTML = "";
									}
								}
							}, 1000);
							
							if(
								((currentTab == 1) && isAvaliableLastPage)
								|| ((currentTab == 2) && isReviewLastPage)
								){
									return;
							}
							
							var currentTab = getCurrentTab();
							if(currentTab == 1){
								labelmana.loadFirstTab();
							}
							if(currentTab == 2){
								labelmana.loadSecondTab();
							}
						}
					}
				});
			});

		});
	})(mui);
	var labelmana = {
		init: function() {
			var _this = this;
			_this.loadFirstTab();
			_this.loadSecondTab();
		},
		loadFirstTab: function(status) {
			$.ajax({
				url: "/star/tag/user/list",
				type: "post",
				dataType: "json",
				data: {
					'userId': userId,
					'token': token,
					'pageNum':firstPageNum,
					'pageSize': 10,
					'status': 1
				},
				success: function(data) {
					console.log(data);
					var length = data.data.list.length;
					
					switch(data.result) {
						case "1":
							var html = '';
//							console.log(length);

							if(length > 0) {
								$.each(data.data.list, function(obj, tags) {
									html += '<li data-id="' + tags.id + '" class="mui-table-view-cell">' + tags.content + '</li>';
								});
							} else {
								html += '<div class="backImg"><span>没有对应的信息!</span></div>';
							};
							
							if(data.data.pageNum >= data.data.pages){
									isAvaliableLastPage = true;
								}
							
							
							if(action == 1){
								$('#item1mobile .mui-table-view').html(html);
							}

							if(action == 2){
								$('#item1mobile .mui-table-view').append(html);
							}
							firstPageNum++;
							break;
						case "200":
							alert('用户不存在');
							break;
						default:
							alert('网络出错，请重试');
							break;
					}
				},
				error: function() {
					alert('获取失败');
				}
			});
		},
		loadSecondTab: function(status) {
			$.ajax({
				url: "/star/tag/user/list",
				type: "post",
				dataType: "json",
				data: {
					'userId': userId,
					'token': token,
					'pageNum':secondPageNum,
					'pageSize': 10,
					'status': 0
				},
				success: function(data) {
					console.log(data);
					var length = data.data.list.length;
					switch(data.result) {
						case "1":
							var html = '';
//							console.log(length);
							if(length > 0) {
								$.each(data.data.list, function(obj, tags) {
									html += '<li data-id="' + tags.id + '" class="mui-table-view-cell">' + tags.content + '</li>';
								});
							} else {
								html += '<div class="backImg"><span>没有对应的信息!</span></div>';
							};
							
							if(data.data.pageNum >= data.data.pages){
								isReviewLastPage = true;
							}
							
							
							if(action == 1){
								$('#item2mobile .mui-table-view').html(html);
							}

							if(action == 2){
								$('#item2mobile .mui-table-view').append(html);
							}
							secondPageNum++;
							break;
						case "200":
							alert('用户不存在');
							break;
						default:
							alert('网络出错，请重试');
							break;
					}
				},
				error: function() {
					alert('获取失败');
				}
			});
		},
	}
	labelmana.init();
});