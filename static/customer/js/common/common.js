//移动设备跳转
;(function () {
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad|Samsung)/i) ) {
        if ($.cookie('isPc')||location.search.indexOf('e=pc')>-1) {
            $.cookie('isPc','e=pc',{ expires: 1, path: '/' })
            $('.top-fixed-nav').prepend('<div id="jumpToWap" onclick="location.href = \'/wap/\'">'+lang('跳转至移动端')+'</div>')
            $('.coin_con_t').css('marginTop','90px')
            $('.body').css('marginTop','90px')
            $('.main').css('marginTop','40px')
            setLanguage();
            return;
        }
        $.cookie('lang','',{expires:-1,path:'/'});
        if(location.href.indexOf('.vip')>-1){
            location.href = ' https://www.btc98.vip/wap/';
        }else{
            location.href = 'https://www.btc98.com/wap/';
        }
    }else{
        setLanguage();
    }
})();
// 判断语言
function setLanguage() {
	if(getRequestByName('lang')){
		$.cookie('lang',getRequestByName('lang'),{ expires: 7, path: '/' })
	}
	if(!$.cookie('lang')){
//		$.cookie('lang',navigator.language.replace('-','_'),{ expires: 7, path: '/' })
		$.cookie('lang','en_US',{expires:7,path:'/'});
	}

		if($.cookie('lang')=='zh_TW'){
			//繁体
			langs=langs_TW;
		}else if($.cookie('lang')=='ko_KR'){
			langs=langs_ko;
		}else if($.cookie('lang')=='ja_JP'){
			langs=langs_ja;
		}else if($.cookie('lang')=='ar_AE'){
            langs=langs_ar;
        }else if($.cookie('lang')=='ru_RU'){
            langs=langs_ru;
        }else if($.cookie('lang')=='fr_FR'){
            langs=langs_fr;
        }else if($.cookie('lang')=='es_AR'){
            langs=langs_es;
        }else if($.cookie('lang')=='my_ZG'){
            langs=langs_my;
        }

//		$('body').find('li').each(function(){
//			for(o in langs){
//				if($(this).html().indexOf(o)>-1){
//					if($(this).has('a'))break;
//					$(this).html($(this).html(langs[o]))
//				}
//			}
//		})
        var _isnotIndex=isnotIndexFn();
		var cclang=$.cookie('lang');
        $('.foot_logo:eq(1)').hide();

        // $('.share_area').prev('li').remove()
        if(cclang!='zh_CN'){
            $('.friendLink').hide();
        }
        if(!_isnotIndex){//首页中英对调
            if(cclang=='zh_CN'){
                cclang='en_US'
            }else if(cclang=='en_US'){
                cclang='zh_CN';
            }
        }
//		$('html').find('a,p,span,button,dd,th,option,div,font,td,em,title').each(function(){
		$('html').find('*[data-cont]:not(input)').each(function(){
			for(o in langs){
				if($(this).attr('data-cont')==o){
                    if($(this).attr('content')==''){
                        $(this).attr('content',langs[o]);
                    }else{
                        $(this).html(langs[o]);
                    }
					if(cclang=='zh_CN'){
                        // $('title').html('BTC98 - 比特酒吧专业的区块链资产交易平台')
						$(this).html($(this).attr('data-cont'));
					}
				}
			}
		})
	$('body').find('input').each(function(){
		for(o in langs){
			if($(this).attr('data-cont')==o){
				$(this).val(langs[o])
				if(cclang!='zh_CN'){
					$(this).val(langs[o])
				}else{
					$(this).val(o);
				}
			}
			if($(this).attr('data-placeholder')==o){
				if(cclang!='zh_CN'){
					$(this).attr('placeholder',langs[o])
				}else{
					$(this).attr('placeholder',o);
				}
			}
		}
	})
    if(cclang=='ar_AE'){
        $('.copyright').addClass('directionRight')
    }
    $('.dollarOrRmb').html($.cookie('lang')=='zh_CN'?'折合 '+getLang_rate():getLang_rate())
    //首页公告
    $('.dollarOrRmbNotice').html(getLang_rate());
    $('.currencySymbol').html(getCurrencySymbol())
    if(!_isnotIndex){//改回
        if(cclang=='zh_CN'){
            cclang='en_US'
        }else if(cclang=='en_US'){
            cclang='zh_CN';
        }
    }
	$('.lang .flag').addClass(cclang);
    $('.lang .flagName').html($('.lanague .'+cclang+' a').html());

	$.get(WebHelper.updatelanguage,'lang='+cclang,function(d){
		if(d.status===1){

		}
	})
};
//根据语言，获取法币
function getLang_rate() {
    switch($.cookie('lang')){
        case 'zh_CN': return 'CNY';
        case 'zh_TW': return 'HKD';
        case 'ja_JP': return 'JPY';
        case 'ru_RU': return 'RUB';
        case 'ko_KR': return 'KRW';
        case 'en_US': return 'USD';
            default:return 'USD';
    }
}
//根据语言，拿到公告
function getLang_notice() {
    switch($.cookie('lang')){
        case 'zh_CN': return 'zh';
        case 'zh_TW': return 'cht';
        case 'ja_JP': return 'jp';
        case 'ru_RU': return 'ru';
        case 'ko_KR': return 'kor';
        case 'en_US': return 'en';
        case 'ar_AE': return 'ara';
    }
}
//根据语言，返回货币符号
function getCurrencySymbol() {
    switch($.cookie('lang')){
        case 'zh_CN': return '￥';
        case 'zh_TW': return '￥';
        case 'ja_JP': return 'J￥';
        case 'ru_RU': return '₽';
        case 'ko_KR': return '₩';
        case 'en_US': return '$';
        case 'ar_AE': return '$';
            default:return '$';
    }
}
function cutLanguage(href){
	var index=location.href.indexOf('&lang=');
	if(location.search.indexOf('?')==-1){
		href='?'+href;
	}
	if(index!=-1){
		location.href=location.href.replace(location.href.substring(index,index+11),href);
	}else{
		location.href=location.href+href;
	}
}
//判断是否登录
function doLogin(href, callbak,params) {
	//inspectLogin();
	$.ajax({
        type: 'POST',
        url: WebHelper.CheckLogin,
        contentType : 'application/json',
        data : JSON.stringify({'token':$.cookie('token')}),
        dataType: 'json',
        async:false,
        success: function (d) {
        	if(d.status===1){
    		}else{
    			clearCookie();
                // if(location.href.indexOf('index.html')==-1)location.href='/index.html'
    		}
            user();//放到这里，当cookie失效，及时清除账户信息
            if(d.data){
                if(d.data.fpostRealValidate&&d.data.fhasRealValidate){
                    $.cookie('userFlag','1',{expires:7,path:'/'});
                }else{
                    $.cookie('userFlag','0',{expires:7,path:'/'});
                }
                if(href=='coinOffer'&&d.status==-9){
                    location.href='/user/login.html';
                    return alert(d.msg);
                }else if(href=='coinOffer'&&d.data.view!=1){
                    location.href='/';
                    return alert('此账号无权限')
                }
                if(href=='businessmenCoin'&&d.data.view!=2){
                    location.href='/';
                    return alert('此账号无权限')
                }
            }
        	var userName = $.cookie('userName');
        	if(href=='trade'){
        		location.href="/trade/trade.html";return;
        	}
        	if(href=='usdt'||href=='resetPassword'){
        		return;
        	}
           	if(!href&&location.href.indexOf('/other')>-1)return;
        	if(href=='withdraw'){
        		if(!d.data.fhasRealValidate){
//        			alert(lang('请先进行身份验证!'))
//        			location.href = "/security/authentication.html";
//        			return;
                	if(d.data.fpostRealValidate){
                		if(d.data.fhasRealValidate){
                			location.href = '/security/authenticationPass.html';
                		}else{
                			location.href = '/security/authenticationPass.html';
                		}
                	}else if(!d.data.fpostRealValidate && !d.data.fhasRealValidate){
            			alert(lang('请先进行身份验证!'))
                		location.href = '/security/authentication.html';
                	}
                	return;
        		}
        		if(d.data.fopenTransferGoogleValidate){
        			$('#totpCode').show();
        		}else{
        			$('#totpCode').hide();
        		}
        	}

        	if(href=='coinTrade'){
            	if(d.data.isNeedTradePassword){
            		$('.pwdtrade').show();
            	}else{
            		$('.pwdtrade').hide();
            	}
            	return;
        	}
        	if(href=='certification'){
        		if(d.data.fgoogleBind){
        			location.href = '/security/doubleAtt.html';
        		}else{
                    location.href = '/security/certification.html';
                }
                return;
        	}
        	if(!userName && href=='index'){
        		$('#index_well').show();
                $('#index_well2').hide();
                return;
            } else if (!userName) {
        		redirectLoginPage();
                return;
        	}else{
                $('#index_well').hide();
                $('#index_well2').show();
        	}
        	//检测登录状态
        	// $(".top-login .login").css('display','none');
        	// $(".top-user-email").css('display','block').html(encryptUserName(userName));
        	// $('.sj_bd').css('display','block');
            if(href=='usdt'){
                location.href='/trade/usdt.html'
            }else if (href=='finance') {
            	location.href='/finance/finance.html';
            }else if(href=='security'){
            	location.href="/security/security.html";
            }else if(href=='withdraw'){
                var param='';
                if(params)param=params;
            	location.href="/finance/withdraw.html"+param;
            }else if(href=='authentication'){
            	if(d.data.fpostRealValidate){
        			location.href = '/security/authenticationPass.html';
            	}else if(!d.data.fpostRealValidate && !d.data.fhasRealValidate){
            		location.href = '/security/authentication.html';
            	}
            }

            if(callbak){
            	callbak(d);
            }
        }
    })
}

function checkLoginStatus(status){
	if(status == -9){
		clearCookie();
		if(alert(lang("登录超时，请重新登录"))){
			location.href = '/user/login.html';
		}
	}
}

//判断有没有登录再跳转导航菜单
$(function(){
	$(".valid-login").on("click",function(e){
		var href = $(this).attr("href-html");
		var userName = ('userName');
		if (!userName) {
	        location.href = '/user/login.html';
		}else if(href){
			location.href = href;
		}
	});

});

function getRequestByName(name) {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
    }
    if (theRequest) {
        return theRequest[name];
    }

    return null;
}
var getRequest = function() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var getRequestByUrl = function(url) {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.split('?')[1];
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

var validatePhone = function(phone) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(!myreg.test(phone)) {
        return false;
    }

    return true;
}

function isEmail(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * json日期格式转换为正常格式 yyyy-MM-dd hh:mm:ss
 * @param date
 * @param format
 * @returns {*}
 */
var jsonDateFormat=function(date,format) {
    try {
        var d = new Date(date);
        var o = {
            "M+": d.getMonth() + 1,
            "d+": d.getDate(),
            "h+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            "S": d.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
            }
        }
        return format
    } catch (e) {
        console.error(e);
        return "";
    }
};

//获取所有币种
function allcoin(){
        var cC = $.cookie('allCoin1');
        if(!cC){
            initAllCoin();
        }
    	var d = cC.split(',');
        var tt = '';
        var allCoin='';
        for (var i=0;i<d.length;i++) {
            //hkc neo放最后
            // if(d[i][0]=='neo')d.push(d.splice(i,1)[0]);
            d[i]=d[i].split('__');
            if (coinShortName == d[i][0]){
                //手续费
                // $('.fee-span').html(d[i][2]*100 + '%');
            }
            //新加btc，此处删除
            if(d[i][0]=='btc')continue;
            allCoin+='<li><a class="'+(d[i][0]==coinShortName?'active':'')+'" href="/trade/coinTrade.html?id='+d[i][1]+'&shortName='+d[i][0]+'&coinType='+(localStorage.getItem('coinType')||1)+'"><i class="coin coin_19 coin_'+d[i][0]+'_19"></i>'
            +'<div class="all_coin_name"><p class="coin-name">'+d[i][0].toUpperCase()+'</p>'+'</div></a></li>'
        }
        $('#all_coin').append(allCoin);
        // $('#leftAllCoinMap_ul').html(allCoin);
        // if($('#leftAllCoinMap_ul').height()==$('.leftAllCoinMap_box').height()){
        //     $('.next').addClass('noMore');
        // }
}


//type:'trade','recharge','withdraw','entrust','dealinfo'
function renderAllcoin(type){

    $.each(allMarkets,function(k){
        $.get(WebHelper.QueryAllCoin+'?coinType='+k,function(d){
            renderAllcoinData(type,d.data,k);
        })
    })
}
function renderAllcoinData(type,d,k) {
    var marketName='';
    if(type.indexOf('entrust')>-1||type.indexOf('transaction')>-1){
        marketName='/'+allMarkets[k].toUpperCase()
    }
    var allCoin='';
    for( var i=0;i<d.length;i++){
        var temp=d[i];
        var _k=k||d[i][10]
        // if(temp[0]=='btc')continue;
        allCoin +='<li><a href="/'+type+'.html?id='+temp[1]+'&shortName='+temp[0].toLowerCase()+'&coinType='+_k+'"><i class="coin coin_19 coin_'+temp[0].toLowerCase()+'_19"></i>'
        +'<div class="all_coin_name"><p class="coin-name">'+(temp[0].toLowerCase()=='bitcny'?'BitCNY':temp[0].toUpperCase())+marketName+'</p>'+'</div></a></li>';
    }
    $('#all_coin'+k).append(allCoin);
}


/**
 *gg新增代码
**/


function inputFC(){
    $('input').focus(function(){
        $(this).addClass('cur');
    });
    $('input').blur(function(){
        var str='';
        $(this).removeClass('cur');
        if($(this).val()==''&&!$(this).hasClass('referrerId')){
            str=lang('内容不能为空');
        }else if($(this).hasClass('WeakPwNo')&&checkPassWordNoFeeble($(this).val())){
            str=lang('密码强度不能为弱密码')
        }else if($(this).attr('name')=='email'){
            str=checkemail($(this));
            if(location.href.indexOf('register')>-1&&!str){
                var emailorNum=1//1邮箱，0手机
                if($(this).val().indexOf('@')==-1){emailorNum=0;}
                $.ajax({
                    type:'GET',
                    url:WebHelper.checkMailOrPhoneExists,
                    async:false,
                    data:'type='+emailorNum+'&checkParam='+$(this).val(),
                    success:function(d){
                        if(d.status==0){
                            str=lang(d.msg);
                        }else{

                        }
                    }
                })
            }
        }else if($(this).hasClass('repeatPw')){
            if($(this).val()!=$('input[name='+$(this).attr('name').replace('re','')+']').val()){
                str=lang('两次输入密码不一致')
            }
        }

        if(str){
            $(this).parent().find('.tips').remove()
			$(this).parent().append('<span class="tips">'+str+'</span>');
		}else{
			$(this).parent().find('.tips').remove()
		}
	});
}


//退出登录
function logOut(){
	$.post(WebHelper.LoginOut,'',function(msg){
		clearCookie();
		if(msg.status===1){
			location.href='/index.html'
		}else{
			alert(lang('未知错误，请联系管理员'));
		}
	},'json')

}

function inspectLogin(){
	$.ajax({
        type: 'POST',
        url: WebHelper.CheckLogin,
        contentType : 'application/json',
        data : JSON.stringify({'token':$.cookie('token')}),
        dataType: 'json',
        success: function (d) {
        	if(d.status===1){
    			return true;
    		}else{
    			clearCookie();
    			/*if(/(trade\/|index)/g.test(location.href)){
    				return;
    			}else{
    				redirectLoginPage();
    			}*/
    			return false;
    		}
        }
    })
}

function clearCookie(){
	$.cookie('token','',{expires:-1,path:'/'});
	$.cookie('USER','',{expires:-1,path:'/'});
	$.cookie('userName','',{expires:-1,path:'/'});
    $.cookie('userFlag','',{expires:-1,path:'/'});
}

function redirectLoginPage(){
	$(".top-login .login").css('display','block');
	$(".top-user-email").css('display','none');
	location.href='/user/login.html'
}

// var checkStatus = function(status){
// 	if(status == -9){
// 		if(alert(lang('登录超时，请重新登录'))){
// 			redirectLoginPage();
// 		}
// 	}else if(status == 1){
// 		//操作成功
// 	}else{
// 		//错误描述
// 	}
// }

function encryptUserName(str){
    var newStr='';
    if(str.indexOf('@')>1){
        newStr=str.replace(str.substring(1,str.indexOf('@')-1),'***');
    }else{
        newStr=str.replace(str.substring(1,str.length-1),'***');
    }
    return newStr;
}
//取前5，后1
function encryptUserNamefive(str){
    var newStr='';
    if(str.indexOf('@')>1){
        if(str.indexOf('@')<8){
            return encryptUserName(str);
        }
        newStr=str.substring(0,5)+'***'+str.substring(str.indexOf('@')-1);
    }else{
       newStr=str.substring(0,5)+'***'+str.substring(str.length-1);
    }
    return newStr;
}
//允许/禁止按钮提交val:true禁止
function allowOrForbidSubmit(_this,val) {
    if(val){
        $(_this).addClass('forbidClick')
        $(_this).val(lang('处理中...'))
        return true;
    }else{
        $(_this).removeClass('forbidClick');
        return false;
    }
}


//首页和交易页搜索
function searchCoin() {
    var txt = $.trim($('#searchCoinInp').val().toLowerCase());
    var _li = $('.price_today_ul li');
    _li.each(function() {
        if ($(this).find('dt i').data('coinname').indexOf(txt) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}
//动态配置交易区，委托和记录页面
function getCoinTypeOption() {
    var typeHtml='';
    var type_coinBox='';
    for(var j=0;j<allMarkets_arr.length;j++){
        var i=allMarkets_arr[j][0];
        typeHtml+='<div class="'+(i==1?'active':'')+'" data-coinType="'+i+'" data-cont="BTC交易区">'+allMarkets_arr[j][1].toUpperCase()+lang('交易区')+'</div>';
        type_coinBox+='<ul id="all_coin'+i+'" style="display: '+(i==1?'block':'none')+';"></ul>'
    }
    $('.market_type').html(typeHtml);
    $('.all_coin_box').html(type_coinBox);
}
$(function(){
    // $.get(WebHelper.friendLink,function(d){
    //     var friendsHtml='';
    //     if(d.status==1){
    //         var friends=d.data;
    //         for(var i=0;i<friends.length;i++){
    //             friendsHtml+='<a href="'+friends[i]['furl']+'" title="'+friends[i]['fname']+'" target="_blank"><img src="/'+friends[i]['logo']+'" alt=""></a>'
    //         }
    //     }
    // })
    var friends=[
        {href:'https://www.coingogo.com',src:'/static/customer/images/coingogo.png'},
        {href:'https://www.btc123.com',src:'/static/customer/images/btc123.png'},
        {href:'http://www.feixiaohao.com',src:'/static/customer/images/feixiaohao.png'},
        {href:'http://www.chainfor.com',src:'/static/customer/images/chainfor.png'},
        {href:'http://www.8btc.com',src:'/static/customer/images/8btc.png'},
        {href:'http://www.btc126.com',src:'/static/customer/images/btc126.png'},
        {href:'http://www.qukuaiwang.com.cn',src:'/static/customer/images/qukuaiwang.png'},
        {href:'http://zxbcc.com',src:'/static/customer/images/zxbcc.png'},
        {href:'http://www.bitcoin86.com',src:'/static/customer/images/bitcoin86.png'},
        {href:'http://www.btc798.com',src:'/static/customer/images/btc798.png'},
        {href:'http://www.jgy.com',src:'/static/customer/images/jgy.png'},
        {href:'http://www.jinse.com',src:'/static/customer/images/jinse.png'},
        {href:'http://www.lechain.com',src:'/static/customer/images/lechain.png'},
        {href:'https://www.lianguwang.com/home',src:'/static/customer/images/lianguwang.png'},
        {href:'http://www.gongxiangcj.com',src:'/static/customer/images/gongxiangcj.png'},
        {href:'http://www.weilaicaijing.com',src:'/static/customer/images/weilaicaijing.png'},
        {href:'http://bitejie.net',src:'/static/customer/images/bitejie.png'},
        {href:'http://btcif.com',src:'/static/customer/images/btcif.png'},
        {href:'http://www.chainnews.com',src:'/static/customer/images/chainnews.png'},
        {href:'http://www.block123.com',src:'/static/customer/images/block123.png'},
        {href:'http://www.bitett.com',src:'/static/customer/images/bitett.png'},
        {href:'http://www.haob.cc',src:'/static/customer/images/haob.png'},
        {href:'https://www.coldlar.com',src:'/static/customer/images/coldlar.png'},
        {href:'http://www.qukuainews.cn',src:'/static/customer/images/qukuainews.png'},
        {href:'https://www.bitansuo.com',src:'/static/customer/images/bitansuo.png'},
        {href:'http://chainknow.com',src:'/static/customer/images/chainknow.png'},
        {href:'http://www.lianjie2100.com',src:'/static/customer/images/lianjie2100.png'},
        {href:'http://www.bishijie.com/kuaixun/',src:'/static/customer/images/bishijie.png'},
        {href:'http://shop.bitmain.com/',src:'/static/customer/images/bitmain.png'},
        {href:'https://btc.com/',src:'/static/customer/images/btccom.png'},
        {href:'https://www.aicoin.net.cn/',src:'/static/customer/images/aicoin.png'},
        {href:'http://www.178bit.com/',src:'/static/customer/images/178bit.png'},
        {href:'http://www.qkzj.com',src:'/static/customer/images/qkzj.png'},
        {href:'http://fn.com/',src:'/static/customer/images/fn.png'},
    ];
    var friendsHtml='';
    for(var i=0;i<friends.length;i++){
        friendsHtml+='<a href="'+friends[i]['href']+'" target="_blank"><img src="'+friends[i]['src']+'" alt=""></a>'
    }
    $('.friendLink div').html(friendsHtml);
    
})