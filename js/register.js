;$(function() {
	var clear;
	clearInterval(clear);
	
	//发送验证码
	function checkPhone() {
		var phone = $('.reusername').val();
		if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
			alert("手机号码有误，请重填");
			return false;
		} else {
			$.ajax({
				type: "get",
				async: true,
				url: '/star/user/getVerifyCode?operation=1&phone=' + $(".reusername").val(),
				dataType: "json",
				success: function(data) {
					console.log(0);
					console.log(data);
					if(data.result == 1) {
						alert(data.data.code);
						timer(intDiff);
					}
					if(data.result == 205) {
						alert('用户已存在');
						return false;
					}
				},
				error: function() {
					alert('fail');
				}
			});
		}
	}
	
	$('.reusername').focus(function() {
		$('.name').show().next().hide();
	});
	$('.repassword').focus(function() {
		$('.pass').show().prev().hide();
	});
	$('.code').focus(function() {
		$('.name').hide();
		$('.pass').hide();
	});

	$('.name').click(function() {
		$('.reusername').val("");
		$('.reg').css("background-color", "#605f6a");
	});
	$('.pass').click(function() {
		$('.repassword').val("");
		$('.reg').css("background-color", "#605f6a");
	});

	//注册按钮变色
	$('form input').on('input  propertychange', function() {
		if($('.reusername').val() != "" && $('.reusername').val() != $('.reusername').attr('placeholder') && $('.repassword').val() != "" && $('.repassword').val() != $('.repassword').attr('placeholder')&& $('.code').val() != "" && $('.code').val() != $('.code').attr('placeholder')) {
			$('.reg').css("background-color", "#ff296a");
		} else {
			$('.reg').css("background-color", "#605f6a");
		}
	})
	var intDiff = parseInt(60);

	function timer(intDiff) {
		//倒计时
		var second = 0; //倒计时总秒数量
		clear = window.setInterval(function() {
			//时间默认值
			$(".registers").attr('disabled', 'disabled');
			if(intDiff > 0) {
				intDiff--;
				second = intDiff;
				$('.registers').html('<s></s>' + second + 's');
			}
			if(second <= 0) {
				$('.registers').html('获取验证码');
				//防止暴力事件操作
				$(".registers").removeAttr('disabled');
				clearInterval(clear);
			}
		},
		1000);
	}
	//倒计时
	$(".registers").click(function() {
		console.log($(".reusername").val());
		if($(".reusername").val() == "") {
			alert("手机号不得为空");
			console.log('user');
		} else {
			clearInterval(clear);
			if(checkPhone()) {
				timer(intDiff);
			};
		}
	});
	//注册
	$(".reg").click(function() {
		if($(".reusername").val() == "" || $(".repassword").val() == "" || $(".code").val() == "") {
			alert("所填信息不得为空");
		} else {
			var phone = $(".reusername").val();
			var passwd = $(".repassword").val();
			var code = $(".code").val();
			$.ajax({
				type: "post",
				async: true,
				url: '/star/user/register',
				dataType: "json",
				data: {
					'phone': phone,
					'passwd': passwd,
					'code': code
				},
				success: function(data) {
					console.log(1);
					console.log(data);
					if(data.result == 1) {
						alert('注册成功!');
						var token = data.data.token;
						var userId = data.data.user.id;
						localStorage.setItem('token', token);
						localStorage.setItem('userId', userId);
						window.location.href = "../index.html"
					}
					if(data.result == 202) {
						alert('手机验证码错误');
					}
					if(data.result == 203) {
						alert('密码过于简单');
						clearInterval(clear);
						$('.registers').html('发送验证码');
						$(".registers").removeAttr('disabled');
						$('.code').val("");
						$('.reg').css("background-color", "#605f6a");
					}
					if(data.result == 204) {
						alert('手机验证码过期');
					}
					if(data.result == 205) {
						alert('用户已存在');

					}
				},
				error: function() {
					alert('fail');
				}
			});
		}
	});
});