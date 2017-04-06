$(document).ready(function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
});

$(function() {
	var userId = localStorage.getItem('userId'),
		token = localStorage.getItem('token');
	var videoId = localStorage.getItem('videoId');
	var videoUserName, // 视频用户名
		videoUserId, // 视频用户ID
	    videoName, // 视频名
	    imgSrc, // 头像
		videoUrl, // 视频地址
		thumbUrl; // 视频缩略图地址
	var clicktag = 0;

	var videodetails = {
		init: function() {
			this.getinfo();
		},
		//获取视频信息
		getinfo: function() {
			$.ajax({
				url: "/star/video/getInfo",
				type: "post",
				data: {
					'userId': userId,
					'token': token,
					'videoId': videoId
				},
				dataType: "json",
				success: function(data) {
					console.log(data);
					
					switch(data.result) {
						case "1":
							var user = data.data.user;
							var videoinfo = '';
							var userinfo = '';

							var userList = '';
							var pushList = '';
							
							videoUserName = data.data.video.uName;
							videoUserId = data.data.video.userId;
							videoName = data.data.video.name;
							imgSrc = data.data.video.uAvatar;
							videoUrl = data.data.video.videoUrl;
							thumbUrl = data.data.video.thumbUrl;
							
							//视频
							videoinfo += '<video src="'+ data.data.video.videoUrl +'" width="100%" height="100%" autoplay="autoplay" style="position: relative;" controls="controls" loop="loop">\
											当前浏览器不支持 video直接播放，点击这里下载视频\
										  </video>';
							$(".reImg").append(videoinfo);
							
							//标题
							$(".videoTitle").html(videoName);
							
							//用户信息
							if(data.data.isFollowed == false) {
								userinfo += '<li><div class="headavator"><img data-id="'+ user.id +'" data-open="'+ user.isOpenedHomepage +'" class="myhome" src="' + user.avatar + '" /></div></li><li><div class="nes"><p>' + user.name + '</p><p>' + user.enounce + '</p></div></li><li class="avator"><button type="button" class="btn-follow add" id="followBtn">+关注</button></li>';
							} else {
								userinfo += '<li><div class="headavator"><img data-id="'+ user.id +'" data-open="'+ user.isOpenedHomepage +'" class="myhome" src="' + user.avatar + '" /></div></li><li><div class="nes"><p>' + user.name + '</p><p>' + user.enounce + '</p></div></li><li class="avator"><button type="button" class="btn-follow del" id="followBtn">取消</button></li>';
							}
							$('.focus ul').append(userinfo);
							
							//点赞信息				
							var fav = '';
							if(data.data.isFavour == 0) {
								fav += '<li><span class="iconfont dianzan" data-id="'+ data.data.video.id +'">&#xe60b;</span>&nbsp;&nbsp;<span>' + data.data.video.hot + '</span></li>';
							} else {
								fav += '<li><span class="iconfont rehear dianzan" data-id="'+ data.data.video.id +'">&#xe60b;</span>&nbsp;&nbsp;<span>' + data.data.video.hot + '</span></li>';
							}
							$('.reShare').append(fav);

							//热门视频
							$.each(data.data.userVideoList, function(obj, vid) {
								userList += '<li data-id="' + vid.id + '" data-videoUrl="'+ vid.videoUrl +'"><div class="hotv"><img src="' + vid.thumbUrl + '" /></div><p>' + vid.name + '</p><p>';
								if(vid.isFavour == 0){
									userList += '<span class="iconfont" data-id="'+ vid.id +'">&#xe60b;</span>';
								}else{
									userList += '<span class="iconfont rehear" data-id="'+ vid.id +'">&#xe60b;</span>';
								}
								userList += '&nbsp;<span>' + vid.hot + '</span></p></li>';
							});
							$('.hot ul').append(userList);

							//推荐
							$.each(data.data.pushVideoList, function(obj, vid) {
								pushList += '<div class="hotInner"><ul data-id="' + vid.id + '"><li><img src="' + vid.thumbUrl + '" /></li><li><p class="reName"><span>' + vid.name + '</span></p><p class="reTime">';
								if(vid.isFavour == 0){
									pushList += '<span class="iconfont" data-id="'+ vid.id +'">&#xe60b;</span>';
								}else{
									pushList += '<span class="iconfont rehear" data-id="'+ vid.id +'">&#xe60b;</span>';
								}
								pushList += '&nbsp;<span>' + vid.hot + '</span></p></li><li><span class="yo-ico">' + vid.auditTime.substring(0, 10) + '</span></li></ul></div>';
							});
							$('.hot1').append(pushList);


							//切换他的热门视频
							$('.hotv').click(function() {
								var id = $(this).parent().attr('data-id');
								var videoUrl = $(this).parent().attr('data-videoUrl');
								console.log(id,videoUrl);
								$('.reImg video').attr("src",videoUrl);
							});
							
							//切换推荐视频
							$('.hotInner').click(function() {
								videoId = $(this).children("ul").attr('data-id');
								console.log(videoId);
								localStorage.setItem('videoId',videoId);
								window.location.href = "../html/videodetails.html";
								
							});
							
							//关注
							$('.avator button').on('click', function() {
								if($(this).hasClass('add')) {
									videodetails.addfollow();
								} else {
									videodetails.cancelfollow();
								}
							});
							
							//分享
							$(".share").on("tap",function(){
								videodetails.shareVideo();
							});
							
							
							$(document).click(function(e){
								$(".messHeader").css("display","none");
								
								if(e.target.className == "gocomment" || $(e.target).parent().hasClass("gocomment")){					
									// 评论
									layer.open({content: '该视频未开启评论!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
								
								}else if($(e.target).hasClass("dianzan")){
									// 点赞
									videodetails.favour(e);
									
								}else if(e.target.className == "myhome"){ 
									// 点击头像进入个人主页
									var otherid = $(e.target).attr("data-id");
									var open = $(e.target).attr("data-open");
									if(open == "false"){
										layer.open({content: '用户未开启主页!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
									}else{
										localStorage.setItem('otherid', otherid);
										window.location.href = '../html/myhome.html';
									}
									
								}else if(e.target.nodeName.toLowerCase() == "video"){
									//点击显示"返回"和视频标题
									$(".messHeader").css("display","flex");
									
								}else if($(e.target).hasClass("return")){
									location.href=history.go(-1);
								}
							});														
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
						default:
							layer.open({
								content: '网络出错',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
					}
				},
				error: function() {
					layer.open({
						content: '请求失败，请重试',
						style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
						time: 2
					});
				}
			})
		},
		//添加关注
		addfollow: function() {
			$.ajax({
				url: "/star/follow/add",
				type: "post",
				data: {
					'userId': userId,
					'token': token,
					'followedUserId': videoUserId
				},
				dataType: "json",
				success: function(data) {
					console.log(data);
					switch(data.result) {
						case "1":
							layer.open({
								content: '添加关注成功',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								btn: ['确定']
							});
							$('.avator button').removeClass('add').addClass('del').text('取消');
							break;
						case "300":
							layer.open({
								content: '被关注的用户不存在',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "301":
							layer.open({
								content: '用户已被关注',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
							//			 			case "401": layer.open({content: '视频不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
						default:
							layer.open({
								content: '网络出错',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
					}
				},
				error: function() {
					layer.open({
						content: '请求失败，请重试',
						style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
						time: 2
					});
				}

			})
		},
		//取消关注
		cancelfollow: function() {
			$.ajax({
				url: "/star/follow/delete",
				type: "post",
				data: {
					'userId': userId,
					'token': token,
					'followedUserId': videoUserId
				},
				dataType: "json",
				success: function(data) {
					switch(data.result) {
						case "1":
							layer.open({
								content: '取消关注成功',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								btn: ['确定']
							});
							$('.avator button').removeClass('del').addClass('add').text('+关注');
							break;
						case "302":
							layer.open({
								content: '关注记录不存在',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});

							break;
						default:
							layer.open({
								content: '网络出错',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
					}
				},
				error: function() {
					layer.open({
						content: '请求失败，请重试',
						style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
						time: 2
					});
				}
			})
		},
		//分享
		shareVideo:function(){
			mobShare.config( {
			    debug: true, // 开启调试，将在浏览器的控制台输出调试信息	 
			    appkey: '178ebbfdd38af', // appkey	 
			    params: {
			        url: videoUrl, // 分享链接
			        pic: thumbUrl // 分享图片
			    }		 	 
			} );		
			if(isWeiXin()){
				$(".weixin").parent().css("display","block");
				$(".friend").parent().css("display","block");
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
			// 关闭分享弹出层
			$("#channel1").on("tap",function(){
				mui('#middlePopover').popover('hide');
			});
			// 关闭举报弹出层
			$("#channel2").on("tap",function(){
				mui('#reportPopover').popover('hide');
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
						data: {'userId': userId,'token': token,'reportType':1,'reason':reason,'videoId': videoId},
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
			// 分享到希望之星弹出层
			$(".star").on("tap",function(){
				mui('#starPopover').popover('show');
				$("#starPopover").addClass("mui-active").attr("style","top: 0.5rem;left: 0.12rem;");
				var html = '';
				html += '<dt><img src="../images/'+ imgSrc +'" alt="" /></dt>\
						 <dd><p class="star-user">@'+ videoUserName +'</p><p class="star-info">'+ videoName +'</p></dd>';
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
						data: {'userId': userId,'token': token,'videoId': videoId,'comment':comment},
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
		},
		//点赞
		favour:function(e){
			if(clicktag == 0 && $(e.target).hasClass("dianzan")){
				clicktag = 1;
				var favourId = $(e.target).attr("data-id");
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
					data: {'userId':userId,'token':token,'videoId':favourId},
					success: function(data){
						console.log(data);
					}
				});
				setTimeout(function () { clicktag = 0 }, 1000);
			}
			
			
		
		}
	}
	videodetails.init();
})


