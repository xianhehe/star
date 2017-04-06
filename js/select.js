$(function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
	var myselect = {	
		init: function(){
			// 初始化
			window.localStorage.setItem("matchAreaId",0);	
			window.localStorage.setItem("matchArea","全部");
			window.localStorage.setItem("matchId",0);	
			window.localStorage.setItem("match","全部");
			window.localStorage.setItem("matchAgeId",0);
			window.localStorage.setItem("matchAge","全部");
				 		
			this.getMatchArea();			
			$("#confirm").on("tap",function(){
				window.location.href = "../index.html";
			});			
		},
		getMatchArea: function(){
			$.ajax({
				url: "/star/video/match/matchAndArea",
				type: "post",
				dataType: "json",
				success: function(data){
					console.log(data);
					if(data.result == 1){
						var matchAreaList = '';
						$.each(data.data.matchAreaList, function(index,ele) {
							matchAreaList += '<span data-matchId="'+ ele.id +'">'+ ele.name +'</span>';
						});
						$("#item1mobile").children(".info").append(matchAreaList);
						
						$("#item1mobile span").click(function(){
							mui(".mui-slider").slider().gotoItem(1);
						});
					 	myselect.sliderChange(data);	
	
					 	// 存储赛区数据
					 	$("#item1mobile").on("tap","span",function(){
					 		var matchAreaId = $(this).attr("data-matchId");
					 		var matchArea = $(this).text();				 		
					 		window.localStorage.setItem("matchAreaId",matchAreaId);	
					 		window.localStorage.setItem("matchArea",matchArea);
					 		$(this).addClass("active").siblings().removeClass("active");
					 	});		
					}
							 				 				 	
				}
			})
		},
		sliderChange: function(data){
			var isMatchFirst = true;
			document.getElementById('slider').addEventListener('slide', function(e) {
				if(e.detail.slideNumber === 1){ //项目
					// 初始化组别数据
					$("#item2mobile .info span").on("tap",function(){
						window.localStorage.setItem("matchAgeId",0);	
			 			window.localStorage.setItem("matchAge","全部");
					});				
				}
				if(e.detail.slideNumber === 1 && isMatchFirst == true) { //项目加载数据					
					myselect.getMatch(data);
					isMatchFirst = false;															
					// 加载对应组别
					$("#item2mobile").on("tap","span",function(){
						switch($(this).attr("data-matchId")){
							case "1": // 点击主体赛
								myselect.getGroup(data,0);					
								break;
							case "2": // 点击歌曲大赛
								myselect.getGroup(data,1);
								break;
							case "3": // 点击戏剧大赛
								myselect.getGroup(data,2);
								break;
							default: // 点击全部
								$("#item3mobile").find(".info").html('<span class="active" data-matchId="0">全部</span>');
						}
						// 存储项目数据
				 		var matchId = $(this).attr("data-matchId");
				 		var match = $(this).text();
				 		window.localStorage.setItem("matchId",matchId);
				 		window.localStorage.setItem("match",match);
				 		
						$(this).addClass("active").siblings().removeClass("active");
						mui(".mui-slider").slider().gotoItem(2);
					});	
				}else if(e.detail.slideNumber === 2) { // 组别																	
					$("#item3mobile").on("tap","span",function(){			
						// 存储组别数据
						var matchAgeId = $(this).attr("data-matchId");
						var matchAge = $(this).text();
				 		window.localStorage.setItem("matchAgeId",matchAgeId);
				 		window.localStorage.setItem("matchAge",matchAge);	
				 		
				 		$(this).addClass("active").siblings().removeClass("active");
					});
				}
			});
		},
		// 项目
		getMatch: function(data){
			var matchList = '';
			$.each(data.data.matchList, function(index,ele) {
				matchList += '<span data-matchId="'+ ele.id +'">'+ ele.name +'</span>'
			});
			$("#item2mobile").find(".info").append(matchList);	
		},
		// 组别
		getGroup: function(data,groupindex){
			var group = data.data.matchList[groupindex].list;		
			var groupList = '<span class="active" data-matchId="0">全部</span>';
			$.each(group, function(index,ele) {
				groupList += '<span data-matchId="'+ ele.id +'">'+ ele.name +'</span>'
			});
			$("#item3mobile").find(".info").html(groupList);
		}	
	};
	myselect.init();
});
