$(function() {
	var addtage = {
		init: function() {
			var _this = this;
			_this.confirm();
			_this.other();
		},
		confirm: function() {
			$(".btn-confirm").click(function() {
				var content = $(".label-content").val(),
					userId = localStorage.getItem('userId'),
					token = localStorage.getItem('token');
				if(content == "") {
					layer.open({content: '请输入标签内容',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					return false;
				} else {
					$.ajax({
						type: "post",
						url: "/star/tag/add",
						dataType: "json",
						data: {'userId': userId,'token': token,'content': content},
						success: function(data) {
							console.log(data);
							switch(data.result) {
								case "1":
									layer.open({content: '添加成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 1});
									setTimeout(function(){window.history.go(-1)},1000);
									break;
								case "200":
									layer.open({content: '用户不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
									break;
								default:
									layer.open({content: '网络出错，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2
								});
									break;
							}
						},
						error: function() {
							layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
						}
					});
				}
			})
		},
		other: function() {
			//监听输入框输入文字
			$('.rowsText textarea').on('input propertychange', function() {
				if($(this).val() != "") {
					var counter = $(this).val().length;
					$('.label-num span').text(counter);
				} else {
					$('.label-num span').text(0);
				}
			});
			//清空input值
			$('.icon-close').on('click', function() {
					$(this).hide().prev().val('');
				})
				//确认按钮变色
			$('.rowsText textarea').on('input propertychange', function() {
				if($(this).val() !== "" && $(this).val() !== $(this).attr('placeholder')) {
					$(this).next().show();
					$('.btn-confirm').css("background-color", "#ff296a");

				} else {
					$(this).next().hide();
					$('.btn-confirm').css("background-color", "#605f6a");
				}
			})
		}
	}
	addtage.init();
})