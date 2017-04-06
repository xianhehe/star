$(document).ready(function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
});

var userId = localStorage.getItem('userId'),
	token = localStorage.getItem('token');
$(function() {
	var find = {
		init: function() {
			var _this = this;
			_this.discover();
			_this.other();
		},
		discover: function() {
			$.ajax({
				type: "post",
				url: '/star/discover/list',
				dataType: "json",
				data: {
					'userId': userId,
					'token': token
				},
				success: function(data) {
					switch(data.result) {
						case "1":
							var matchList = '';
							var videoList = '';
							$.each(data.data.matchList, function(obj, match) {
								matchList += '<li><a href="' + match.linkUrl + '"><img src="' + match.imageUrl + '" /></a></li>';
							});
							$.each(data.data.videoList, function(obj, video) {
								videoList += '<div class="reContent">\
									<div class="reHeader">\
										<ul>\
											<li data-id="' + video.userId + '"><a  class="myhome"><img src="' + video.uAvatar + '" /></a></li>\
											<li>\
												<p class="reName"><span>' + video.uName + '</span><span class="yo-ico">' + video.auditTime.substring(0, 10) + '</span></p>\
											</li>\
										</ul>\
									</div>\
									<div class="reImg">\
										<video src="' + video.videoUrl + '" width="100%" height="100%" autobuffer="" autoplay="autoplay" style="position: relative;">当前浏览器不支持 video直接播放，点击这里下载视频</video>\
										<p class="reMess">' + video.name + '</p>\
									</div>\
									<ul class="reShare">\
										<li class="tap-share" data-thumbUrl="' + video.thumbUrl + '" data-videoUrl="' + video.videoUrl + '" data-videoName="' + video.name + '" data-id="' + video.id + '"><a class="share" href="#middlePopover"><i class="iconfont share">&#xe60a;</i>分享</a></li>\
										<li class="tap-comment"><i class="iconfont">&#xe610;</i>评论</li>';
								if(video.isFavour == "1") {
									videoList += '<li class="tap-like"><i class="iconfont dianzan relike">&#xe60b;</i><span>' + video.hot + '</span></li></ul></div>';
								} else {
									videoList += '<li class="tap-like"><i class="iconfont dianzan">&#xe60b;</i><span>' + video.hot + '</span></li></ul></div>';
								}
							});
							$('.mSearch ul').append(matchList);
							$('.recommend').append(videoList);
							//明星榜
	//						var starList = '';
	//						$.each(data.data.starList, function(obj, star) { 
	//							starList += '<li><span>' + star.name + '</span><div class="gomyhome"><img src="' + star.avatar + '" /></div></li>';
	//						});
	//						$('.mStarList').append(starList);
							var myScroll = new IScroll("#index-scroll", {
								click: true,
								tap: true
							});
							$('.myhome').on('click', function() {
								var otherid = $(this).parent('li').attr("data-id");
								$.ajax({
									type:"post",
									url:"/star/user/getVisitInfo",
									data: {'userId':userId,'token':token,'visitUserId':otherid},
									success: function(data){
										if(data.data.user.isOpenedHomepage == false){
											layer.open({content: '用户未开启主页!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
										}else if(otherid != localStorage.getItem('otherid')){
											localStorage.setItem('otherid', otherid);
											window.location.href = '../html/myhome.html';
										}
									}
								});
							})
							$('.tap-comment').on('click', function() {
								layer.open({
									content: '该视频未开启评论!',
									style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
									time: 2
								});
							})
							dianzan();
							break;
						default:layer.open({content: '网络出错，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});break;
					}
				},
				error: function() {
					layer.open({
						content: '请求失败',
						style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
						time: 2
					});
				}
			});
		},
		other: function() {
			var menu = null,
				main = null;
			var showMenu = false;
			mui('.mui-bar').on('tap', 'a', function() {
					var id = this.getAttribute('href');
					var href = this.href;
					mui.openWindow({
						id: id,
						url: this.href,
						styles: {
							top: 0,
							bottom: '50px',
							bounce: 'vertical'
						}
					})
				})
				//点击进入明星榜
				//			$('.gostar').click(function() {
				//				window.location.href = '../html/star.html';
				//			});
			$('.btn-search').click(function() {
				window.location.href = '../html/menu.html';
			});
		}
	}
	find.init();
})
var shareId; // 分享视频ID
var imgSrc; // 头像
var userName; // 用户名
var videoTitle; // 视频标题
var videoUrl; // 视频地址
var videoName; // 
var thumbUrl; // 视频缩略图地址
$(document).on("tap", function(e) {
	// 点击分享时获取视频ID
	if(e.target.className == "iconfont share") {
		//		mui('#pullre').pullRefresh().setStopped(true);//暂时禁止滚动
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
});

function share(reParent){
	imgSrc = reParent.siblings(".reHeader").find('img').attr('src');
	userName = reParent.siblings(".reHeader").find('.name').text();
	mobShare.config( {
	    debug: true, // 开启调试，将在浏览器的控制台输出调试信息	 
	    appkey: '178ebbfdd38af', // appkey	 
	    params: {
	        url: videoUrl, // 分享链接
	        title: videoName, // 分享标题
	        description: '', // 分享内容
	        pic: thumbUrl // 分享图片
	    }		 	 
	} );	
	
	if(isWeiXin()){
		$(".weixin").parent().css("display","block");
		$(".friend").parent().css("display","block");
	}
	
	
}

function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

/*
wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wxe9af30cc42a6f53f', // 必填，公众号的唯一标识
    timestamp: '', // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.ready(function(){
    
    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口 
    $(".weixin").on("tap",function(){
    	wx.onMenuShareAppMessage({
	        title: '分享标题', // 分享标题
	        desc: "分享描述", // 分享描述
	        link:"分享的url,以http或https开头",
	        imgUrl: "分享图标的url,以http或https开头", // 分享图标
	        type: 'link', // 分享类型,music、video或link，不填默认为link
	    });
    });
    
    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
    $(".friend").on("tap",function(){
    	wx.onMenuShareTimeline({
	        title: '分享标题', // 分享标题
	        link:"分享的url,以http或https开头",
	        imgUrl: "分享图标的url,以http或https开头" // 分享图标
	    });
    });
});
*/


//点赞
var clicktag = 0;
function dianzan() {
	$(".dianzan").on("click", function() {
		if(clicktag == 0){
			clicktag = 1;
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
					console.log(data);
					switch(data.result) {
						case "1":
							break;
						case "100":
							layer.open({
								content: '请求参数不正确',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "401":
							layer.open({
								content: '视频不存在',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "407":
							layer.open({
								content: '视频已经被关注',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
	
					}
				},
				error: function() {
					layer.open({
						content: '请求失败',
						style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
						time: 2
					});
				}
			});
			setTimeout(function () { clicktag = 0 }, 1000);
		}
		
	});
}
// 分享到希望之星弹出层
$(".star").on("tap", function() {
	mui('#starPopover').popover('show');
	$("#starPopover").addClass("mui-active").attr("style", "top: 0.5rem;left: 0.12rem;");
	var html = '';
	html += '<dt><img src="../images/' + imgSrc + '" alt="" /></dt>\
			 <dd><p class="star-user">@' + userName + '</p><p class="star-info">' + videoName + '</p></dd>';
	$(".star-content").html("").append(html);
	if($(".star-info").css("height") <= "21px") {
		$("dd p").css("margin-top", "0px");
	}
});
// 关闭分享弹出层
$("#channel1").click(function() {
	mui('#middlePopover').popover('hide');
//	mui('#pullre').pullRefresh().setStopped(false);//开启禁止滚动
});
// 举报
$("#reportPopover").on("tap",function(e){
	var reason;
	if(e.target.innerHTML === "广告"){
		reason = 1;
		report();
	}else if(e.target.innerHTML === "色情"){
		reason = 2;
		report();
	}else if(e.target.innerHTML === "政治敏感"){
		reason = 3;
		report();
	}else if(e.target.innerHTML === "人身攻击"){
		reason = 4;
		report();
	}else if(e.target.innerHTML === "其他"){
		reason = 5;
		report();
	}
	function report(){
		$.ajax({
			type:"post",
			url:"/star/report/add",
			data: {'userId': userId,'token': token,'reportType':1,'reason':reason,'videoId': shareId},
			dataType:"json",
			success: function(data){
				if(data.result == "1"){
					layer.open({content: '操作成功!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					window.setTimeout(function(){
						mui('#reportPopover').popover('hide');
					},2000);
				}				
			}
		});
	}
});
// 关闭举报弹出层
$("#channel2").click(function() {
	mui('#reportPopover').popover('hide');
//	mui('#pullre').pullRefresh().setStopped(false);//开启禁止滚动
});

// 填写评论信息
$(".star-text").focus(function(){
	if($(this).val() == "说点什么吧(20字以内)"){
		$(this).val("").css("color","#fff");
	}			
	$(this).keyup(function(){
		$(this).siblings("#star-btn").removeAttr("disabled").css("background-color","#ff004d");
		if($(this).val() == ""){
			$(this).siblings("#star-btn").attr("disabled","disabled").css("background-color","#343240");
		}
	});
});
$(".star-text").blur(function(){
	if($(this).val() == ""){
		$(this).val("说点什么吧(20字以内)").css("color","#858585").siblings("#star-btn").css({"color":"#fff","background-color":"#343240"}).attr("disabled","disabled");
	}
})	
// 关闭希望之星分享
$("#star-close").on("tap",function(){
	$(".star-text").val("说点什么吧(20字以内)").css("color","#858585").siblings("#star-btn").css({"color":"#fff","background-color":"#343240"}).attr("disabled","disabled");		
	mui('#starPopover').popover('hide');
		
});
// 分享转发到我的希望之星
$("#star-btn").on("tap",function(){
	var comment = $(this).siblings(".star-text").val();
	if(comment != "说点什么吧(20字以内)" && comment != ""){
		$.ajax({
			type:"post",
			url:"/star/share/add",
			data: {'userId': userId,'token': token,'videoId': shareId,'comment':comment},
			dataType:"json",
			success: function(data){
				if(data.result == "1"){
					layer.open({content: '分享成功!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});	
				}else if(data.result == "803"){
					layer.open({content: '分享评论超过20个字!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}else if(data.result == "401"){
					layer.open({content: '视频不存在!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}else if(data.result == "406"){
					layer.open({content: '不能分享自己的视频!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}else if(data.result == "408"){
					layer.open({content: '视频已分享!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
				window.setTimeout(function(){
					mui('#starPopover').popover('hide');
				},2000);
			}
		});
	}
});