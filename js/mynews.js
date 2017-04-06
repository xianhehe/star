$(document).ready(function() {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
});
mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: false, //默认为false，不监听
		release: false //默认为false，不监听
	},
	options: {
		scrollY: true, //是否竖向滚动
		scrollX: false, //是否横向滚动
		startX: 0, //初始化时滚动至x
		startY: 0, //初始化时滚动至y
		indicators: false, //是否显示滚动条
		deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
		bounce: true //是否启用回弹
	},
	pullRefresh: {

		container: '#pullrefresh', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			height: 50, //可选.默认50.触发上拉加载拖动距离
			auto: false, //可选,默认false.自动上拉加载一次
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: pullupRefresh
		},
		down: {
			callback: pulldownRefresh
		}
	}
});

function pulldownRefresh() {
	setTimeout(function() {

		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed

	}, 1500);

}
var count = 0;

function pullupRefresh() {
	mui('.mui-scroll-wrapper').scroll({
		indicators: false
	});
	$('.mui-scrollbar-indicator').css('display', 'none');
	setTimeout(function() {
		count++;
		ajax(count)
	}, 150);
}

if(mui.os.plus) {
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});

	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();

	}, 1000);

} else {
	mui.ready(function() {

		mui('#pullrefresh').pullRefresh().pullupLoading();

	});
}

var userId = localStorage.getItem('userId');
var token = localStorage.getItem('token');
var url = "/star/message/unReadList";
var ajax = function(count) {

	mui.ajax(url, {
		data: {
			'userId': userId,
			'token': token,
			'pageNum': count,
			'pageSize': 15
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型

		success: function(data) {
			var mm = '';
			if(data.result == 1) {
				if(count > data.data.pages) {
					count = data.data.pages;
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

				} else {
					var size = data.data.list;
					$.each(size, function(obj, news) {
						console.log(news);
						if(news.readStatus == 0) {
							mm += '<ul class="list-li" dataid="' + news.id + '" action-type="go.mydetails"><li class="mui-table-view-cell con"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red delp">删除</a></div><div class="mui-slider-handle"><div class="sysTime"><p class="newstitle">' + news.title + '</p><span>' + news.lastUpdatedTime.substring(0, 10) + '</span></div><div class="syeCont"><p class="newsbody">' + news.body + '</p><div><span id="redblo" style="display:block"></span></div></div></div></li></ul>';

						} else {
							mm += '<ul class="list-li" dataid="' + news.id + '" action-type="go.mydetails"><li class="mui-table-view-cell con"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red delp">删除</a></div><div class="mui-slider-handle"><div class="sysTime"><p class="newstitle">' + news.title + '</p><span>' + news.lastUpdatedTime.substring(0, 10) + '</span></div><div class="syeCont"><p class="newsbody">' + news.body + '</p><div><span id="redblo" style="display:none"></span></div></div></div></li></ul>';
							//									mm+='<ul class="list-li" dataid="'+news.id+'" action-type="go.mydetails"><li class="con"><div class="sysTime"><p class="newstitle">' + news.title + '</p><span>'+news.lastUpdatedTime.substring(0,10)+'</span></div><div class="syeCont"><p class="newsbody">'+news.body+'</p><div><span id="redblo" style="display:none"></span></div></div></li><li class="btn"><div class="del"><p class="delp">删除</p></div></li></ul>';
						}
					});

					$('.mui-table-view').append(mm);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				}

			} else {
				console.log('消息没获取成功');
			}
		},
		error: function(xhr, type, errorThrown) {
			alert('fail');
			//			popover('请求失败');
		}
	})

}
$('.edit').on('tap', function() {
	window.location.href = "../html/newslist.html";
})
mui('body').on('tap', '.delp', function() {
	$(this).parent().parent().parent().remove();
	var messageIds = $(this).parent().parent().parent().getAttribute("dataid");
	$.ajax({
		url: '/star/message/delete',
		type: "post",
		dataType: "json",
		data: {
			'userId': userId,
			'token': token,
			'messageIds': messageIds,
		},
		success: function(data) {
			if(data.result == 1) {
				console.log('删除消息成功');
			} else {
				console.log('删除消息失败');
			}
		},
		error: function() {
			alert('删除失败');
		}
	});
});
mui('body').on('tap', '.list-li', function() {
		var dataid = $(this).attr("dataid");
		var newsTitle = $(this).children().children('.mui-slider-handle').children('.sysTime').children('.newstitle').html();
		var newsBody = $(this).children().children('.mui-slider-handle').children('.syeCont').children('.newsbody').html();
		localStorage.setItem('dataid', dataid);
		localStorage.setItem('newsTitle', newsTitle);
		localStorage.setItem('newsBody', newsBody);
		window.location.href = '../html/mydetails.html';
	})
	////     //左滑
	//      var initX;
	//		var moveX;
	//		var X = 0;
	//		var objX = 0;
	//		
	//		mui.plusReady(function(){ 
	//   //alert("当前页面URL："+plus.webview.currentWebview().getURL());
	//   document.addEventListener("swipeleft",function(){
	//      
	//      alert(4545);
	//  });
	//
	//});
	//		
	//		function parentEvent(p, i,d){
	//			console.log(p,i,d)
	//		}
	//			event.preventDefault();
	//			var objnews=event.target;
	//			var obj = event.target.parentNode.parentNode.parentNode;			
	//           
	//			if(obj.className == "list-li"){
	//				initX = event.targetTouches[0].pageX;
	//				console.log(initX);
	//				objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
	//			}
	//			if( objX == 0){
	//				window.addEventListener('touchmove',function(event) {
	//					event.preventDefault();
	//					var obj = event.target.parentNode.parentNode.parentNode;
	//					if (obj.className == "list-li") {
	//						moveX = event.targetTouches[0].pageX;
	//						X = moveX - initX;
	//						if (X > 0) {
	//							obj.style.WebkitTransform = "translateX(" + 0 + "px)";
	//						}
	//						else if (X < 0) {
	//							var l = Math.abs(X);
	//							obj.style.WebkitTransform = "translateX(" + -l + "px)";
	//							if(l>80){
	//								l=80;
	//								obj.style.WebkitTransform = "translateX(" + -l + "px)";
	//							}
	//						}
	//					}
	//				});
	//			}		
	//			else if(objX<0){
	//				window.addEventListener('touchmove',function(event) {
	//					event.preventDefault();
	//					var obj = event.target.parentNode.parentNode.parentNode;
	//					if (obj.className == "list-li") {
	//						moveX = event.targetTouches[0].pageX;
	//						X = moveX - initX;
	//						if (X > 0) {
	//							var r = -80 + Math.abs(X);
	//							obj.style.WebkitTransform = "translateX(" + r + "px)";
	//							if(r>0){
	//								r=0;
	//								obj.style.WebkitTransform = "translateX(" + r + "px)";
	//							}
	//						}
	//						else {     //向左滑动
	//							obj.style.WebkitTransform = "translateX(" + -80 + "px)";
	//						}
	//					}
	//				});
	//			}
	//
	//		})
	//		window.addEventListener('touchend',function(event){
	////			event.preventDefault();
	//			var obj = event.target.parentNode.parentNode.parentNode;
	//			if(obj.className == "list-li"){
	//				objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
	//				if(objX>-40){
	//					obj.style.WebkitTransform = "translateX(" + 0 + "px)";
	//				}else{
	//					obj.style.WebkitTransform = "translateX(" + -80 + "px)";
	//				}
	//			}		
	////			var delbtn=event.target;
	////			var deltext=delbtn.text();
	////			if (deltext=="删除") {
	////				
	////			}
	//		})
	//		window.addEventListener('click',function(event){
	//			event.preventDefault();
	//			var delbtn=event.target;						
	//	        var godetail=event.target.parentNode.parentNode.parentNode;
	//			if (delbtn.className=='delp') {
	//				var delbig=event.target.parentNode.parentNode.parentNode;
	//				var messageIds=delbig.getAttribute("dataid");
	//				delbig.style.display="none";
	//				$.ajax({
	//					url: '/star/message/delete',
	//					type: "post",
	//					dataType: "json",
	//					data: {
	//						'userId': userId,
	//						'token': token,
	//						'messageIds': messageIds,
	//					},
	//					success: function(data) {
	//						if(data.result == 1) {
	//							console.log('删除消息成功');
	//						}
	//						else{
	//							console.log('删除消息失败');
	//						}
	//					},
	//					error: function() {
	//						alert('删除失败');
	//					}
	//				});
	//				
	//			}
	//			if(godetail.className=="list-li"){
	//				var dataid=godetail.getAttribute("dataid");				
	//				var newsTitle=godetail.firstChild.firstChild.firstChild.innerHTML;
	//				var newsBody=godetail.firstChild.lastChild.firstChild.innerHTML;
	//				localStorage.setItem('dataid',dataid);	
	//				localStorage.setItem('newsTitle',newsTitle);
	//				localStorage.setItem('newsBody',newsBody);
	//				window.location.href='../html/mydetails.html';			   
	//			}
	//		 })
	//		
	//	

//;$(function(){
//	$('.gohistory').on('click',function(){
//		window.history.go(-1);
//	});
//	var userId=localStorage.getItem('userId');
//	var token=localStorage.getItem('token');
//	var pageNum=1;
//  var newrefresh={
//  	init:function(){
//  		$.ajax({
//				type: "post",
//				async: true,
//				url: '/star/message/unReadList',
//				dataType: "json",
//				data:{'userId':userId,'token':token,'pageSize':15,'pageNum':pageNum},
//				success: function(data) {
//					var mm='';
//					if(data.result == 1) {
//						if (pageNum>data.data.pages) {
//							$('#moreup').text('没有更多数据！');
//							myScroll.refresh();
//						} else{
//							var size=data.data.list;
//							$.each(size, function(obj, news) {
//				              	
//				              	if (news.readStatus==0) {
//								   mm+='<ul class="list-li" dataid="'+news.id+'" action-type="go.mydetails"><li class="con"><div class="sysTime"><p class="newstitle">' + news.title + '</p><span>'+news.lastUpdatedTime.substring(0,10)+'</span></div><div class="syeCont"><p class="newsbody">'+news.body+'</p><div><span id="redblo" style="display:block"></span></div></div></li><li class="btn"><div class="del"><p class="delp">删除</p></div></li></ul>';
//								} else{
//									mm+='<ul class="list-li" dataid="'+news.id+'" action-type="go.mydetails"><li class="con"><div class="sysTime"><p class="newstitle">' + news.title + '</p><span>'+news.lastUpdatedTime.substring(0,10)+'</span></div><div class="syeCont"><p class="newsbody">'+news.body+'</p><div><span id="redblo" style="display:none"></span></div></div></li><li class="btn"><div class="del"><p class="delp">删除</p></div></li></ul>';
//								}
//							});
//
//							$('.lovenews').append(mm);
//							myScroll.refresh();	
//						}
//						
//					}
//					else{
//						console.log('消息没获取成功');
//					}
//				},
//				error: function() {
//					alert('fail');
//				}
//			});
//  	}
//  }
//	newrefresh.init();
//	var h = $(window).height()-44;
//  $('#index-scroll .lovenews').css('min-height',h);
//  	//这个是上拉加载和下拉刷新
////  	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//     var scrollSize = 30;
//	   var myScroll=new IScroll("#index-scroll",{
//		   		click:true,
//		   		tap:true
//		   });
//	   //因为这个是avalon，就是隐藏下拉刷新那块的
//  	 myScroll.scrollBy(0, -scrollSize);
//  	 var that = this; 
//  	 //这个是引入的图片，让图片箭头有个旋转的效果
//  	 var head = $('.head img'),
//		   topImgHasClass = head.hasClass('up');
//		   var foot = $('.foot img'),
//		   bottomImgHasClass = head.hasClass('down');
//	   //获取用户信息
//	   //滚动的时候
//  	 myScroll.on('scroll', function () {
//        var y = this.y,
//            maxY = this.maxScrollY - y;
//        if (y >= 0) {
//            !topImgHasClass && head.addClass('up');
//            return '';
//        }
//        if (maxY >= 0) {
//            !bottomImgHasClass && foot.addClass('down');
//            return '';
//        }
//    });
////    滚动完以后的各种效果
//     myScroll.on('scrollEnd', function () {
//     	//下拉刷新的效果
//     	  if (this.y >= -scrollSize && this.y < 0) {
//            myScroll.scrollTo(0, -scrollSize);
//            head.removeClass('up');
//        }else if (this.y >= 0) {
//        		head.attr('src', '../images/ajax-loader.gif');
//        		setTimeout(function(){
//        			pageNum=1;
//        			$('.lovenews').html("");
//        			newrefresh.init();  
//        			myScroll.scrollTo(0, -scrollSize);
//	          		head.removeClass('up');
//	          		head.attr('src', '../images/arrow.png');
//            },1000);
//        }
//        //上拉加载的效果
//        var maxY = this.maxScrollY - this.y;
//        var self = this;
//        if (maxY > -scrollSize && maxY < 0) {
//            myScroll.scrollTo(0, self.maxScrollY + scrollSize);
//            foot.removeClass('down');
//        } else if (maxY >= 0) {
//            foot.attr('src', '../images/ajax-loader.gif');
//            setTimeout(function(){ 
//            	pageNum++;
//            	newrefresh.init();             	         		
//        		foot.removeClass('down');
//        		foot.attr('src', '../images/arrow.png');
//            },1000);
//        }
//     }); 

//});
// 
//     
// 
//