
function register_notification_home() {
	alert("register_notification_home");
	var networkState2 = navigator.connection.type;
	if (networkState2 == Connection.NONE) {
	
	}
	else
	{
		alert("we have internet");
		var push = PushNotification.init({
			android: {
				senderID: "804625540618"
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true"
			},
			windows: {}
		});

		push.on('registration', function(data) {
			// data.registrationId
			alert("registration event: " + data.registrationId);
			alert("server_url");
			$.ajax({ type: "POST",
					url: server_url + "/SMCMS_notification/RegisterDeviceIDtoDB.php", 
					data: {regID : data.registrationId,user:window.localStorage.getItem('uuid'),OS:device.platform},
					async: false,
					success : function(text)
					{
						alert(text);
						//last_articles_version = text;
						console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    Notification registration text : ' + text);
						window.localStorage.setItem('register_for_notifs','yes');
					}
			});
		});

		push.on('notification', function(data) {
			// data.message,
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData
			navigator.notification.alert(
				data.message,			// message
				notif_alertDismissed,	// callback
				'اطلاعیه',				// title
				'تائید'					// buttonName
			);
		});

		push.on('error', function(e) {
			// e.message
			// alert("push error = " + e.message);
		});
	}

}

function register_notification() {
	var networkState = navigator.connection.type;
	if (networkState == Connection.NONE) {
	
	}
	else
	{
		var push = PushNotification.init({
			android: {
				senderID: "804625540618"
			},
			ios: {
				alert: "true",
				badge: "true",
				sound: "true"
			},
			windows: {}
		});

		push.on('registration', function(data) {
			// data.registrationId
			// alert("registration event: " + data.registrationId);
			window.localStorage.setItem('notification_id',data.registrationId);
		});

		push.on('notification', function(data) {
			// data.message,
			// data.title,
			// data.count,
			// data.sound,
			// data.image,
			// data.additionalData
			navigator.notification.alert(
				data.message,			// message
				notif_alertDismissed,	// callback
				'اطلاعیه',				// title
				'تائید'					// buttonName
			);
		});

		push.on('error', function(e) {
			// e.message
			// alert("push error = " + e.message);
		});
	}

}


function notif_alertDismissed(){};










