;
$(function() {
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 * 2 + "px";
})
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh,
			auto:true
		}
	}
});

// 刷新
function pulldownRefresh() {
	mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
}
// 加载
function pullupRefresh() {
	ajax();
};




var userId = localStorage.getItem('userId');
var token = localStorage.getItem('token');
var pageNum = 1;

var ajax = function() {
	$.ajax({
		type: "post",
		url: "/star/video/list",
		data: {
			'userId': userId,
			'token': token,
			'status': '1',
			'pageNum': pageNum
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			switch(data.result) {
				case "1":
					var length = data.data.list.length;
					// 没有数据时
					if(length == 0) {
						var html = '<div class="backImg"><span>没有上传呢~</span></div>';
						$('#upLoadTab').html(html);
						mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
					} else if(pageNum <= data.data.pages) {
					
							var html = "";
							var users = data.data.list;
							$(users).each(function(index, ele) {
								var user = ele;
								var time = user.auditTime.slice(0, 10).replace(/-/g, '/');
								html += '<li class="upload">\
											<img src="' + user.uAvatar + '">\
											<div class="mui-media-body">\
												<p class="upload-name">' + user.name + '</p>\
												<p class="upload-date">' + time + '</p>';
								// 若用户已点赞,添加active类
								if(user.isFavour == "1") {
									html += '<p class="upload-favor"><span class="mui-icon-extra mui-icon-extra-heart-filled active"></span><span>' + user.hot + '</span></p>';
								} else {
									html += '<p class="upload-favor"><span class="mui-icon-extra mui-icon-extra-heart-filled"></span><span>' + user.hot + '</span></p>';
								}
								html += '</div>\
								</li>';
							});
							$("#upLoadTab").append(html);
							pageNum++;
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); // 停止加载
					}else{
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); // 停止加载
					}
			}
		}
	});

}