$(function(){
	var mailbox = {
		init: function(){
			var _this = this;
			_this.bind();
			_this.other();
		},
		bind: function(){
			//绑定邮箱确认按钮
			$(".btn-confirm").click(function() {
				var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi;
				var email = $(".bind-mailbox").val();
				if($(".bind-mailbox").val() == "" || $(".bind-mailbox").val() == $('.bind-mailbox').attr('placeholder')) {
					layer.open({content: '请输入邮箱地址',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					return false;
				}else if(!reg.test(email)){
					layer.open({content: '请输入正确的邮箱地址',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					return false;
				} else {
					var userId = localStorage.getItem('userId'),
						token = localStorage.getItem('token'),
						email = $(".bind-mailbox").val();
					$.ajax({
						type: "post",
						async: true,
						url: '/star/user/sendVerifyEmail',
						dataType: "json",
						data: {'userId':userId,'token':token,'email': email},
						success: function(data) {
							switch(data.result){
		        				case "1": layer.open({content: '邮件已成功发送到邮箱!',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});break;
								case "218": layer.open({content: '邮箱格式不正确',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});break;
		        				default: layer.open({content: '网络出错，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});break;
							}
						},
						error: function() {
							layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
						}
					});
				}
			});
		},
		other: function(){
			//快速清空
			$('.icon-close').on('click',function(){
				$(this).hide().prev().val('');
			})
			
			//确认按钮变色
			$('.yan input').on('input  propertychange', function() {
				if($('.bind-mailbox').val() !== "" && $('.bind-mailbox').val() !== $('.bind-mailbox').attr('placeholder') ) {
					$(this).next().show();
					$('.btn-confirm').css("background-color", "#ff296a");
				} else {
					$(this).next().hide();
					$('.btn-confirm').css("background-color", "#605f6a");
				}
			})
		}
	}
	mailbox.init();
})