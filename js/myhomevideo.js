var index;
var userId = localStorage.getItem('userId'),
	token = localStorage.getItem('token'),
	vdpageNum = 1,
	fwpageNum = 1,
	flpageNum = 1,
	fspageNum = 1;

function init(data){
	var html = '';
	$.each(data.data.list, function(index, ele) {
		var time = ele.createdTime.slice(0,10).replace(/-/g,'-');
		html += '<div class="reContent">\
					<div class="reHeader">\
						<ul>\
							<li><img src="'+ ele.uAvatar +'" /></li>\
							<li>\
								<p class="reName"><span>'+ ele.uName +'</span><span class="yo-ico">'+ time +'</span></p>\
							</li>\
						</ul>\
					</div>\
					<div class="reImg">\
						<video src="'+ ele.thumbUrl +'" width="100%" height="100%" autobuffer autoplay="autoplay" style="position: relative;">当前浏览器不支持 video直接播放，点击这里下载视频</video>\
						<p class="reMess">'+ ele.name +'</p>\
					</div>\
					<ul class="reShare">\
						<li><span class="iconfont">&#xe60a;</span>分享</li>\
						<li class="gocomment"><span class="iconfont">&#xe610;</span>评论</li>\
						<li><span class="iconfont rehear" action-type="tap.dianzan">&#xe60b;</span>'+ ele.hot +'</li>\
					</ul>\
				</div>';
	});
	return html;
}

function initfans(data){
	var html = '';
	$.each(data.data.list, function(index, ele) {
		html += '<li><a href="../html/myhome.html"><img src="' + ele.avatar + '" /><span class="reName">' + ele.name + '</span></a></li>';
	});
	return html;
}



pullupRefresh1();
pullupRefresh2();
pullupRefresh3();



mui.init({
	pullRefresh: {
		container: '#pullre',
		up: {
			contentrefresh: '正在加载...',
			callback: pullup
		}
	}
});											
if (mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullre').pullRefresh().pullupLoading();
		}, 1000);
	});
} else {
	mui.ready(function() {
		mui('#pullre').pullRefresh().pullupLoading();
	});
}

				
function pullup(){
	if(index == 0){
		pullupRefresh0();	
	}
	if(index == 1){
		pullupRefresh1();
	}
	if(index == 2){
		pullupRefresh2();
	}
	if(index == 3){
		pullupRefresh3();
	}else{
		pullupRefresh0();	
	}
}


// 视频
function pullupRefresh0() {
	$.ajax({
		type: "post",
		url: "/star/video/visit/list",
		data: {'userId': userId,'token': token,'visitUserId':3930,'pageNum': vdpageNum,'pageSize': 5},
		dataType:"json",
		success: function(data){
			console.log(data);
			var length = data.data.total;
			$("#videoNum").html(length);
			if(vdpageNum < data.data.pages){
				$('#videoTab').append(init(data));
				vdpageNum++;
				$(".mui-pull-bottom-pocket").removeClass("mui-visibility");
				mui('#pullre').pullRefresh().endPullupToRefresh(false); // 还有更多数据				
			}else if(vdpageNum = data.data.pages){
				$('#videoTab').append(init(data));
				$(".mui-pull-bottom-pocket").addClass("mui-visibility");
				mui('#pullre').pullRefresh().endPullupToRefresh(true); // 没有更多数据
			}
			
		}
	});
}
// 转发
function pullupRefresh1() {
	$.ajax({
		type: "POST",
		url: "/star/video/share/list",
		data: {'userId': userId,'token': token,'visitUserId':3930,'pageNum': fwpageNum},
		dataType:"json",
		success: function(data){
			var length = data.data.total;
			$("#forwardNum").html(length);
			if(fwpageNum < data.data.pages){
				$('#forwardTab').append(init(data));
				fwpageNum++;
				$(".mui-pull-bottom-pocket").removeClass("mui-visibility");
//				mui('#pullre').pullRefresh().endPullupToRefresh(false); // 还有更多数据				
			}else if(fwpageNum = data.data.pages){
				$('#forwardTab').append(init(data));
				$(".mui-pull-bottom-pocket").addClass("mui-visibility");
//				mui('#pullre').pullRefresh().endPullupToRefresh(true); // 没有更多数据
			}
			
		}
	});
}

// 关注
function pullupRefresh2() {
	$.ajax({
		type: "POST",
		url: "/star/user/followed/list",
		data: {'userId': userId,'token': token,'visitUserId':3930,'pageNum': flpageNum},
		dataType:"json",
		success: function(data){
			var length = data.data.total;
			$("#attentionNum").html(length);
			if(flpageNum < data.data.pages){
				$('#attentionTab').append(initfans(data));
				flpageNum++;
				$(".mui-pull-bottom-pocket").removeClass("mui-visibility");
//				mui('#pullre').pullRefresh().endPullupToRefresh(false); // 还有更多数据				
			}else if(flpageNum = data.data.pages){
				$('#attentionTab').append(initfans(data));
				$(".mui-pull-bottom-pocket").addClass("mui-visibility");
//				mui('#pullre').pullRefresh().endPullupToRefresh(true); // 没有更多数据
			}
			
		}
	});
}

// 粉丝
function pullupRefresh3() {
	$.ajax({
		type: "POST",
		url: "/star/user/fans/list",
		data: {'userId': userId,'token': token,'visitUserId':3930,'pageNum': fspageNum},
		dataType:"json",
		success: function(data){
			var length = data.data.total;
			$("#fansNum").html(length);
			if(fspageNum < data.data.pages){
				$('#followTab').append(initfans(data));
				fspageNum++;
				$(".mui-pull-bottom-pocket").removeClass("mui-visibility");
//				mui('#pullre').pullRefresh().endPullupToRefresh(false); // 还有更多数据				
			}else if(fspageNum = data.data.pages){
				$('#followTab').append(initfans(data));
				$(".mui-pull-bottom-pocket").addClass("mui-visibility");
//				mui('#pullre').pullRefresh().endPullupToRefresh(true); // 没有更多数据
			}
			
		}
	});
}	
				
				
		
//左右滑动
var homehotSwiper = new Swiper('#home-hot-swiper', {
	loop: false,
	onTransitionStart: function() {
		$('#home-hot-nav li').eq(self.homehotSwiper.activeIndex).addClass('active').siblings().removeClass('active');
		switch(self.homehotSwiper.activeIndex){
			case 0:
				index = 0;
				break;
			case 1:
				index = 1;
				break;		
			case 2:
				index = 2;
				break;
			case 3:
				index = 3;
				break;						
		}						
	}
});

$(document).ready(function(){
	
document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";




});