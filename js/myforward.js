;$(function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5*2 + "px";

	
	var userId = localStorage.getItem('userId'),
		token = localStorage.getItem('token'),
		pageNum = 1;
		
	mui.init({
		swipeBack:true, //启用右滑关闭功能
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				auto:true,
				callback: pullupRefresh
			}
		}
	});	
	// 刷新
	function pulldownRefresh() {
		setTimeout(function() {
			$.ajax({
				type:"post",
				url:"/star/video/share/list",
				data: {'userId':userId,'token':token,'status':'1','pageNum':1},
				success: function(data){
					$(".mui-table-view").html("");
					init(data);
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
					del();
				}
			});	
		}, 1500);
	}
	// 加载 
	function pullupRefresh() {
		$.ajax({
			type: "POST",
			url: "/star/video/share/list",
			data: {'userId':userId,'token':token,'status':'1','pageNum':pageNum},
    		dataType:"json",
    		success: function(data){
    			switch(data.result){
    				case "1":
    					var length = data.data.list.length;
		        		if(length == 0){
		        			var html = '<div class="backImg"><span>还没转发呢~</span></div>';
		        			$("#pullrefresh").html(html);
		        			mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		        		}else if(pageNum <= data.data.pages){
		        			init(data);
		        			pageNum++;
		        			del();
		        			goVideoDetails();
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		        		}else{
		        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		        		}
		        		break;
    				case "200": layer.open({content: '用户名不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
	        		case "217": layer.open({content: '用户未开启个人主页',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
    			}
   
    		}
		});
	}
	
	
	// 初始化
	function init(data){
		var html = "";
		var users = data.data.list;
		
		$(users).each(function(index,ele){
			var user = ele;
			var time = user.sharedTime.slice(0,10).replace(/-/g,'/');
			html += '<li class="mui-table-view-cell" data-id="'+ user.id +'">\
						<div class="header">\
							<p class="title">' + user.comment + '</p>\
							<p class="delet"><span class="mui-icon mui-icon-trash"></span></p>\
						</div>\
						<div class="goVideoDetails">\
							<img src=' + user.uAvatar + '>\
							<div class="mui-media-body">\
								<p class="viedoname">' + user.name + '</p>\
								<p class="author">@' + user.fromUserName + '</p>';
					
			if(user.isFavour == "1"){
				html += '<p class="favour"><span class="mui-icon-extra mui-icon-extra-heart-filled active"></span><span>' + user.hot + '</span></p>';
			}else{
				html += '<p class="favour"><span class="mui-icon-extra mui-icon-extra-heart-filled"></span><span>' + user.hot + '</span></p>';
			}
			
			html += '<p class="date">' + time + '</p>\
						</div>\
					</div>\
				</li>';
		});     		
		$(".mui-table-view").append(html);	
	}

	
	//	 删除分享
	function del(){
		$(".mui-icon-trash").on("tap",function(){
			var _this = $(this);
			mui.confirm('确认删除？', function(e) {
				if (e.index == 1) {//确认
					var $del = _this.parent().parent().parent();
					$del.remove();
					var videoId = $del.attr("data-id");				
					$.ajax({
						type: "POST",
						url: "/star/share/delete",
						data :{'userId':userId,'videoIds':videoId,'token':token},
						dataType: "json",
						success: function(data){
							console.log(data);
							switch(data.result){
					        	case "1":
					        		layer.open({content: '删除成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					        		break;    		
					        	case "100": layer.open({content: '请求参数不正确',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					        	case "409": layer.open({content: '视频在广告中',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					        	case "410": layer.open({content: '视频在推荐中',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					        	case "401": layer.open({content: '视频不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
								default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
	   						 }        
						}
					});	
				}
			});
		});
	}
	
	function goVideoDetails(){
		// 跳转到视频详情页
		$(".goVideoDetails").on("tap",function(){
			var videoId = $(this).parent().attr("data-id");
			window.localStorage.setItem("videoId",videoId);
			window.location.href = '../html/videodetails.html';
		});
	}
		
})

	