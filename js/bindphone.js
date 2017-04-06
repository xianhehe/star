$(function() {
	var clear;
	clearInterval(clear);

	$('.bind-phone').focus(function() {
		$('.phone').show().next().hide();
		$('.icon-close').hide();
	});
	$('.bind-password').focus(function() {
		$('.pass').show().prev().hide();
		$('.icon-close').hide();
	});
	$('.code').focus(function() {
		$('.icon-close').show();
		$('.phone').hide();
		$('.pass').hide();
	});

	$('.phone').click(function() {
		$('.bind-phone').val("");
		$('.btn-confirm').css("background-color", "#605f6a");
	});
	$('.pass').click(function() {
		$('.bind-password').val("");
		$('.btn-confirm').css("background-color", "#605f6a");
	});

	//快速清空input
	$('.iconfont').click(function() {
		$(this).hide().prev().val('');
		$('.btn-confirm').css("background-color", "#605f6a");
	})

	//确认按钮变色
	$('form input').on('input  propertychange', function() {
		if($('.bind-phone').val() !== "" && $('.bind-phone').val() !== $('.bind-phone').attr('placeholder') && $('.bind-password').val() !== "" && $('.bind-password').val() !== $('.bind-password').attr('placeholder') && $('.code').val() !== "" && $('.code').val() !== $('.code').attr('placeholder')) {
			$('.btn-confirm').css("background-color", "#ff296a");
		} else {
			$('.btn-confirm').css("background-color", "#605f6a");
		}
	})

	//发送验证码
	$(".btn-code").click(function() {
		if($(".bind-phone").val() == "") {
			layer.open({
				content: '手机号不得为空',
				style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
				time: 2
			});
		} else {
			clearInterval(clear);
			if(checkPhone()) {
				timer(intDiff);
			};
		}
	});

	function checkPhone() {
		var phone = $('.bind-phone').val();
		if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
			layer.open({
				content: '手机号码有误，请重填',
				style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
				time: 2
			});
			return false;
		} else {
			$.ajax({
				type: "get",
				async: true,
				url: '/star/user/getVerifyCode?operation=3&phone=' + $(".bind-phone").val(),
				dataType: "json",
				success: function(data) {
					switch(data.result) {
						case "1":
							alert(data.data.code);
							timer(intDiff);
							break;
						case "200":
							layer.open({
								content: '用户不存在',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "205":
							layer.open({
								content: '手机号已注册',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "206":
							layer.open({
								content: '手机验证码操作类型错误',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						default:
							layer.open({
								content: '网络出错，请重试',
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
		}
	}

	//绑定手机确认按钮
	$(".btn-confirm").click(function() {
		var phone = $('.bind-phone').val();
		if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
			layer.open({
				content: '手机号码有误，请重填',
				style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
				time: 2
			});
			return false;
		} else if($(".bind-phone").val() == "" || $(".bind-password").val() == "" || $(".code").val() == "") {
			layer.open({
				content: '所填信息不得为空',
				style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
				time: 2
			});
		} else {
			var userId = localStorage.getItem('userId'),
				token = localStorage.getItem('token'),
				phone = $(".bind-phone").val(),
				passwd = $(".bind-password").val(),
				code = $(".code").val();
			$.ajax({
				type: "post",
				async: true,
				url: '/star/user/bindPhone',
				dataType: "json",
				data: {
					'userId': userId,
					'token': token,
					'phone': phone,
					'passwd': passwd,
					'code': code
				},
				success: function(data) {
					switch(data.result) {
						case "1":
							layer.open({
								content: '成功绑定手机号',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							window.location.reload();
							break;
						case "200":
							layer.open({
								content: '用户不存在',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "202":
							layer.open({
								content: '手机验证码错误',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "203":
							layer.open({
								content: '用户密码强度不够',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							clearInterval(clear);
							$('.btn-code').html('发送验证码').removeAttr('disabled');
							$('.code').val("");
							$('.btn-confirm').css("background-color", "#605f6a");
							break;
						case "204":
							layer.open({
								content: '手机验证码过期',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						case "209":
							layer.open({
								content: '手机号码已绑定',
								style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',
								time: 2
							});
							break;
						default:
							layer.open({
								content: '网络出错，请重试',
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
		}
	});

	//倒计时
	var intDiff = parseInt(60);

	function timer(intDiff) {
		var second = 0; //倒计时总秒数量
		clear = window.setInterval(function() {
			//时间默认值	
			$(".btn-code").attr('disabled', 'disabled');
			if(intDiff > 0) {
				intDiff--;
				second = intDiff;
				$('.btn-code').html('<s></s>' + second + 's');
			}
			if(second <= 0) {
				$('.btn-code').html('获取验证码');
				//防止暴力事件操作
				$(".btn-code").removeAttr('disabled');
				clearInterval(clear);
			}
		},1000);
	}
});