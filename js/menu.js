$(function() {
	var userId=localStorage.getItem('userId'),
		token=localStorage.getItem('token');
							
	var menu = {
		init: function() {
			var _this = this;
			_this.getHotWords();
			_this.other();
		},
		search: function(name) {
			var _this = this;
			$('.related-video').show().siblings().hide();
			$('.related-video ul').empty();
			$.ajax({
				url: "/star/search",
				type: "post",
				dataType: "json",
				data: {'userId': userId,'token': token,'name': name},
				success: function(data) {
					var length = data.data.videoList.list.length;
					console.log(length);
					console.log(data);
					switch(data.result){
						case "1":	
							var videolist = '';
//								var userlist = '';
							if(length > 0) {
								//搜索视频								
								$.each(data.data.videoList.list, function(obj,video) {
									videolist += '<li><img src="' + video.thumbUrl + '"><div class="avator"><img src="' + video.uAvatar + '"><span>' + video.uName + '</span><span class="fr iconfont">&#xe60f;' + video.hot + '</span></div><h3>' + video.name + '</h3></li>';
								});
								//搜索用户
//								$.each(data.data.userList.list, function(obj,user) {
//									userlist += '<li><a><img src="' + user.avatar + '" /></a><span>' + user.name + '</span></li>';
//								});

							} else {
								videolist += '<div class="backImg"><span>未找到相关内容</span></div>';
							};
//							$('.gomyhome').before(userlist);
							$('.related-video ul').append(videolist);
							break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
				},
				eerror: function() {
					layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
			});
			
		},
		other:function(){
			var _this = this;
			$('.sRemove').on('click', function() {
				window.history.go(-1);
			});
			//快速清空搜索框
			$('.sHeader input').on('input  propertychange', function() {
				if($('.sText').val() !== "" && $('.sText').val() !== $('.sText').attr('placeholder')) {
					$('.btn-search').removeAttr('disabled');
					$(this).next().show();
				} else {
					$('.btn-search').attr('disabled', 'disabled');
					$(this).next().hide();
				}
			})
			$('.icon-close').on('click', function() {
				$(this).hide().prev().val('');
			})
			$('.btn-search').on('click', function() {				
				var name = $('.sText').val();
				_this.search(name);
			})
		},
		getHotWords:function(curr){
			var _this = this,
				curr = curr==undefined?"1":curr;
			$.ajax({
				url: "/star/user/getHotWords",
				type: "post",
				dataType: "json",
				data: {'userId': userId,'token': token,'pageNum':curr},
				success: function(data) {
					var pages = data.data.pages;
					switch(data.result){
						case "1":
							var html = '';
							$.each(data.data.list, function(obj,hotwords) {
								html += '<a class="hotWords">' + hotwords +'</a>';
							});
							$('.sHot ul').append(html);							
							// 更多热搜
			        		laypage({
								cont: 'moreS', //容器。值支持id名、原生dom对象，jquery对象,
								pages: pages, //总页数
								curr: data.data.pageNum || 1, //当前页
								groups: 0, //连续分数数0
								prev: false, //不显示上一页
								next: '更多搜索',
								skin: 'flow', //设置信息流模式的样式
								jump: function(obj, first){ //触发分页后的回调
									if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
					                	_this.getHotWords(obj.curr);
					                }
					                if(obj.curr >= pages) {
										$('.page_nomore').on('click',function(){
											layer.open({content: '没有更多热搜了',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
										})
									}
								}
							});
							$('.hotWords').on('click',function(){
								var name = $(this).text();
								_this.search(name);
							})
							break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
				},
				error: function() {
					layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
			});
		}
	}
	menu.init();
});
