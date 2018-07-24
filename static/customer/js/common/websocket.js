//index页面script
$(function() {
    doLogin('index');
    // initAllCoin(1);
    $.each(allMarkets,function(k){
        initAllCoin(k)
    })
});
$(function() {
    $('#wx_link').hover(function() { $('.wx_ma').show(); }, function() { $('.wx_ma').hide() });
})
show_captcha();

function show_error_captcha(sign) {
    if (sign) {
        str = '<input type="text" name="captcha" class="login_captcha left" placeholder="" data-placeholder="右图的验证码"> <img onclick="show_captcha()" id="img-captcha"  src="/servlet/ValidateImageServlet?t=0.02032651285993259" class="login_img-captcha left" alt="图片验证码">';

        $('#code').html(str).addClass('ogin_text clear');
    } else {
        $('#code').html('').removeClass('ogin_text clear');
    }
}
function userlimit(status) {
    $.cookie('limit_area', status);
    hideDialog('dialog_address');
}

function dialog_login_yz() {
    var html = '';
    html += '<div class="dialog_content styled-pane" id="dialog_login_yz">' +
        '<a id="closeBtn" class="dialog_closed to_index" title="关闭">×</a>' +
        '<div class="forgetpw_box">' +
        '<h2 style="padding: 40px 0px;"></h2>' +
        '<p>' + lang('当前账户未激活，为保障您的账户安全，需要发一封激活') + '<br>' + lang('邮件到您的注册邮箱，请进入邮箱进行激活。') + '</p>' +
        '<a class="btn">' + lang('确定') + '</a>' +
        '</div>' +
        ' </div>';
    $('body').prepend(html);
    showDialog('dialog_login_yz');
    $('#closeBtn').click(function() {
        hideDialog('dialog_login_yz');
        window.location.href = '/';
    })
    $('#dialog_login_yz .btn').click(function() {
        $.post(WebHelper.ReSendActiveMail, { email: $('#login-email-i').val() }, function(d) {
            if (d.status) {
                alert(lang('发送成功'));
            } else {
                alert(lang('发送失败'));
            }
            hideDialog('dialog_login_yz');
            setTimeout(function() {
                window.location.href = '/';
            }, 2000)
        }, 'json');
    })
}
//激活 socket
function websocketInit() {
	//已经激活,不再触发
	if (typeof websocket != 'object' || websocket.readyState != 1 || typeof websocket == 'undefined') {
		var wsprotocal = document.location.protocol == 'https:' ? 'wss:' : 'ws:';
		var wsUri = wsprotocal + "//" + document.domain + "/socket";
		websocket = new WebSocket(wsUri);
		websocket.onopen = function () {
			//console.log('激活' + websocket.readyState);
		};
		return websocket;
	} else {
		return websocket;
	}
}

//socket onMessage
function socketMessage() {
	websocket.onmessage = function (evt) {
	    if (evt.data instanceof Blob) {
            var fileReader = new FileReader();
            fileReader.onload = function() {
                if (fileReader.readyState == 2) {
                    var plain = pako.inflate(this.result);
                    var localdata="";
                    for (var i=0; i<plain.byteLength; i++) {
                        localdata += String.fromCharCode(plain[i]);
                    }
                    processWsData(localdata);
                }
            };
            fileReader.readAsArrayBuffer(evt.data);
        } else {
            processWsData(evt.data);
        }
	}
}

//处理数据
function processWsData(d) {
    var data = JSON.parse(d);
    if (data.type == coin + 'order') {
        fillorder(data.data);

    } else if (data.type == coin + 'trades') {
        filltrades(data.data);

    } else if (data.type == coin + 'ticker') {
        fillticker(data.data);

    } else if (data.type == coin + 'k.js') {
        eval(data.data);
        refilldata();

    } else if (data.type == 'chathistory') {
        var datas = JSON.parse(evt.data);
        datas['admin'] = admin;
        fillchatlist(datas);

    } else if(data.type == coin + 'depth.js'){
        filldepth(data.data);

    } else if (data.type == 'rate') {
        if (typeof FINANCE != 'undefined') FINANCE.rate = data.data;
        topRefreshRate(data.data);

    } else if (data.type == 'trust') {
        updateTrusts(data.data);

    } else if (data.type == 'apitickers') {
        fillapitickers(data.data);

    } else if (data.type == 'asset') {
        if (typeof FINANCE != 'undefined') FINANCE.finance = data.data;
        balance();

    } else if (data.type == 'trends') {
        filltrends(data.data);
    }
}

// app关闭开启
var appOpen = 1;
function appapiPageVisiable(appStatus) {
    if (appStatus == 1) {
        appOpen = 1;
    } else if (appStatus == -1) {
        appOpen = 0;
    }
}