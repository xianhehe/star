$(function(){
	//点击其中一个  当前点击的删除符号显示   其他的隐藏掉  
	$('.passwd').focus(function() {
		$('.name').show();
		$('.pass').hide();
		$('.repass').hide();
	});
	$('.newpasswd').focus(function() {
		$('.pass').show();
		$('.name').hide();
		$('.repass').hide();
	});
	$('.repasswd').focus(function() {
		$('.name').hide();
		$('.pass').hide();
		$('.repass').show();
	});
	
	//当删除任意一个填写的内容时  提交按钮变为默认颜色
	$('.name').click(function() {
		$('.passwd').val("");
		$('.update').css("background-color", "#3b394a");
	});
	$('.pass').click(function() {
		$('.newpasswd').val("");
		$('.update').css("background-color", "#3b394a");
	});
	$('.repass').click(function() {
		$('.repasswd').val("");
		$('.update').css("background-color", "#3b394a");
	});
	
	//修改密码提交按钮变色
	$('.bind input').on('input  propertychange', function() {
		//当.passwd和.newpasswd和.repasswd非空时，提交按钮变色  否则  不变
		if($('.passwd').val() != "" && $('.passwd').val() != $('.passwd').attr('placeholder') && 
		$('.newpasswd').val() != "" && $('.newpasswd').val() != $('.newpasswd').attr('placeholder') && 
		$('.repasswd').val() != "" && $('.repasswd').val() != $('.repasswd').attr('placeholder')) {
			$('.update').css("background-color", "#ff296a");
		} else {
			$('.update').css("background-color", "#3b394a");
		}
	});
	
	$(".update").click(function() {
		//当所填信息为空时  提示信息   .passwd和.newpasswd和.repasswd为空时alert
		if($(".passwd").val() == "" || $(".newpasswd").val() == "" || $(".repasswd").val() == "") {
			layer.open({content: '所填信息不得为空',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
			return false;
		}
		
		if($(".newpasswd").val() != $(".repasswd").val()){
			layer.open({content: '两次新密码输入不一致',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
			return false;
		}
		//传参  判断
		var userId=localStorage.getItem('userId'),
			token=localStorage.getItem('token'),
			passwd = $(".passwd").val(),
			newpasswd = $(".newpasswd").val();
		$.ajax({			
			type:"post",
			url:"/star/user/modifyPasswd",
			async:true,
			data:{'passwd':passwd,'newPasswd':newpasswd,'userId':userId,'token':token},
			success:function(data){
				if(data.result == 1){
					layer.open({content: '修改密码成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
				if(data.result == 200){
					layer.open({content: '用户不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
				if(data.result == 201){
					layer.open({content: '用户密码错误',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}                  
				if(data.result == 203){
					layer.open({content: '密码过于简单',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
			},
			error:function(err){
				layer.open({content: '请求失败',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
			}
		});		
	});
});
