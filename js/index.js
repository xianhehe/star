;
$(function() {
	
	mui('.messHeader').on('tap', '.goselect', function() {
		mui.openWindow({
			id: 'select',
			url: 'html/select.html',
			styles: {
				top: 0,
				bottom: 0,
				bounce: 'vertical'
			}
		})
	})
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
	
	var homehotSwiper = new Swiper('#home-hot-swiper', {
		loop: false,
		nested: true,
		onTransitionStart: function() {
			$('#home-hot-nav li').eq(homehotSwiper.activeIndex)
				.addClass('active').siblings().removeClass('active');
		}
	});
	var homeSwiper = new Swiper('#home-swiper', {
		loop: false,
		onTransitionStart: function() {
			$('.messHeader ul li').eq(homeSwiper.activeIndex)
				.addClass('active').siblings().removeClass('active');
		}
	});
	var myScroll = new IScroll("#index-scroll1", {
		click: true,
		tap: true
	});
	$('.twonormal').click(function() {
		var num = $(this).index();
		console.log(num);
		homeSwiper.slideTo(num);
		$('.twonormal').eq(num).addClass('active').siblings().removeClass('active');
	})
	$('.fournormal').click(function() {
		var num = $(this).index();
		console.log(num);
		homehotSwiper.slideTo(num);
		$('.fournormal').eq(num).addClass('active').siblings().removeClass('active');
	})
	//3D转换swiper
	var userId=localStorage.getItem('userId');
	var token=localStorage.getItem('token');
	var matchId=0,matchAgeId=0,matchAreaId=0;
	var pageNum=1;
	console.log(userId,token);
	if (userId==""&&token=="") {
		window.location.href="html/login2.html";
	}
	//广告信息的接口
	
	//大赛内容的接口
 	var newrefresh={
    	init:function(){
    		$.ajax({
				type: "post",
				async: true,
				url: '/star/video/match/list',
				dataType: "json",
				data:{'userId':userId,'token':token,'pageNum':20,'matchId':matchId,'matchAgeId':matchAgeId,'matchAreaId':matchAreaId},
				success: function(data) {
					var mm='';
					console.log(data);
					if(data.result == 1) {
						console.log(data.data.videoList);
						console.log("消息成功");
						var alldata=data.data.videoList;
						var datalength=alldata.list.size;
						console.log(alldata);console.log(alldata.size);
//						if (datalength%2==0) {
//							mm+='<ul><li action-type='tap.videoplay'><p><img src="images/img1.jpg"></p><div class='avator'><img src="images/img2.jpg"></div><p><span>ken</span><span class='yo-ico iconfont'>&#xe60f;1900</span></p><p>如此流利的英文</p></li><li></li><li><p><img src="images/img1.jpg"></p><div class='avator'><img src="images/img2.jpg"></div><p><span>ken</span><span class='yo-ico iconfont'>&#xe60f;1900</span></p><p>如此流利的英文</p></li></ul>';
//						}
//						else{
//							
//						}
			
					}
					else{
						console.log('消息没获取成功');
					}
				},
				error: function() {
					alert('fail');
				}
			});
    	}
    }
	newrefresh.init();
	
});