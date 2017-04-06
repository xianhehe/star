$(function(){
	var userId = localStorage.getItem('userId'),
		token = localStorage.getItem('token');
		
	var mymess = {
		init: function(){
			var _this = this;
			_this.getinfo();
		},
		getinfo: function(){
			$.ajax({
			 	url:"/star/user/getInfo",
			 	type:"post",
			 	data: {'userId':userId,'token':token},
			 	dataType:"json",
			 	success:function(data){
			 		switch(data.result){
			 			case "1":
				 			var user = data.data.user;
				 			var html = '';
				 			if(user.isOpenedHomepage == false){
									html += '<div class="messUser"><div class="messLeft"><span>用户头像</span><p class="uploader-list"><img src="' + user.avatar + '"/></p></div><span id="filePicker" class="iconfont">&#xe600;</span></div>\
				 					<div class="messUser1"><span>用   户    名</span><div class="messReft"><input type="text" class="userStart" placeholder="请输入15个字以内的用户名" value="' + user.name + '" /><i class="iconfont val-close">&#xe608;</i></div></div>\
				 					<div class="messUser2"><span>个性宣言</span><div class="messReft"><textarea class="usertalk" placeholder="请输入30个字以内的个性宣言">' + user.enounce + '</textarea><i class="iconfont val-close">&#xe608;</i></div></div>\
				 					<div class="messUser3"><span>公开主页</span><div class="messRight"><input type="checkbox" id="checkbox_c1" class="chk_3 chk_1"/><label for="checkbox_c1"></label></div></div>\
				 					';
				 			}else{
				 				html += '<div class="messUser"><div class="messLeft"><span>用户头像</span><p class="uploader-list"><img src="' + user.avatar + '"/></p></div><span id="filePicker" class="iconfont">&#xe600;</span></div>\
				 					<div class="messUser1"><span>用   户    名</span><div class="messReft"><input type="text" class="userStart" placeholder="请输入15个字以内的用户名" value="' + user.name + '" /><i class="iconfont val-close">&#xe608;</i></div></div>\
				 					<div class="messUser2"><span>个性宣言</span><div class="messReft"><textarea class="usertalk" placeholder="请输入30个字以内的个性宣言">' + user.enounce + '</textarea><i class="iconfont val-close">&#xe608;</i></div></div>\
				 					<div class="messUser3"><span>公开主页</span><div class="messRight"><input type="checkbox" id="checkbox_c1" class="chk_3 chk_1" checked="checked"/><label for="checkbox_c1"></label></div></div>\
				 					';
				 			}				 			
							$('.sContent>div').append(html);
							mymess.modifyAvatar();							
							mymess.modifyinfo();
							mymess.Homepage();
							//监听输入框输入文字
							$('.messReft input').focus(function() {
								$(this).next().show();
								$('.messUser2 .val-close').hide();
							});
							$('.messReft textarea').focus(function() {
								$(this).next().show();
								$('.messUser1 .val-close').hide();
							});
							//快速清空输入框值
							$('.val-close').on('click',function(){
								$(this).hide().prev().val('');
							});							
			 				break;
			 			case "200": layer.open({content: '用户名不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
						default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
					}
			 	},
			 	error:function(){
					layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				}
		 	})
		},
		modifyAvatar: function(){
			// 初始化Web Uploader
			var uploader = WebUploader.create({
			    // 选完文件后，是否自动上传。
			    auto: false,
			    // swf文件路径
			    swf:'../js/Uploader.swf',
			    // 文件接收服务端。
			    server: '/star/user/modifyAvatar',
			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: '#filePicker',
			    fileVal:'image',
			    // 只允许选择图片文件。
			    accept: {
			        title: 'Images',
			        extensions: 'gif,jpg,jpeg,bmp,png',
			        mimeTypes: 'image/*'
			    },
//			    thumb:{
//			    	width: 110,
//				    height: 110,				
//				    // 图片质量，只有type为`image/jpeg`的时候才有效。
//				    quality: 70,				
//				    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
//				    allowMagnify: true,				
//				    // 是否允许裁剪。
//				    crop: true,				
//				    // 为空的话则保留原有图片格式。
//				    // 否则强制转换成指定的类型。
//				    type: 'image/jpeg'
//			    }		   
			});
			
			// 当有文件添加进来的时候
			uploader.on( 'fileQueued', function( file) {
			    var $li = $('<div id="' + file.id + '" class="file-item thumbnail">' +'<img>' +'</div>'),
			        $img = $li.find('img');
			    // $list为容器jQuery实例
			    $(".uploader-list img").remove();
			    $(".uploader-list").append( $li );
			    // 创建缩略图
			    // 如果为非图片文件，可以不用调用此方法。
			    // thumbnailWidth x thumbnailHeight 为 100 x 100
			    uploader.makeThumb( file, function( error, src ) {
			        if ( error ) {
			            $img.replaceWith('<span>不能预览</span>');
			            return;
			        }
			        $img.attr( 'src', src );
			    }, 46, 48 );			       
			});
			//文件发送前是否需要添加附带参数
			uploader.on('uploadBeforeSend', function (block, data) {
            	data.userId = localStorage.getItem('userId');
            	data.token = localStorage.getItem('token');
			});
			// 文件上传成功，给item添加成功class, 用样式标记上传成功。
			uploader.on( 'uploadSuccess', function( file, data ) {
			    $( '#'+file.id ).addClass('upload-state-done');
			    
			});
			// 文件上传失败，显示上传出错。
			uploader.on( 'uploadError', function( file, data ) {
			    var $li = $( '#'+file.id ),
			        $error = $li.find('div.error');
			    // 避免重复创建
			    if ( !$error.length ) {
			        $error = $('<div class="error"></div>').appendTo( $li );
			    }
			    $error.text('上传失败');
			});
			$('.modifyinfo').on('click',function(){
				uploader.upload();
			})			
		},
		modifyinfo: function(){
			$('.modifyinfo').on('click',function(){
				var name = $('.userStart').val(),
					enounce = $('.usertalk').val();
				$.ajax({
				 	url:"/star/user/modifyUserInfo",
				 	type:"post",
				 	data: {'userId':userId,'token':token,'name':name,'enounce':enounce},
				 	dataType:"json",
				 	success:function(data){
				 		switch(data.result){
				 			case "1":
				 				layer.open({content: '修改成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',btn: ['确定'],yes: function(index){window.history.go(-1);}});
				 				break;
				 			case "200": layer.open({content: '用户名不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
							default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
						}
				 	},
				 	error:function(){
						layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
					}
			 	})
			})		
		},
		Homepage: function(){
			$('.modifyinfo').on('click',function(){				
				if($('#checkbox_c1').prop("checked")){
		            var isOpened = "1";
				}else{
		        	var isOpened = "0";
				}
				$.ajax({
					url:"/star/user/modifyHomepageAccess",
				 	type:"post",
				 	data: {'userId':userId,'token':token,'isOpened':isOpened},
				 	dataType:"json",
				 	success:function(data){
				 		switch(data.result){
				 			case "1": layer.open({content: '操作成功',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',btn: ['确定'],yes: function(index){window.history.go(-1);}});break;
				 			case "100": layer.open({content: '请求参数不正确',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
				 			case "200": layer.open({content: '用户名不存在',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
							default: layer.open({content: '网络出错',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2}); break;
				 		}
				 	},
				 	error:function(){
				 		layer.open({content: '请求失败，请重试',style: 'background:rgba(0,0,0,.8); color:#fff; border:none;',time: 2});
				 	}
				});
			})
		}
	}
	mymess.init();
});