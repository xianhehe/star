$(document).ready(function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
});

var userId = localStorage.getItem('userId'),
	token = localStorage.getItem('token'),
	otherid = localStorage.getItem('otherid');

$(function() {
	mui.init();
	(function($) {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		$('.mui-scroll-wrapper').scroll({
			bounce: true,
			indicators: false, //是否显示滚动条
			deceleration: deceleration
		});
		$.ready(function() {
			//循环初始化所有上拉加载。
			$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
				$(pullRefreshEl).pullToRefresh({
					up: {
						callback: function() {	
							this.endPullUpToRefresh(false);
							if(xiu.hotNum[xiu.items.index()] < xiu.pages[xiu.items.index()]){
								xiu.hotNum[xiu.items.index()]++;				
								if(xiu.items.index() == 0){
									xiu.load("/star/video/visit/list",{'userId': userId,'token': token,'visitUserId':otherid,'pageNum':xiu.hotNum[xiu.items.index()],'pageSize':10},xiu.items);
								}else if(xiu.items.index() == 1){
									xiu.load("/star/video/share/list",{'userId': userId,'token': token,'visitorUserId':otherid,'pageNum':xiu.hotNum[xiu.items.index()],'pageSize':10},xiu.items);
								}else if(xiu.items.index() == 2){
									xiu.load("/star/user/followed/list",{'userId': userId,'token': token,'visitUserId':otherid,'pageNum':xiu.hotNum[xiu.items.index()],'pageSize':10},xiu.items);
								}else{
									xiu.load("/star/user/fans/list",{'userId': userId,'token': token,'visitUserId':otherid,'pageNum':xiu.hotNum[xiu.items.index()],'pageSize':10},xiu.items);
								}
							}else{
								this.endPullUpToRefresh(true);
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
			_this.load("/star/video/visit/list",{'userId': userId,'token': token,'visitUserId':otherid,'pageNum':1},_this.items);
			_this.tabload();
		},		
		getVideo: function(data,flag){
			console.log(data);
			var html = '';
			$.each(data.data.list, function(index, ele) {
				var time = ele.createdTime.slice(0,10);
				html += '<div class="reContent">\
							<div class="reHeader">\
								<ul>\
									<li data-id="'+ ele.userId +'" class="myhome"><img src="'+ ele.uAvatar +'" /></li>\
									<li>';
				if(flag == 1){
					html += '<span class="name">'+ ele.uName +'</span><span class="yo-ico">'+ time +'</span>';
				}else if(flag == 2){
					html += '<span class="name">'+ ele.fromUserName +'</span><span class="yo-ico">'+ time +'</span>';
				}
				html += '</li>\
								</ul>\
							</div>\
							<div class="reImg">\
								<video src="'+ ele.thumbUrl +'" width="100%" height="100%" autobuffer autoplay="autoplay" style="position: relative;">当前浏览器不支持 video直接播放，点击这里下载视频</video>\
								<p class="reMess">'+ ele.name +'</p>\
							</div>\
							<ul class="reShare">\
								<li data-thumbUrl="'+ ele.thumbUrl +'" data-videoUrl="'+ ele.videoUrl +'" data-videoName="'+ ele.name +'" data-id="'+ ele.id +'"><a class="share" href="#middlePopover"><i class="iconfont share">&#xe60a;</i>&nbsp;&nbsp;分享</a></li>\
								<li class="gocomment"><i class="iconfont">&#xe610;</i>&nbsp;&nbsp;评论</li>';
				if(ele.isFavour == "1"){
				    html +=	'<li><i class="iconfont rehear dianzan" data-id="'+ ele.id +'">&#xe60b;</i>&nbsp;&nbsp;<span>'+ ele.hot +'</span></li>';
				}else{
					html += '<li><i class="iconfont dianzan" data-id="'+ ele.id +'">&#xe60b;</i>&nbsp;&nbsp;<span>'+ ele.hot +'</span></li>';
				}
				html += '</ul></div>';
			});
			return html;
		},
		getPerson: function(data){
			console.log(data);
			var html = '';
			$.each(data.data.list, function(index, ele) {
				html += '<li data-id="'+ ele.id +'" class="myhome"><img src="' + ele.avatar + '" /><span class="reName">' + ele.name + '</span></li>';
			});
			return html;
		},
		load: function(postUrl,postData,items){
			//var pageNum = pageNum==undefined?1:pageNum;
			var _this = this;
			console.log(xiu.hotNum);
			$.ajax({
				type:"post",
				url:postUrl,
				data: postData,
				dataType:"json",
				success: function(data){
					_this.pages[items.index()] = data.data.pages;
					console.log(_this.pages);
					switch(data.result){
						case "1":				
							if(items.index() == 0){
								items.find('.recommend').append(_this.getVideo(data,1));
							}else if(items.index() == 1){
								items.find('.recommend').append(_this.getVideo(data,2));
							}else if(items.index() == 2){
								items.find('.recommend').append(_this.getPerson(data));
							}else{
								items.find('.recommend').append(_this.getPerson(data));
							}		
							break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
				}
			
			});
		},
		tabload:function(){
			var _this = this;
			document.getElementById('home-swiper2').addEventListener('slide', function(e) {
				switch(e.detail.slideNumber){
					case 0:
						_this.items = $('#item1mobile');
						break;
					case 1:
						_this.items = $('#item2mobile');
						if(_this.items.find(".recommend").html() == ""){
							xiu.load("/star/video/share/list",{'userId': userId,'token': token,'visitorUserId':otherid,'pageNum':1},_this.items);
						}
						break;
					case 2:
						_this.items = $('#item3mobile');
						if(_this.items.find(".recommend").html() == ""){
							xiu.load("/star/user/followed/list",{'userId': userId,'token': token,'visitUserId':otherid,'pageNum':1},_this.items);
						}
						break;
					case 3:
						_this.items = $('#item4mobile');
						if(_this.items.find(".recommend").html() == ""){
							xiu.load("/star/user/fans/list",{'userId': userId,'token': token,'visitUserId':otherid,'pageNum':1},_this.items);
						}
						break;
				}
			});
		},
		items: $('#item1mobile'),
		hotNum: [1,1,1,1],
		pages:[]
	}
	xiu.init();
	
	
	var myhome = {
		init: function(){
			var _this = this;
			_this.getinfo();
		},
		//获取用户信息
		getinfo: function(){
			$.ajax({
			 	url:"/star/user/getVisitInfo",
			 	type:"post",
			 	data: {'userId':userId,'token':token,'visitUserId':otherid},
			 	dataType:"json",
			 	success:function(data){
			 		//console.log(data);
			 		switch(data.result){
			 			case "1":
				 			var user = data.data.user;
				 			var html = '';
				 			if(data.data.isFollowed == false){
								html += '<div class="headavator"><img src="' + user.avatar + '" /></div><p class="name">' + user.name + '</p><p class="enouce">' + user.enounce + '</p><button type="button" class="btn-follow add">+关注</button>';
				 			}else{
				 				html += '<div class="headavator"><img src="' + user.avatar + '" /></div><p class="name">' + user.name + '</p><p class="enouce">' + user.enounce + '</p><button type="button" class="btn-follow del">取消关注</button>';
				 			}				 			
							$('.avator').append(html);
							$('.avator button').on('click',function(){
								if($(this).hasClass('add')){
									myhome.addfollow();
								}else{
									myhome.cancelfollow();
								}
							})
			 				break;
			 			case "200": layer.open({content: '用户名不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
			 	},
			 	error:function(){
					layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
		 	})
		},
		//添加关注
		addfollow: function(){
			var num = $('#fansNum').text();
			$.ajax({
			 	url:"/star/follow/add",
			 	type:"post",
			 	data: {'userId':userId,'token':token,'followedUserId':otherid},
			 	dataType:"json",
			 	success:function(data){
			 		console.log(data);
			 		switch(data.result){
			 			case "1": layer.open({content: '添加关注成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 3});
			 				$('.avator button').removeClass('add').addClass('del').text('取消关注');
			 				$('#fansNum').text(++num);
			 				break;
			 			case "300": layer.open({content: '被关注的用户不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
			 			case "301": layer.open({content: '用户已被关注',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
			 	},
			 	error:function(){
					layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
		 	})
		},
		//取消关注
		cancelfollow: function(){
			var num = $('#fansNum').text();
			$.ajax({
			 	url:"/star/follow/delete",
			 	type:"post",
			 	data: {'userId':userId,'token':token,'followedUserId':otherid},
			 	dataType:"json",
			 	success:function(data){
			 		console.log(data);
			 		switch(data.result){
			 			case "1": layer.open({content: '取消关注成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 3});
			 				$('.avator button').removeClass('del').addClass('add').text('+关注');		 				
			 				$('#fansNum').text(--num);
			 				break;
			 			case "302": layer.open({content: '关注记录不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
			 	},
			 	error:function(){
					layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
		 	})
		}
	}
	myhome.init();		
	
	
	
})

	

getTotal("/star/video/visit/list",{'userId': userId,'token': token,'visitUserId':otherid},"#videoNum");
getTotal("/star/video/share/list",{'userId': userId,'token': token,'visitorUserId':otherid},"#forwardNum");
getTotal("/star/user/followed/list",{'userId': userId,'token': token,'visitUserId':otherid},"#attentionNum");
getTotal("/star/user/fans/list",{'userId': userId,'token': token,'visitUserId':otherid},"#fansNum");
function getTotal(postUrl,postData,postObj){
	$.ajax({
		type: "POST",
		url: postUrl,
		data: postData,
		dataType:"json",
		success: function(data){
			if(data.result == 1){
				var length = data.data.total;
				fspages = data.data.pages;
				$(postObj).html(length);	
			}			
		}
	});
}

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


var shareId; // 分享视频ID
var imgSrc; // 头像
var userName; // 用户名
var videoUrl; // 视频地址
var videoName; // 视频标题
var thumbUrl; // 视频缩略图地址
var clicktag = 0;
$(document).on("click",function(e){
	// 点击评论时提示未开启
	if(e.target.className == "gocomment" || $(e.target).parent().hasClass("gocomment")){
		layer.open({content: '该视频未开启评论!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
	}
	// 点击分享iconfont时获取视频信息
	if(e.target.className == "iconfont share"){
		shareId = $(e.target).parent().parent().attr("data-id");
		videoUrl = $(e.target).parent().parent().attr("data-videoUrl");
		videoName = $(e.target).parent().parent().attr("data-videoName");
		thumbUrl = $(e.target).parent().parent().attr("data-thumbUrl");
		
		var reParent = $(e.target).parent().parent().parent();
		share(reParent);
	}
	// 点击分享时获取视频信息
	if(e.target.className == "share"){
		shareId = $(e.target).parent().attr("data-id");
		videoUrl = $(e.target).parent().attr("data-videoUrl");
		videoName = $(e.target).parent().attr("data-videoName");
		thumbUrl = $(e.target).parent().attr("data-thumbUrl");
	
		var reParent = $(e.target).parent().parent();
		share(reParent);
	}
	// 点赞
	if(clicktag == 0 && $(e.target).hasClass("dianzan")){
		clicktag = 1;
		var videoId = $(e.target).attr("data-id");
		var hotNum = parseInt($(e.target).parent().text().slice(1));
		if($(e.target).hasClass("rehear")){
			hotNum = hotNum - 1;			
			$(e.target).removeClass("rehear").next().text(hotNum);
		}else{
			hotNum = hotNum + 1;
			$(e.target).addClass("rehear").next().text(hotNum);
		}
		$.ajax({
			type:"post",
			url:"/star/video/favour",
			data: {'userId':userId,'token':token,'videoId':videoId},
			success: function(data){
				console.log(data);
			}
		});
		setTimeout(function () { clicktag = 0 }, 1000); 
	}
	// 进入他人主页
	if($(e.target).parent().hasClass("myhome")){
		var otherid = $(e.target).parent().attr("data-id");
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
// 判断是否为微信浏览器
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


// 关闭分享弹出层
$("#channel1").click(function(){
	mui('#middlePopover').popover('hide');
	
});
// 关闭举报弹出层
$("#channel2").click(function(){
	mui('#reportPopover').popover('hide');
});

// 分享到希望之星弹出层
$(".star").on("tap",function(){
	mui('#starPopover').popover('show');
	$("#starPopover").addClass("mui-active").attr("style","top: 0.5rem;left: 0.12rem;");
	var html = '';
	html += '<dt><img src="../images/'+ imgSrc +'" alt="" /></dt>\
			 <dd><p class="star-user">@'+ userName +'</p><p class="star-info">'+ videoName +'</p></dd>';
	$(".star-content").html("").append(html);
	if($(".star-info").css("height") <= "21px"){
		$("dd p").css("margin-top","0px");
	}
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
					layer.open({content: '分享已存在!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
				window.setTimeout(function(){
					mui('#starPopover').popover('hide');
				},2000);
			}
		});
	}
});




