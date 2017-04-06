//手机号验证
function checkPhone() {
	var phone = $('.username').val();
	if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
		$(".username").val("手机号码有误，请重填");
		return false;
	}
};
$('.username').blur(function() {
	checkPhone();
});
//清除按钮显示消失
$(".username").focus(function() {
	$(".username").val("");
	$(".name").show().next().hide();
	$('.login').css("background-color", "#605f6a");
});
$(".password").focus(function() {
	$(".pass").show().prev().hide();
});

$(".name").click(function() {
	$(".username").val("");
	$('.login').css("background-color", "#605f6a");
});
$(".pass").click(function() {
	$(".password").val("");
	$('.login').css("background-color", "#605f6a");
});
//登录按钮变色
$('form input').on('input  propertychange', function() {
	if($('.username').val() != "" && $('.username').val() != $('.username').attr('placeholder') && $('.password').val() != "" && $('.password').val() != $('.password').attr('placeholder')) {
		$('.login').css("background-color", "#ff296a");
	} else {
		$('.login').css("background-color", "#605f6a");
	}
})
	//登录请求
$('.login').click(function() {
	if($('.username').val() == '手机号码有误，请重填') {
		alert('手机号码有误，请重填');
	} else if($('.username').val() != '' && $('.password').val() != '') {
		$.ajax({
			type: "get",
			async: true,
			url: '/star/user/login?phone=' + $('.username').val() + '&passwd=' + $('.password').val(),
			dataType: "json",
			success: function(data) {
				console.log(data);
				console.log($('.username').val());
				console.log($('.password').val());
				if(data.result == 1) {
					console.log(data.data);
					console.log(data.data.user);
					alert('恭喜你，登录成功!');
					var token = data.data.token;
					var userId = data.data.user.id;
					localStorage.setItem('token', token);
					localStorage.setItem('userId', userId);
					window.location.href = "../index.html"

				}
				if(data.result == 200) {
					alert('用户不存在!');
				}
				if(data.result == 201) {
					alert('用户名或者密码错误!');
				}
			},
			error: function() {
				alert('fail');
			}
		});
	} else {
		alert("用户名或密码不得为空")
	}
})