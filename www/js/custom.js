function go_back_index() {
	if($$("body").hasClass("with-panel-left-reveal"))
	{
		myApp.closePanel();
		return true;
	}
	navigator.notification.confirm(
		'آیا تمایل به خروج از برنامه را دارید؟',	// message
		onExitConfirm,								// callback
		'توجه',										// title
		['بله','خیر']								// buttonName
	);
}
function onExitConfirm(buttonIndex) {
	if(buttonIndex==1)
		navigator.app.exitApp();
}
function goto_blog() {
	if($$("body").hasClass("with-panel-left-reveal"))
	{
		myApp.closePanel();
		return true;
	}
	mainView.router.loadPage('blog.html');
}
function show_favorites_list() {
	temp_array = JSON.parse(window.localStorage.getItem('favorites'));
	if(temp_array.length>0)
		mainView.router.loadPage('favorites.html');
	else
		myApp.alert('در حال حاضر هیچ مطلبی در بخش علاقه مندی ها وجود ندارد','توجه', function () {});
}

$( document ).ready(function(){





});
function check_net_home_page(){
	// return false;
	if(window.localStorage.getItem("favorites")==null)
	{
		window.localStorage.setItem('favorites',JSON.stringify([]));
	}
	if(check_net(true,false))
	{
		get_news();
	}
	else
	{
		if(window.localStorage.getItem("news")==null)
		{
			myApp.alert('در پروسه اتصال به سرور مشکلی به وجود آماده است ، لطفا وضعیت اینترنت را بررسی نمایید.','توجه', function () {});
		}
		else
			goto_news();
	}
}
function goto_news(){
	// alert("goto_news");
	mainView.router.loadPage('blog.html');
}
function get_news(){
	myApp.showIndicator();
	$.ajax({
			url: server_url+'/output.php?act=news',
			type: "POST",
			//async: true,
			success : function(text)
			{
				console.log(text);
				myApp.hideIndicator();
				if(text.success == true)
				{
					window.localStorage.setItem("news",JSON.stringify(text));
					
					var arr = text.news;
					var html_temp = "";
					for(var i=0;i<5;i++)
					{
						if(arr.hasOwnProperty(i) && arr[i].text!="")
						{
							window.localStorage.setItem("id_" + arr[i].id,JSON.stringify(arr[i]));
							window.sessionStorage.setItem("id_" + arr[i].id,JSON.stringify(arr[i]));
						}
					}
					
					goto_news();
				}
				else
					myApp.alert(text.data,'توجه', function () {});
			},
			error: function(jqXHR, exception) {
				myApp.hideIndicator();
				myApp.alert('در پروسه اتصال به سرور مشکلی به وجود آماده است ، لطفا وضعیت اینترنت را بررسی نمایید.','توجه', function () {});
			},
	});
}
function check_net(show_alert,do_loop){
	// return false;
	// console.log(networkState);
	if (networkState == Connection.NONE) {
		if(show_alert)
		{
			if(do_loop)
				window.sessionStorage.setItem("do_loop","1");
			else
				window.sessionStorage.setItem("do_loop","0");

			myApp.alert('شما برای استفاده از این برنامه نیاز به اینترنت دارید','توجه', function () {
				if(window.sessionStorage.getItem("do_loop")=="1")
				{
					window.sessionStorage.removeItem("do_loop");
					check_net(true,true);
				}
			});
		}
		return false;
	}
	return true;
}
function init_virtual_list_of_news(){
	myApp.showIndicator();
	try{
		var news = JSON.parse(window.localStorage.getItem("news"));
	}
	catch(err){
		console.log(err);
		return false;
	}
	// console.log(news);
	if(news.success == true)
	{
		var arr = news.news;
		var html_temp = "";
		if(arr.length>0)
		{
			var temp_btn_gallery = '<div class="swiper-container swiper-init ks-carousel-slider">';
			temp_btn_gallery += '<div class="swiper-pagination swiper-pagination-c2"></div>';
			temp_btn_gallery += '<div class="swiper-wrapper">';
			for(var i=0;i<3;i++)
			{
				// temp_btn_gallery += '<div class="swiper-slide" ><img src="img/no-image-t.png" style="background-image:url(\'' + server_url + arr[i].image + '\'),url(\'img/no-image.png\');width:100%;"><h2 onclick="goto_one_news_page(' + arr[i].id + ')">' + arr[i].title + '</h2></div>';
				temp_btn_gallery += '<div class="swiper-slide" ><div class="article" style="background-image:url(\'' + server_url + arr[i].image + '\'),url(\'img/no-image.png\');width:100%;margin:0;"><h2 onclick="goto_one_news_page(' + arr[i].id + ')">' + arr[i].title + '</h2></div></div>';
			}
			temp_btn_gallery += '</div>';
			temp_btn_gallery += '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>';
			temp_btn_gallery += '</div>';
			$$("#slider_content").html(temp_btn_gallery);
			var mySwiper = myApp.swiper('.swiper-container', {
				speed: 400,
				spaceBetween: 20,
				slidesPerView: 1,
				paginationHide: true,
				pagination: ".swiper-pagination-c2",
				nextButton: ".swiper-button-next",
				prevButton: ".swiper-button-prev",
			});
		}
		if(arr.length>3)
		{
			for(var i=3;i<arr.length;i++)
			{
				html_temp = html_temp  +
									'<article>' +
									'<div class="list-block media-list">' +
									// '<img class="article" src="img/no-image-t.png" style="background-image:url(\'' + server_url + arr[i].image + '\'),url(\'img/no-image.png\');">' +
									// '<img class="article lazyload" src="img/no-image.png" data-src="' + server_url + arr[i].image + '">' +
									// '<div class="article lazyload" style="url(\'img/no-image.png\');" data-src2="background-image:url(\'' + server_url + arr[i].image + '\'),url(\'img/no-image.png\');"></div>' +
									'<div class="article lazyload" style="background-image:url(\'img/no-image.png\');" data-src="' + server_url + arr[i].image + '"></div>' +
									'<div class="content-block"><h2 onclick="goto_one_news_page(' + arr[i].id + ')">' + arr[i].title + '</h2>' +
									'<p>' + (arr[i].introtext!=''?arr[i].introtext:'خبر متنی ندارد') + '</p>' +
									'<a class="button " href="javascript:goto_one_news_page(' + arr[i].id + ')"><span class="btn_text">مطالعه بیشتر</span><span class="btn_date">' + arr[i].date + '</span></a></div>' +
									// '<a class="button " href="blogDetail.html?id=' + arr[i].id + '">ادامه مطلب</a></div>' +
									'<div class="separator"></div>' +
									'</div>' +
									'</article>';			
			}
			$$("#blog_content").html(html_temp);
			lazyload();
		}
		$$(".show_favorites_list").click(function(e){
			temp_array = JSON.parse(window.localStorage.getItem('favorites'));
			if(temp_array.length>0)
				mainView.router.loadPage('favorites.html');
			else
				myApp.alert('در حال حاضر هیچ مطلبی در بخش علاقه مندی ها وجود ندارد','توجه', function () {});
		});
		/*
		var data = [];
		for(var i=0;i<arr.length;i++)
		{
			data.push
			({
				id: 			arr[i].id,
				title: 		arr[i].title,
				text: (arr[i].text!=''?arr[i].text:'خبر متنی ندارد'),
				image: 		arr[i].image,
			});
		}
		myApp.virtualList('.list-block.virtual-list',
		{
			items:data,
			template: '<li class="item-content">' +
								'<article>' +
								'<div class="list-block media-list">' +
								'<img class="article" src="img/no-image-t.png" style="background-image:url(\'' + server_url + '{{image}}\'),url(\'img/no-image.png\');">' +
								'<div class="content-block"><h2>{{title}}</h2>' +
								'<p>{{text}}</p>' +
								'<div class="separator"></div>' +
								'<a class="button " href="javascript:show_news({{id}})">ادامه مطلب</a></div>' +
								'</div>' +
								'</article>' +
							'</li>'
		});
		*/
	}
	else
		myApp.alert(text.data,'توجه', function () {});

	myApp.hideIndicator();
}
function getUrlVars(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
function format( url, rez, params ) {
	params = params || '';

	if ( $.type( params ) === "object" ) {
		params = $.param(params, true);
	}

	$.each(rez, function(key, value) {
		url = url.replace( '$' + key, value || '' );
	});

	if (params.length) {
		url += ( url.indexOf('?') > 0 ? '&' : '?' ) + params;
	}

	return url;
};
function show_news(){
	var id = getUrlVars()["id"];
	var news;
	if(window.sessionStorage.getItem("id_" + id)!==null)
		news = window.sessionStorage.getItem("id_" + id);
	else if(window.localStorage.getItem("id_" + id)!==null)
		news = window.localStorage.getItem("id_" + id);
	else
	{
		mainView.router.loadPage('blog.html');
		return false;
	}
	try{
		news = JSON.parse(news);
	}
	catch(err){
		console.log(err);
		mainView.router.loadPage('blog.html');
		return false;
	}
	// $$("#image-container").attr("src",server_url + news.image);
	$$("#image-container").html('<div class="article" style="background-image:url(\'' + server_url + news.image + '\'),url(\'img/no-image.png\');width:100%;margin:0;"></div>');
	$$("#header-container").html(news.title);
	$$("#text-container").html(news.text);
	
	if(news.video_url!="")
	{
		try
		{
			matcher			= /aparat\.com\/v\/([a-zA-Z0-9_\-]+)\/?/i;
			url_pattern	= 'https://aparat.com/video/video/embed/videohash/$1/vt/frame';
			url				= news.video_url;
			rez				= url.match(matcher);
			var params;

			if (rez) {
				type	= 'iframe';
				url	= $.type( url_pattern ) === "function" ? url_pattern.call( this, rez, params, obj ) : format( url_pattern, rez, params );
				$$("#video-container").html("<iframe src='" + url + "' style='position:absolute;top:0;left:0;width:100%; height:100%;border: 0;' width='100%' height='100%' allowFullScreen='true' webkitallowfullscreen='true' mozallowfullscreen='true'></iframe>");
				$$("#video-container").attr("style","display:block;width:100%;height:auto;position:relative; padding-bottom: 56.25%;");
			}
		}
		catch(err){console.log(err)}
	}
	
	
	if(news.gallery.length>0)
	{
		var temp_btn_gallery = '<div class="swiper-container swiper-init ks-carousel-slider">';
		temp_btn_gallery += '<div class="swiper-pagination swiper-pagination-c2"></div>';
		temp_btn_gallery += '<div class="swiper-wrapper">';
		for(var i=0;i<news.gallery.length;i++)
		{
			temp_btn_gallery += '<div class="swiper-slide"><img src="' + server_url + news.gallery[i] + '" style="width:100%;"></div>';
		}
		temp_btn_gallery += '</div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>';
		$$("#gallery-container").html(temp_btn_gallery);
		var mySwiper = myApp.swiper('.swiper-container', {
			speed: 400,
			spaceBetween: 20,
			slidesPerView: 1,
			pagination: ".swiper-pagination-c2",
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev",
		});
	}
	
	for(var i=0;i<news.sound.length;i++)
	{
		var temp_btn = '<a onclick="window.open(\'' + server_url + news.sound[i][0] + '\',\'_system\');" class="button button-big button-fill button-raised color-teal" style="margin-bottom: 10px;" >' + news.sound[i][1] + '</a>';
		$$("#sound-container").append(temp_btn);
	}
	
	
	temp_array = JSON.parse(window.localStorage.getItem('favorites'));
	if((jQuery.inArray(id,temp_array) != -1))
	{
		$$(".add_to_favorites").find("i").removeClass("fa-star-o").addClass("fa-star");
	}
	$$(".add_to_favorites").click(function(e){
		temp_array = JSON.parse(window.localStorage.getItem('favorites'));
		
		if($$(this).find("i").hasClass("fa-star-o"))
		{
			temp_array.push(id);
			window.localStorage.setItem('favorites',JSON.stringify(temp_array));
			$$(this).children().removeClass("fa-star-o").addClass("fa-star");
		}
		else
		{
			console.log(temp_array);
			temp_array.splice($.inArray(id ,temp_array),1);
			console.log(temp_array);
			window.localStorage.setItem('favorites',JSON.stringify(temp_array));
			$$(this).children().removeClass("fa-star").addClass("fa-star-o");
		}
	});
	
	process_counter_for_news_id(id);
	console.log("show_news()");
}
function process_counter_for_news_id(id){
	console.log("process_counter_for_news_id");
	$.ajax({
			url: server_url+'/output.php?act=process_counter&id=' + id,
			type: "POST",
			//async: true,
			success : function(text){console.log("text");},
			error: function(jqXHR, exception) {console.log("error");},
	});
}
function goto_one_news_page(id){
	console.log(id);
	if(window.sessionStorage.getItem("id_" + id)!==null)
	{
		console.log("we have sessionStorage for " + id);
		mainView.router.loadPage('blogDetail.html?id=' + id);
	}
	else
	{
		if(check_net(true,false))
		{
			myApp.showIndicator();
			$.ajax({
					url: server_url+'/output.php?act=get_one_new&id=' + id,
					type: "POST",
					//async: true,
					success : function(text)
					{
						console.log(text);
						myApp.hideIndicator();
						if(text.success == true)
						{
							var arr = text.news;
							window.localStorage.setItem("id_" + arr[0].id,JSON.stringify(arr[0]));
							window.sessionStorage.setItem("id_" + arr[0].id,JSON.stringify(arr[0]));
							mainView.router.loadPage('blogDetail.html?id=' + id);
						}
						else
							myApp.alert(text.data,'توجه', function () {});
					},
					error: function(jqXHR, exception) {
						myApp.hideIndicator();
						myApp.alert('در پروسه اتصال به سرور مشکلی به وجود آماده است ، لطفا وضعیت اینترنت را بررسی نمایید.','توجه', function () {});
					},
			});
		}
		else
		{
			if(window.localStorage.getItem("id_" + id)==null)
			{
				mainView.router.loadPage('blogDetail.html?id=' + id);
			}
			else
				myApp.alert('در پروسه اتصال به سرور مشکلی به وجود آماده است ، لطفا وضعیت اینترنت را بررسی نمایید.','توجه', function () {});
		}
	}
}
function show_favorites(){
	myApp.showIndicator();
	
	var news = [];
	
	temp_array = JSON.parse(window.localStorage.getItem('favorites'));
	if(temp_array.length>0)
	{
		for(var i=0;i<temp_array.length;i++)
		{
			news.push(JSON.parse(window.localStorage.getItem("id_" + temp_array[i])));			
		}
	}

	// console.log(news);
	// return true;
	
	var arr = news;
	var html_temp = "";
	if(arr.length>0)
	{
		for(var i=0;i<arr.length;i++)
		{
			html_temp = html_temp  +
								'<article>' +
								'<div class="list-block media-list">' +
								// '<img class="article" src="img/no-image-t.png" style="background-image:url(\'' + server_url + arr[i].image + '\'),url(\'img/no-image.png\');">' +
								// '<img class="article lazyload" src="img/no-image.png" data-src="' + server_url + arr[i].image + '">' +
								// '<div class="article lazyload" style="url(\'img/no-image.png\');" data-src2="background-image:url(\'' + server_url + arr[i].image + '\'),url(\'img/no-image.png\');"></div>' +
								'<div class="article lazyload" style="url(\'img/no-image.png\');" data-src="' + server_url + arr[i].image + '"></div>' +
								'<div class="content-block"><h2 onclick="goto_one_news_page(' + arr[i].id + ')">' + arr[i].title + '</h2>' +
								'<p>' + (arr[i].introtext!=''?arr[i].introtext:'خبر متنی ندارد') + '</p>' +
								'<a class="button " href="javascript:goto_one_news_page(' + arr[i].id + ')"><span class="btn_text">مطالعه بیشتر</span><span class="btn_date">' + arr[i].date + '</span></a></div>' +
								// '<a class="button " href="blogDetail.html?id=' + arr[i].id + '">ادامه مطلب</a></div>' +
								'<div class="separator"></div>' +
								'</div>' +
								'</article>';			
		}
		$$("#favorites_content").html(html_temp);
		// console.log(html_temp);
		lazyload();
	}

	myApp.hideIndicator();
}